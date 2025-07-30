import {
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
  IExecuteFunctions,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";
import { makeStandardBitrix24Call } from "../GenericFunctions";

/**
 * Class for handling Bitrix24 CRM user field configuration operations
 */
export class UserFieldConfigResourceHandler extends ResourceHandlerBase {
  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process all operations for user field configuration
   */
  public async process(): Promise<INodeExecutionData[]> {
    const operation = this.getNodeParameter("operation", 0) as string;

    for (let i = 0; i < this.items.length; i++) {
      try {
        const continueOnFail = this.getNodeParameter(
          "continueOnFail",
          i,
          false
        ) as boolean;

        // Process items according to the operation
        if (operation === "add") {
          await this.handleAdd(i);
        } else if (operation === "addMultiple") {
          await this.handleAddMultiple(i);
        } else if (operation === "delete") {
          await this.handleDelete(i);
        } else if (operation === "get") {
          await this.handleGet(i);
        } else if (operation === "getList") {
          await this.handleGetList(i);
        } else if (operation === "update") {
          await this.handleUpdate(i);
        } else {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `The operation "${operation}" is not supported for user field configuration!`,
            { itemIndex: i }
          );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          this.addErrorToReturnData(error, i);
        } else {
          throw error;
        }
      }
    }

    return this.returnData;
  }

  // Add this method to generate the correct prefix based on entity type
  private getFieldNamePrefix(entityId: string): string {
    // Smart Process uses format UF_CRM_[ID]_
    if (entityId.startsWith("CRM_")) {
      const dynamicId = entityId.replace("CRM_", "");
      return `UF_CRM_${dynamicId}_`;
    }

    // For standard CRM entities
    if (
      entityId === "DEAL" ||
      entityId === "LEAD" ||
      entityId === "CONTACT" ||
      entityId === "COMPANY" ||
      entityId === "QUOTE"
    ) {
      return "UF_CRM_";
    }

    // Default CRM entities use UF_CRM_
    return "UF_CRM_";
  }

  // Add this helper method to convert entity type to module ID
  private getModuleId(entityId: string): string {
    console.log("Getting moduleId for entityId:", entityId);

    // For Smart Process entities (starting with CRM_)
    if (entityId.startsWith("CRM_")) {
      return "crm";
    }

    // For standard CRM entities
    if (
      entityId === "DEAL" ||
      entityId === "LEAD" ||
      entityId === "CONTACT" ||
      entityId === "COMPANY" ||
      entityId === "QUOTE"
    ) {
      return "crm";
    }

    // For tasks
    if (entityId === "TASK") {
      return "tasks";
    }

    // Default to CRM module
    return "crm";
  }

  // Convert field data keys to camelCase format
  private convertToCamelCase(fieldData: IDataObject): IDataObject {
    const camelCaseData: IDataObject = {};

    // Map of uppercase keys to API expected format (based on Bitrix24 docs)
    const keyMap: { [key: string]: string } = {
      ENTITY_ID: "entityId",
      FIELD_NAME: "fieldName",
      USER_TYPE_ID: "userTypeId",
      EDIT_FORM_LABEL: "editFormLabel",
      LIST_COLUMN_LABEL: "listColumnLabel",
      LIST_FILTER_LABEL: "listFilterLabel",
      XML_ID: "xmlId",
      SORT: "sort",
      MULTIPLE: "multiple",
      MANDATORY: "mandatory",
      SHOW_IN_LIST: "showInList",
      EDIT_IN_LIST: "editInList",
      SHOW_FILTER: "showFilter",
      IS_SEARCHABLE: "isSearchable",
      SETTINGS: "settings",
      DEFAULT_VALUE: "defaultValue",
      USER_TYPE_SETTINGS: "userTypeSettings",
      // Keep enum as-is (lowercase)
      enum: "enum",
    };

    // Process each field
    for (const [key, value] of Object.entries(fieldData)) {
      // Handle special cases first
      if (key === "enum") {
        // Keep enum as-is for enumeration fields
        camelCaseData.enum = value;
        continue;
      }

      // Convert key using mapping or default camelCase conversion
      const camelKey =
        keyMap[key] ||
        key.toLowerCase().replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());

      camelCaseData[camelKey] = value;
    }

    return camelCaseData;
  }

  /**
   * Handle the add operation
   */
  private async handleAdd(itemIndex: number): Promise<void> {
    // Check if using structured builder or direct JSON
    const useStructureBuilder = this.getNodeParameter(
      "useStructureBuilder",
      itemIndex,
      true
    ) as boolean;
    let fieldData: IDataObject = {};

    if (!useStructureBuilder) {
      // Get fields as direct JSON input
      const fields = this.getNodeParameter("fields", itemIndex) as string;

      // Parse fields
      fieldData = this.parseJsonParameter(
        fields,
        'The "fields" parameter must be valid JSON',
        itemIndex
      );
    } else {
      // Process the structured fields - now using the flat structure

      // Get entity type and determine the proper prefix
      const entityType = this.getNodeParameter(
        "entityType",
        itemIndex
      ) as string;

      // Map entity types to Bitrix24 API expected values
      const entityTypeMapping: { [key: string]: string } = {
        LEAD: "CRM_LEAD",
        DEAL: "CRM_DEAL",
        CONTACT: "CRM_CONTACT",
        COMPANY: "CRM_COMPANY",
        QUOTE: "CRM_QUOTE",
      };

      // Use mapped value if available, otherwise use original
      fieldData.ENTITY_ID = entityTypeMapping[entityType] || entityType;

      // Handle custom entity type
      if (entityType === "CUSTOM") {
        const customEntityType = this.getNodeParameter(
          "customEntityType",
          itemIndex,
          ""
        ) as string;
        if (customEntityType) {
          fieldData.ENTITY_ID = customEntityType;
        }
      }

      // Handle Smart Process Type
      if (entityType === "DYNAMIC_ENTITY") {
        const smartProcessType = this.getNodeParameter(
          "smartProcessType",
          itemIndex,
          ""
        ) as string;
        if (smartProcessType) {
          console.log("Using Smart Process Type:", smartProcessType);

          // CRM_ format is already correct from the smartProcessType parameter
          // No need for conversion, just use it directly
          fieldData.ENTITY_ID = smartProcessType;

          console.log("Set ENTITY_ID to:", fieldData.ENTITY_ID);
        }
      }

      // Get basic field properties
      fieldData.USER_TYPE_ID = this.getNodeParameter(
        "fieldType",
        itemIndex
      ) as string;

      // Get the field name and add the appropriate prefix
      const fieldName = this.getNodeParameter("fieldName", itemIndex) as string;
      const prefix = this.getFieldNamePrefix(fieldData.ENTITY_ID as string);
      fieldData.FIELD_NAME = fieldName.startsWith(prefix)
        ? fieldName.toUpperCase()
        : `${prefix}${fieldName.toUpperCase()}`;

      // Get the field label and set all form labels
      const label = this.getNodeParameter("fieldLabel", itemIndex) as string;

      // Create label object with both "en" and "vn" keys
      const labelObject = {
        en: label,
        vn: label,
      };

      // Set all three label fields with the same format
      fieldData.EDIT_FORM_LABEL = labelObject;
      fieldData.LIST_COLUMN_LABEL = labelObject;
      fieldData.LIST_FILTER_LABEL = labelObject;

      // Process field behavior properties
      const fieldBehavior = this.getNodeParameter("fieldBehavior", itemIndex, {
        values: {},
      }) as IDataObject;
      if (fieldBehavior.values) {
        const behaviorValues = fieldBehavior.values as IDataObject;
        Object.entries(behaviorValues).forEach(([key, value]) => {
          // Convert boolean values to 'Y'/'N'
          if (typeof value === "boolean") {
            fieldData[key] = value ? "Y" : "N";
          } else {
            // If the value exists and is not empty, add it
            if (value !== undefined && value !== "") {
              fieldData[key] = value;
            }
          }
        });
      }

      // Process type-specific settings
      const fieldTypeSettings = this.getNodeParameter(
        "fieldTypeSettings",
        itemIndex,
        { values: {} }
      ) as IDataObject;
      if (fieldTypeSettings.values) {
        const settings: IDataObject = {};
        const typeValues = fieldTypeSettings.values as IDataObject;

        // Handle special case for default value
        if (
          typeValues.DEFAULT_VALUE !== undefined &&
          typeValues.DEFAULT_VALUE !== ""
        ) {
          fieldData.DEFAULT_VALUE = typeValues.DEFAULT_VALUE;
        }

        // Add all other type-specific settings
        Object.entries(typeValues).forEach(([key, value]) => {
          if (
            key !== "DEFAULT_VALUE" &&
            value !== undefined &&
            value !== "" &&
            value !== 0
          ) {
            settings[key] = value;
          }
        });

        // If we have settings, add them to fieldData
        if (Object.keys(settings).length > 0) {
          fieldData.SETTINGS = settings;
        }
      }

      // Process enumeration values
      const enumValues = this.getNodeParameter("enumValues", itemIndex, {
        values: [],
      }) as IDataObject;
      if (
        enumValues.values &&
        Array.isArray(enumValues.values) &&
        enumValues.values.length > 0 &&
        fieldData.USER_TYPE_ID === "enumeration"
      ) {
        // Create enum array directly (not in SETTINGS)
        const enumItems: IDataObject[] = [];

        // Process each enum value
        for (const enumValue of enumValues.values as IDataObject[]) {
          if (enumValue.VALUE) {
            enumItems.push({
              value: enumValue.VALUE, // Use lowercase 'value' as per API docs
              def: "N", // Default value flag
              sort: enumValue.SORT || 100,
            });
          }
        }

        if (enumItems.length > 0) {
          // Set first item as default if no default is specified
          if (
            enumItems.length > 0 &&
            !enumItems.some((item) => item.def === "Y")
          ) {
            enumItems[0].def = "Y";
          }
          fieldData.enum = enumItems; // Use 'enum' directly, not in SETTINGS
        }
      }

      // Special handling for CRM field types
      if (fieldData.USER_TYPE_ID === "crm") {
        // Set default value to lead if not set
        if (!fieldData.DEFAULT_VALUE) {
          fieldData.DEFAULT_VALUE = "lead";
        }

        console.log("Adding CRM field type settings for field", {
          fieldName,
          entityId: fieldData.ENTITY_ID,
        });

        // Create USER_TYPE_SETTINGS with standard CRM entity types
        fieldData.USER_TYPE_SETTINGS = {
          LEAD: "Y",
          DEAL: "Y",
          CONTACT: "Y",
          COMPANY: "Y",
        };

        console.log(
          "Added CRM field settings:",
          JSON.stringify(fieldData.USER_TYPE_SETTINGS)
        );
      }
    }

    // API call for single field
    console.log("Full fieldData object for API call:", fieldData);

    // Convert to camelCase once for both logging and API call
    const camelCaseData = this.convertToCamelCase(fieldData);

    console.log("Making API call with converted parameters:", {
      moduleId: this.getModuleId(fieldData.ENTITY_ID as string),
      field: camelCaseData,
    });

    try {
      console.log("Making API call to userfieldconfig.add with parameters", {
        moduleId: this.getModuleId(fieldData.ENTITY_ID as string),
        fieldEntityId: camelCaseData.entityId,
        fieldName: camelCaseData.fieldName,
        userTypeId: camelCaseData.userTypeId,
      });

      const responseData = await this.makeApiCall(
        "userfieldconfig.add",
        {
          moduleId: this.getModuleId(fieldData.ENTITY_ID as string),
          field: camelCaseData, // Use the converted data
        },
        {},
        itemIndex
      );

      console.log(
        "API call successful, response:",
        JSON.stringify(responseData, null, 2)
      );
      console.log("Bitrix24 API Response Structure:", {
        status: responseData.status,
        result:
          typeof responseData.result === "object"
            ? "object"
            : responseData.result,
        error: responseData.error,
        time: responseData.time,
      });
      if (responseData.error) {
        console.error("Bitrix24 API Error:", responseData.error);
      }
      this.addResponseToReturnData(responseData, itemIndex);
    } catch (error) {
      console.error("API call failed with error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }

  /**
   * Handle the addMultiple operation
   */
  private async handleAddMultiple(itemIndex: number): Promise<void> {
    // Get entity type
    const entityType = this.getNodeParameter(
      "multipleEntityType",
      itemIndex
    ) as string;

    // Map entity types to Bitrix24 API expected values
    const entityTypeMapping: { [key: string]: string } = {
      LEAD: "CRM_LEAD",
      DEAL: "CRM_DEAL",
      CONTACT: "CRM_CONTACT",
      COMPANY: "CRM_COMPANY",
      QUOTE: "CRM_QUOTE",
    };

    // Use mapped value if available, otherwise use original
    let finalEntityId = entityTypeMapping[entityType] || entityType;

    // Handle custom entity type
    if (entityType === "CUSTOM") {
      const customEntityType = this.getNodeParameter(
        "multipleCustomEntityType",
        itemIndex,
        ""
      ) as string;
      if (customEntityType) {
        finalEntityId = customEntityType;
      }
    }

    // Handle Smart Process Type
    if (entityType === "DYNAMIC_ENTITY") {
      const smartProcessType = this.getNodeParameter(
        "multipleSmartProcessType",
        itemIndex,
        ""
      ) as string;
      if (smartProcessType) {
        console.log("Using Smart Process Type (multiple):", smartProcessType);

        // CRM_ format is already correct from the smartProcessType parameter
        // No need for conversion, just use it directly
        finalEntityId = smartProcessType;

        console.log("Set finalEntityId to:", finalEntityId);
      }
    }

    // Get the field name prefix based on entity type
    const fieldNamePrefix = this.getFieldNamePrefix(finalEntityId);

    // Get field definitions
    const fieldDefinitions = this.getNodeParameter(
      "fieldDefinitions.fields",
      itemIndex,
      []
    ) as IDataObject[];

    const results: IDataObject[] = [];

    // Process each field definition
    for (const fieldDef of fieldDefinitions) {
      try {
        const fieldData: IDataObject = {
          ENTITY_ID: finalEntityId,
          ...fieldDef,
        };

        // Add appropriate prefix to field name if not already present
        if (fieldData.FIELD_NAME && typeof fieldData.FIELD_NAME === "string") {
          const fieldName = fieldData.FIELD_NAME as string;
          fieldData.FIELD_NAME = fieldName.startsWith(fieldNamePrefix)
            ? fieldName.toUpperCase()
            : `${fieldNamePrefix}${fieldName.toUpperCase()}`;
        }

        // Handle labels properly
        // Make sure editFormLabel is set
        if (!fieldData.EDIT_FORM_LABEL && fieldData.FIELD_NAME) {
          // Create object with both "en" and "vn" keys
          fieldData.EDIT_FORM_LABEL = {
            en: fieldData.FIELD_NAME,
            vn: fieldData.FIELD_NAME,
          };
        } else if (typeof fieldData.EDIT_FORM_LABEL === "string") {
          // Convert string label to object format
          fieldData.EDIT_FORM_LABEL = {
            en: fieldData.EDIT_FORM_LABEL,
            vn: fieldData.EDIT_FORM_LABEL,
          };
        }

        // Set LIST_COLUMN_LABEL and LIST_FILTER_LABEL to same format as EDIT_FORM_LABEL if not provided
        if (fieldData.EDIT_FORM_LABEL) {
          if (!fieldData.LIST_COLUMN_LABEL) {
            fieldData.LIST_COLUMN_LABEL = fieldData.EDIT_FORM_LABEL;
          } else if (typeof fieldData.LIST_COLUMN_LABEL === "string") {
            // Convert string to object format
            fieldData.LIST_COLUMN_LABEL = {
              en: fieldData.LIST_COLUMN_LABEL,
              vn: fieldData.LIST_COLUMN_LABEL,
            };
          }

          if (!fieldData.LIST_FILTER_LABEL) {
            fieldData.LIST_FILTER_LABEL = fieldData.EDIT_FORM_LABEL;
          } else if (typeof fieldData.LIST_FILTER_LABEL === "string") {
            // Convert string to object format
            fieldData.LIST_FILTER_LABEL = {
              en: fieldData.LIST_FILTER_LABEL,
              vn: fieldData.LIST_FILTER_LABEL,
            };
          }
        }

        // Set default values for SHOW_FILTER and IS_SEARCHABLE if not provided
        if (fieldData.SHOW_FILTER === undefined) {
          fieldData.SHOW_FILTER = true;
        }

        if (fieldData.IS_SEARCHABLE === undefined) {
          fieldData.IS_SEARCHABLE = true;
        }

        // Convert boolean values to Y/N
        for (const [key, value] of Object.entries(fieldData)) {
          if (typeof value === "boolean") {
            fieldData[key] = value ? "Y" : "N";
          }
        }

        // Special handling for CRM field types
        if (fieldData.USER_TYPE_ID === "crm") {
          // Set default value to lead if not set
          if (!fieldData.DEFAULT_VALUE) {
            fieldData.DEFAULT_VALUE = "lead";
          }

          console.log("Adding CRM field type settings for field", {
            fieldName: fieldData.FIELD_NAME,
            entityId: finalEntityId,
          });

          // Create USER_TYPE_SETTINGS with standard CRM entity types
          fieldData.USER_TYPE_SETTINGS = {
            LEAD: "Y",
            DEAL: "Y",
            CONTACT: "Y",
            COMPANY: "Y",
          };

          console.log(
            "Added CRM field settings:",
            JSON.stringify(fieldData.USER_TYPE_SETTINGS)
          );
        }

        // Process additional settings if provided
        if (fieldData.additionalSettings) {
          try {
            let settings: IDataObject = {};

            if (typeof fieldData.additionalSettings === "string") {
              settings = JSON.parse(
                fieldData.additionalSettings
              ) as IDataObject;
            } else if (typeof fieldData.additionalSettings === "object") {
              settings = fieldData.additionalSettings as IDataObject;
            }

            // Add settings to fieldData
            for (const [key, value] of Object.entries(settings)) {
              if (value !== undefined) {
                fieldData[key] = value as
                  | string
                  | number
                  | boolean
                  | IDataObject;
              }
            }

            // Remove the additionalSettings property
            delete fieldData.additionalSettings;
          } catch (err) {
            console.error("Failed to parse additional settings:", err);
          }
        }

        // Log the request parameters for debugging
        const camelCaseData = this.convertToCamelCase(fieldData);
        console.log("Adding field with parameters:", {
          moduleId: this.getModuleId(finalEntityId),
          field: camelCaseData,
        });

        // API call for multiple fields - call API once per field instead of batching
        try {
          const responseData = await this.makeApiCall(
            "userfieldconfig.add",
            {
              moduleId: this.getModuleId(finalEntityId),
              field: camelCaseData,
            },
            {},
            itemIndex
          );

          console.log(
            "API call successful, response for field " +
              fieldData.FIELD_NAME +
              ":",
            JSON.stringify(responseData, null, 2)
          );
          console.log("Bitrix24 API Response Structure:", {
            status: responseData.status,
            result:
              typeof responseData.result === "object"
                ? "object"
                : responseData.result,
            error: responseData.error,
            time: responseData.time,
          });
          if (responseData.error) {
            console.error("Bitrix24 API Error:", responseData.error);
          }
          results.push({
            fieldName: fieldData.FIELD_NAME,
            success: true,
            response: responseData,
          });
        } catch (apiError) {
          // Log detailed API error for debugging
          console.error("API Error:", apiError);
          results.push({
            fieldName: fieldData.FIELD_NAME || "unknown",
            success: false,
            error:
              apiError instanceof Error ? apiError.message : String(apiError),
          });
        }
      } catch (error) {
        // Always continue on failures for multiple field creation
        results.push({
          fieldName: fieldDef.FIELD_NAME || "unknown",
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Add all results to return data
    this.addResponseToReturnData({ result: results }, itemIndex);
  }

  /**
   * Handle the delete operation
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const id = this.getNodeParameter("id", itemIndex) as string;

    // Get entity ID directly from the parameter
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;

    // Log the delete operation parameters for debugging
    console.log("Deleting user field with parameters:", {
      moduleId: this.getModuleId(entityId),
      id: id,
      entityType: entityId,
    });

    // API call with moduleId included and id parameter only
    // The id parameter is the full ID of the user field, not entityTypeId
    const responseData = await this.makeApiCall(
      "userfieldconfig.delete",
      {
        moduleId: this.getModuleId(entityId),
        id: id, // Ensure id is passed correctly as the field ID
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the get operation
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const id = this.getNodeParameter("id", itemIndex) as string;

    // Get entity ID - required for moduleId parameter
    const entityId = this.getNodeParameter(
      "entityId",
      itemIndex,
      "CRM"
    ) as string;

    // Log the get operation parameters for debugging
    console.log("Getting user field with parameters:", {
      moduleId: this.getModuleId(entityId),
      id: id,
      entityType: entityId,
    });

    // API call with moduleId included as required by userfieldconfig.get
    const responseData = await this.makeApiCall(
      "userfieldconfig.get",
      {
        moduleId: this.getModuleId(entityId),
        id,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the get list operation
   */
  private async handleGetList(itemIndex: number): Promise<void> {
    const filter = this.getNodeParameter("filter", itemIndex, "{}") as string;
    const order = this.getNodeParameter("order", itemIndex, "{}") as string;
    const select = this.getNodeParameter("select", itemIndex, []) as string[];
    const start = this.getNodeParameter("start", itemIndex, 0) as number;

    // Parse filter and order
    const filterData = this.parseJsonParameter(
      filter,
      'The "filter" parameter must be valid JSON',
      itemIndex
    );

    const orderData = this.parseJsonParameter(
      order,
      'The "order" parameter must be valid JSON',
      itemIndex
    );

    const body: IDataObject = {};

    if (Object.keys(filterData).length) {
      body.filter = filterData;
    }

    if (Object.keys(orderData).length) {
      body.order = orderData;
    }

    if (select.length) {
      body.select = select;
    }

    if (start) {
      body.start = start;
    }

    // API call
    const responseData = await this.makeApiCall(
      "userfieldconfig.list",
      body,
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the update operation
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const id = this.getNodeParameter("id", itemIndex) as string;

    // Get update fields from the collection
    const updateFieldsCollection = this.getNodeParameter(
      "updateFields",
      itemIndex,
      { fields: [] }
    ) as IDataObject;

    // Process updates
    const fieldData: IDataObject = {};

    if (
      updateFieldsCollection.fields &&
      Array.isArray(updateFieldsCollection.fields)
    ) {
      for (const field of updateFieldsCollection.fields as IDataObject[]) {
        if (field.name) {
          const fieldName = field.name as string;

          // Check if this is a boolean field
          if (field.isBoolean === true) {
            fieldData[fieldName] = field.boolValue ? "Y" : "N";
          } else {
            fieldData[fieldName] = field.value;
          }
        }
      }
    }

    // API call for update - simplified parameter structure
    const responseData = await this.makeApiCall(
      "userfieldconfig.update",
      {
        id,
        field: this.convertToCamelCase(fieldData),
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }
}

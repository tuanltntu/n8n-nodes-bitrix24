import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";
import { makeStandardBitrix24Call } from "../GenericFunctions";

/**
 * Handle Bitrix24 Automation rule operations
 */
export class AutomationResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    addRule: "bizproc.robot.add",
    updateRule: "bizproc.robot.update",
    deleteRule: "bizproc.robot.delete",
    getRule: "bizproc.robot.get",
    getAllRules: "bizproc.robot.list",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process automation operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "createRule":
            await this.handleCreateRule(i);
            break;
          case "updateRule":
            await this.handleUpdateRule(i);
            break;
          case "deleteRule":
            await this.handleDeleteRule(i);
            break;
          case "getRule":
            await this.handleGetRule(i);
            break;
          case "getAllRules":
            await this.handleGetAllRules(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Unsupported operation "${operation}" for Automation resource`,
              { itemIndex: i }
            );
        }
      } catch (error) {
        if (this.executeFunctions.continueOnFail()) {
          this.returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return this.returnData;
  }

  /**
   * Get endpoint for the specified operation
   */
  private getEndpoint(operation: string): string {
    const endpointMap = {
      createRule: "addRule",
      updateRule: "updateRule",
      deleteRule: "deleteRule",
      getRule: "getRule",
      getAllRules: "getAllRules",
    };

    const endpoint = this.resourceEndpoints[endpointMap[operation]];
    if (!endpoint) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Unsupported operation "${operation}" for Automation resource`
      );
    }

    return endpoint;
  }

  /**
   * Format properties from UI format to API format
   */
  private formatProperties(itemIndex: number): IDataObject {
    const properties: IDataObject = {};

    // Get common properties
    const commonProperties = this.getNodeParameter(
      "commonProperties",
      itemIndex,
      {}
    ) as IDataObject;

    // Add common properties
    if (Object.keys(commonProperties).length > 0) {
      Object.assign(properties, commonProperties);
    }

    // Handle custom properties collection
    const propertiesCollection = this.getNodeParameter(
      "propertiesCollection",
      itemIndex,
      { properties: [] }
    ) as IDataObject;

    if (
      propertiesCollection.properties &&
      Array.isArray(propertiesCollection.properties)
    ) {
      const customProps = propertiesCollection.properties as IDataObject[];

      for (const prop of customProps) {
        const name = prop.name as string;

        if (prop.type === "string") {
          properties[name] = prop.stringValue;
        } else if (prop.type === "number") {
          properties[name] = prop.numberValue;
        } else if (prop.type === "boolean") {
          properties[name] = prop.booleanValue;
        } else if (prop.type === "array" || prop.type === "object") {
          try {
            properties[name] = JSON.parse(prop.complexValue as string);
          } catch (error) {
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Invalid JSON in property "${name}": ${error.message}`,
              { itemIndex }
            );
          }
        }
      }
    }

    // Handle direct JSON properties input
    const useJsonProperties = this.getNodeParameter(
      "useJsonProperties",
      itemIndex,
      false
    ) as boolean;

    if (useJsonProperties) {
      const jsonProperties = this.getNodeParameter(
        "properties",
        itemIndex,
        ""
      ) as string;

      if (jsonProperties) {
        try {
          const parsedProps = JSON.parse(jsonProperties);
          Object.assign(properties, parsedProps);
        } catch (error) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `Invalid JSON in properties: ${error.message}`,
            { itemIndex }
          );
        }
      }
    }

    return properties;
  }

  /**
   * Handle creating an automation rule
   */
  private async handleCreateRule(itemIndex: number): Promise<void> {
    const documentType = this.getNodeParameter(
      "documentType",
      itemIndex
    ) as string;
    const ruleName = this.getNodeParameter("name", itemIndex) as string;
    const ruleCode = this.getNodeParameter("code", itemIndex) as string;
    const handlerUrl = this.getNodeParameter("handler", itemIndex) as string;
    const authUserId = this.getNodeParameter("authUserId", itemIndex) as number;
    const useSubscription = this.getNodeParameter(
      "useSubscription",
      itemIndex,
      false
    ) as boolean;

    // Xử lý đặc biệt cho document type là SPA
    let documentTypeArray: string[] = [documentType];

    console.log("handleCreateRule processing document type:", documentType);

    if (documentType === "spa_placement") {
      // Lấy SPA ID từ spaPlacement
      const spaId = this.getNodeParameter("spaPlacement", itemIndex) as string;

      console.log("SPA placement ID:", spaId);

      if (!spaId) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "SPA Placement ID is required when Document Type is SPA",
          { itemIndex }
        );
      }

      // Format document type theo định dạng yêu cầu cho SPA
      // ['crm', 'Bitrix\Crm\Integration\BizProc\Document\Dynamic', 'DYNAMIC_XXX']
      documentTypeArray = [
        "crm",
        "Bitrix\\Crm\\Integration\\BizProc\\Document\\Dynamic",
        spaId,
      ];

      console.log("Final document type array for SPA:", documentTypeArray);
    } else {
      // Xử lý các document type thông thường
      documentTypeArray = [documentType];
      console.log("Using standard document type:", documentTypeArray);
    }

    // Get additional properties for the rule
    const commonProperties = this.getNodeParameter(
      "commonProperties",
      itemIndex,
      {}
    ) as IDataObject;

    // Get custom properties for the rule
    const propertiesCollection = this.getNodeParameter(
      "propertiesCollection.properties",
      itemIndex,
      []
    ) as IDataObject[];

    // Build properties object from collection
    const properties: IDataObject = {};
    if (propertiesCollection && propertiesCollection.length > 0) {
      for (const prop of propertiesCollection) {
        if (prop.name && prop.type && prop.value) {
          properties[prop.name as string] = {
            Name: prop.label || prop.name,
            Type: prop.type,
            Default: prop.value,
            Required: prop.required === true,
          };
        }
      }
    }

    // Build final request parameters
    const requestParams: IDataObject = {
      DOCUMENT_TYPE: documentTypeArray,
      CODE: ruleCode,
      NAME: ruleName,
      HANDLER: handlerUrl,
      AUTH_USER_ID: authUserId,
      USE_SUBSCRIPTION: useSubscription ? "Y" : "N",
      PROPERTIES: properties,
    };

    // Add additional common properties
    if (commonProperties && Object.keys(commonProperties).length > 0) {
      for (const [key, value] of Object.entries(commonProperties)) {
        requestParams[key] = value;
      }
    }

    // Log the final request for debugging
    console.log(
      "Final request parameters for bizproc.robot.add:",
      JSON.stringify(requestParams)
    );

    try {
      // Make API call to create rule using the standard makeApiCall method
      const endpoint = this.getEndpoint("createRule");
      console.log(
        `Making API call to ${endpoint} with itemIndex: ${itemIndex}`
      );

      const responseData = await this.makeApiCall(
        endpoint,
        requestParams,
        {},
        itemIndex
      );

      console.log(
        "API call successful, response:",
        JSON.stringify(responseData)
      );
      this.addResponseToReturnData(responseData, itemIndex);
    } catch (error) {
      console.error("API call failed:", error.message);
      throw error;
    }
  }

  /**
   * Handle updating an automation rule
   */
  private async handleUpdateRule(itemIndex: number): Promise<void> {
    const ruleId = this.getNodeParameter("ruleId", itemIndex) as string;
    const documentType = this.getNodeParameter(
      "documentType",
      itemIndex
    ) as string;
    const ruleName = this.getNodeParameter("name", itemIndex) as string;
    const handlerUrl = this.getNodeParameter("handler", itemIndex) as string;
    const authUserId = this.getNodeParameter("authUserId", itemIndex) as number;
    const useSubscription = this.getNodeParameter(
      "useSubscription",
      itemIndex,
      false
    ) as boolean;

    // Xử lý đặc biệt cho document type là SPA
    let documentTypeArray: string[] = [documentType];

    console.log("handleUpdateRule processing document type:", documentType);

    if (documentType === "spa_placement") {
      // Lấy SPA ID từ spaPlacement
      const spaId = this.getNodeParameter("spaPlacement", itemIndex) as string;

      console.log("SPA placement ID:", spaId);

      if (!spaId) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "SPA Placement ID is required when Document Type is SPA",
          { itemIndex }
        );
      }

      // Format document type theo định dạng yêu cầu cho SPA
      // ['crm', 'Bitrix\Crm\Integration\BizProc\Document\Dynamic', 'DYNAMIC_XXX']
      documentTypeArray = [
        "crm",
        "Bitrix\\Crm\\Integration\\BizProc\\Document\\Dynamic",
        spaId,
      ];

      console.log("Final document type array for SPA:", documentTypeArray);
    } else {
      // Xử lý các document type thông thường
      documentTypeArray = [documentType];
      console.log("Using standard document type:", documentTypeArray);
    }

    // Get additional properties for the rule
    const commonProperties = this.getNodeParameter(
      "commonProperties",
      itemIndex,
      {}
    ) as IDataObject;

    // Get custom properties for the rule
    const propertiesCollection = this.getNodeParameter(
      "propertiesCollection.properties",
      itemIndex,
      []
    ) as IDataObject[];

    // Build properties object from collection
    const properties: IDataObject = {};
    if (propertiesCollection && propertiesCollection.length > 0) {
      for (const prop of propertiesCollection) {
        if (prop.name && prop.type && prop.value) {
          properties[prop.name as string] = {
            Name: prop.label || prop.name,
            Type: prop.type,
            Default: prop.value,
            Required: prop.required === true,
          };
        }
      }
    }

    // Build final request parameters
    const requestParams: IDataObject = {
      ID: ruleId,
      DOCUMENT_TYPE: documentTypeArray,
      NAME: ruleName,
      HANDLER: handlerUrl,
      AUTH_USER_ID: authUserId,
      USE_SUBSCRIPTION: useSubscription ? "Y" : "N",
      PROPERTIES: properties,
    };

    // Add additional common properties
    if (commonProperties && Object.keys(commonProperties).length > 0) {
      for (const [key, value] of Object.entries(commonProperties)) {
        requestParams[key] = value;
      }
    }

    // Log the final request for debugging
    console.log(
      "Final request parameters for bizproc.robot.update:",
      JSON.stringify(requestParams)
    );

    try {
      // Make API call to update rule
      const endpoint = this.getEndpoint("updateRule");
      console.log(
        `Making API call to ${endpoint} with itemIndex: ${itemIndex}`
      );

      const responseData = await this.makeApiCall(
        endpoint,
        requestParams,
        {},
        itemIndex
      );

      console.log(
        "API call successful, response:",
        JSON.stringify(responseData)
      );
      this.addResponseToReturnData(responseData, itemIndex);
    } catch (error) {
      console.error("API call failed:", error.message);
      throw error;
    }
  }

  /**
   * Handle deleting an automation rule
   */
  private async handleDeleteRule(itemIndex: number): Promise<void> {
    const ruleId = this.getNodeParameter("ruleId", itemIndex) as string;

    console.log(
      `Deleting automation rule with ID: ${ruleId}, itemIndex: ${itemIndex}`
    );

    try {
      const endpoint = this.getEndpoint("deleteRule");
      console.log(
        `Making API call to ${endpoint} with itemIndex: ${itemIndex}`
      );

      const responseData = await this.makeApiCall(
        endpoint,
        { CODE: ruleId },
        {},
        itemIndex
      );

      console.log(
        "API call successful, response:",
        JSON.stringify(responseData)
      );
      this.addResponseToReturnData(responseData, itemIndex);
    } catch (error) {
      console.error("API call failed:", error.message);
      throw error;
    }
  }

  /**
   * Handle getting an automation rule
   */
  private async handleGetRule(itemIndex: number): Promise<void> {
    const ruleId = this.getNodeParameter("ruleId", itemIndex) as string;
    const documentType = this.getNodeParameter(
      "documentType",
      itemIndex
    ) as string;

    console.log(
      `Getting automation rule with ID: ${ruleId}, documentType: ${documentType}, itemIndex: ${itemIndex}`
    );

    try {
      const endpoint = this.getEndpoint("getRule");
      console.log(
        `Making API call to ${endpoint} with itemIndex: ${itemIndex}`
      );

      const responseData = await this.makeApiCall(
        endpoint,
        { id: ruleId, documentType },
        {},
        itemIndex
      );

      console.log(
        "API call successful, response:",
        JSON.stringify(responseData)
      );
      this.addResponseToReturnData(responseData, itemIndex);
    } catch (error) {
      console.error("API call failed:", error.message);
      throw error;
    }
  }

  /**
   * Handle getting all automation rules
   */
  private async handleGetAllRules(itemIndex: number): Promise<void> {
    const documentType = this.getNodeParameter(
      "documentType",
      itemIndex
    ) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const requestParams: IDataObject = { documentType };

    // Add filter if provided
    if (options.filter) {
      try {
        requestParams.filter =
          typeof options.filter === "string"
            ? JSON.parse(options.filter as string)
            : options.filter;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Filter must be a valid JSON",
          { itemIndex }
        );
      }
    }

    // Add order if provided
    if (options.order) {
      try {
        requestParams.order =
          typeof options.order === "string"
            ? JSON.parse(options.order as string)
            : options.order;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Order must be a valid JSON",
          { itemIndex }
        );
      }
    }

    // Add select if specified
    if (options.select) {
      requestParams.select = options.select;
    }

    const endpoint = this.getEndpoint("getAllRules");
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

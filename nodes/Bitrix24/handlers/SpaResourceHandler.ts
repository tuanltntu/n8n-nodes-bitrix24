import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handles Smart Process Automation operations in Bitrix24
 */
export class SpaResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    type: {
      list: "crm.type.list",
      get: "crm.type.get",
      add: "crm.type.add",
      update: "crm.type.update",
      delete: "crm.type.delete",
      fields: "crm.type.fields",
    },
    item: {
      list: "crm.item.list",
      add: "crm.item.add",
      update: "crm.item.update",
      delete: "crm.item.delete",
      get: "crm.item.get",
      fields: "crm.item.fields",
    },
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process Smart Process operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          // Type operations
          case "getTypes":
            await this.handleGetTypes(i);
            break;
          case "getType":
            await this.handleGetType(i);
            break;
          case "addType":
            await this.handleAddType(i);
            break;
          case "updateType":
            await this.handleUpdateType(i);
            break;
          case "deleteType":
            await this.handleDeleteType(i);
            break;
          case "getFields":
            await this.handleGetFields(i);
            break;

          // Item operations
          case "getItems":
            await this.handleGetItems(i);
            break;
          case "getItem":
            await this.handleGetItem(i);
            break;
          case "createItem":
            await this.handleCreateItem(i);
            break;
          case "updateItem":
            await this.handleUpdateItem(i);
            break;
          case "deleteItem":
            await this.handleDeleteItem(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `The operation "${operation}" is not supported for Smart Process`,
              { itemIndex: i }
            );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          this.returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return this.returnData;
  }

  /**
   * Process common options for SPA operations
   */
  private getCommonOptions(itemIndex: number): IDataObject {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const processedOptions: IDataObject = {};

    if (options.filter) {
      try {
        processedOptions.filter =
          typeof options.filter === "string"
            ? this.parseJsonParameter(
                options.filter as string,
                "Filter must be a valid JSON",
                itemIndex
              )
            : options.filter;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Filter must be a valid JSON",
          { itemIndex }
        );
      }
    }

    if (options.order) {
      try {
        processedOptions.order =
          typeof options.order === "string"
            ? this.parseJsonParameter(
                options.order as string,
                "Order must be a valid JSON",
                itemIndex
              )
            : options.order;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Order must be a valid JSON",
          { itemIndex }
        );
      }
    }

    if (options.select) {
      // Handle select as a comma-separated string or convert array to comma-separated
      if (Array.isArray(options.select)) {
        processedOptions.select = options.select.join(",");
      } else {
        processedOptions.select = options.select;
      }
    }

    if (options.customParameters) {
      try {
        const customParams =
          typeof options.customParameters === "string"
            ? this.parseJsonParameter(
                options.customParameters as string,
                "Custom parameters must be a valid JSON",
                itemIndex
              )
            : options.customParameters;

        Object.assign(processedOptions, customParams);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Custom parameters must be a valid JSON",
          { itemIndex }
        );
      }
    }

    return processedOptions;
  }

  /**
   * Handle 'getTypes' operation
   */
  private async handleGetTypes(itemIndex: number): Promise<void> {
    const returnAll = this.getNodeParameter(
      "returnAll",
      itemIndex,
      false
    ) as boolean;

    // Initialize the request body
    const body: IDataObject = {};

    // Add limit parameter if needed
    if (!returnAll) {
      const limit = this.getNodeParameter("limit", itemIndex, 50) as number;
      body.start = 0;
      body.limit = limit;
    }

    // Get common options
    const options = this.getCommonOptions(itemIndex);

    // Add options to the body
    if (options.filter) {
      body.filter = options.filter;
    }

    // Check for additional form input filters that need to be merged
    try {
      // Example: look for specific form inputs that should be included in the filter
      const formInputs: IDataObject = {};

      // Check for any form inputs that should be added to filter
      // This is where you would add code to get form input values
      // For example, getting a stage value, status, etc.

      // If there are form inputs and filter exists, merge them
      if (Object.keys(formInputs).length > 0) {
        if (!body.filter || typeof body.filter !== "object") {
          body.filter = {};
        }

        // Merge form inputs with existing filter
        body.filter = { ...(body.filter as object), ...formInputs };

        console.log(
          "Merged filter with form inputs:",
          JSON.stringify(body.filter)
        );
      }
    } catch (error) {
      console.error("Error merging form inputs with filter:", error);
    }

    if (options.order) {
      body.order = options.order;
    }

    if (options.select) {
      body.select = options.select;
    }

    // Initialize empty query parameters
    const queryParams: IDataObject = {};

    // Handle access token if present in options
    if (options.accessToken) {
      queryParams.access_token = options.accessToken;
    }

    console.log("Debug SPA getTypes - Body:", JSON.stringify(body));

    const endpoint = this.resourceEndpoints.type.list;
    const responseData = await this.makeApiCall(
      endpoint,
      body,
      queryParams,
      itemIndex,
      returnAll
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getType' operation
   */
  private async handleGetType(itemIndex: number): Promise<void> {
    const typeId = this.getNodeParameter("id", itemIndex) as string;

    // Initialize the request body
    const body: IDataObject = {
      id: typeId,
    };

    // Get common options
    const options = this.getCommonOptions(itemIndex);

    // Add options to the body
    if (options.filter) {
      body.filter = options.filter;
    }

    if (options.order) {
      body.order = options.order;
    }

    if (options.select) {
      body.select = options.select;
    }

    // Initialize empty query parameters
    const queryParams: IDataObject = {};

    // Handle access token if present in options
    if (options.accessToken) {
      queryParams.access_token = options.accessToken;
    }

    console.log("Debug SPA getType - Body:", JSON.stringify(body));

    const endpoint = this.resourceEndpoints.type.get;
    const responseData = await this.makeApiCall(
      endpoint,
      body,
      queryParams,
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'addType' operation
   */
  private async handleAddType(itemIndex: number): Promise<void> {
    const typeData = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    // Get the title/name field directly
    const title = this.getNodeParameter("title", itemIndex, "") as string;

    // Create fields object with all fields according to documentation
    const fields: IDataObject = {};

    // Process basic fields
    fields.title = title; // Use title as per documentation
    if (typeData.entityTypeId) fields.entityTypeId = typeData.entityTypeId;
    if (typeData.code) fields.code = typeData.code;
    if (typeData.description) fields.description = typeData.description;

    // Process boolean fields - convert to Y/N format
    const booleanFields = [
      { param: "isCatalog", field: "isCatalog" },
      { param: "isDocumentCatalog", field: "isDocumentCatalog" },
      { param: "isAutomationEnabled", field: "isAutomationEnabled" },
      {
        param: "isBeginCloseDatesEnabled",
        field: "isBeginCloseDatesEnabled",
      },
      { param: "isBizProcEnabled", field: "isBizProcEnabled" },
      { param: "isCategoriesEnabled", field: "isCategoriesEnabled" },
      { param: "isClientEnabled", field: "isClientEnabled" },
      { param: "isDocumentsEnabled", field: "isDocumentsEnabled" },
      {
        param: "isUseInUserfieldEnabled",
        field: "isUseInUserfieldEnabled",
      },
      {
        param: "isLinkWithProductsEnabled",
        field: "isLinkWithProductsEnabled",
      },
      { param: "isMycompanyEnabled", field: "isMycompanyEnabled" },
      { param: "isObserversEnabled", field: "isObserversEnabled" },
      { param: "isRecyclebinEnabled", field: "isRecyclebinEnabled" },
      { param: "isSourceEnabled", field: "isSourceEnabled" },
      { param: "isStagesEnabled", field: "isStagesEnabled" },
      { param: "isSetOpenPermissions", field: "isSetOpenPermissions" },
    ];

    for (const fieldMapping of booleanFields) {
      const value = this.getNodeParameter(fieldMapping.param, itemIndex, null);
      if (value !== null) {
        fields[fieldMapping.field] = value === true ? "Y" : "N";
      }
    }

    // Process JSON fields
    if (typeData.linkedUserFields) {
      try {
        fields.linkedUserFields =
          typeof typeData.linkedUserFields === "string"
            ? JSON.parse(typeData.linkedUserFields as string)
            : typeData.linkedUserFields;
      } catch (error) {
        console.error("Error parsing linkedUserFields:", error);
      }
    }

    if (typeData.relations) {
      try {
        fields.relations =
          typeof typeData.relations === "string"
            ? JSON.parse(typeData.relations as string)
            : typeData.relations;
      } catch (error) {
        console.error("Error parsing relations:", error);
      }
    }

    // Remove deprecated fields
    delete fields.isExternal;

    // Format parameters according to API documentation - fields should be nested under a "fields" property
    const params: IDataObject = {
      fields: fields,
    };

    // Get common options
    const options = this.getCommonOptions(itemIndex);
    Object.assign(params, options);

    // Debug log the params being sent
    console.log(
      "SpaResourceHandler.handleAddType - Sending params:",
      JSON.stringify(params)
    );

    const endpoint = this.resourceEndpoints.type.add;

    console.log(
      "SpaResourceHandler.handleAddType - Request body detailed:",
      JSON.stringify(
        {
          endpoint,
          params,
          url: `[PORTAL_URL]/rest/${endpoint}`,
        },
        null,
        2
      )
    );

    try {
      const responseData = await this.makeApiCall(
        endpoint,
        params,
        {},
        itemIndex
      );
      this.addResponseToReturnData(responseData, itemIndex);
    } catch (apiError) {
      console.error("API Error in handleAddType:", apiError);

      // Tạo đối tượng lỗi có cấu trúc tương tự Bitrix24 API
      let errorResponse = {
        error: apiError.error || "UNKNOWN_ERROR",
        error_description: apiError.message || "Unknown error occurred",
        result: null,
      };

      // Nếu có thông tin chi tiết hơn trong apiError.response
      if (apiError.response) {
        errorResponse = { ...errorResponse, ...apiError.response };
      }

      // Log thông tin lỗi để debug
      console.error("Bitrix24 error response:", errorResponse);

      // Trả về response chuẩn của Bitrix API, kể cả khi có lỗi
      this.addResponseToReturnData(errorResponse, itemIndex);

      // Nếu continueOnFail là false, ném lỗi để dừng xử lý
      if (!this.continueOnFail()) {
        throw apiError;
      }
    }
  }

  /**
   * Handle 'updateType' operation
   */
  private async handleUpdateType(itemIndex: number): Promise<void> {
    const typeId = this.getNodeParameter("id", itemIndex) as string;
    const typeData = this.getNodeParameter(
      "typeData",
      itemIndex,
      {}
    ) as IDataObject;

    const fields: IDataObject = {};

    // Process basic fields
    if (typeData.title) fields.title = typeData.title;
    if (typeData.entityTypeId) fields.entityTypeId = typeData.entityTypeId;
    if (typeData.code) fields.code = typeData.code;
    if (typeData.description) fields.description = typeData.description;

    // Process boolean fields - convert to Y/N format
    const booleanFields = [
      "isCatalog",
      "isDocumentCatalog",
      "isAutomationEnabled",
      "isBeginCloseDatesEnabled",
      "isBizProcEnabled",
      "isCategoriesEnabled",
      "isClientEnabled",
      "isDocumentsEnabled",
      "isUseInUserfieldEnabled",
      "isLinkWithProductsEnabled",
      "isMycompanyEnabled",
      "isObserversEnabled",
      "isRecyclebinEnabled",
      "isStagesEnabled",
      "isSetOpenPermissions",
      "isExternal",
    ];

    for (const field of booleanFields) {
      if (typeData[field] !== undefined) {
        fields[field] = typeData[field] === true ? "Y" : "N";
      }
    }

    // Process JSON fields
    if (typeData.linkedUserFields) {
      try {
        fields.linkedUserFields =
          typeof typeData.linkedUserFields === "string"
            ? JSON.parse(typeData.linkedUserFields as string)
            : typeData.linkedUserFields;
      } catch (error) {
        console.error("Error parsing linkedUserFields:", error);
      }
    }

    if (typeData.relations) {
      try {
        fields.relations =
          typeof typeData.relations === "string"
            ? JSON.parse(typeData.relations as string)
            : typeData.relations;
      } catch (error) {
        console.error("Error parsing relations:", error);
      }
    }

    if (typeData.title_localization) {
      try {
        fields.title_localization =
          typeof typeData.title_localization === "string"
            ? JSON.parse(typeData.title_localization as string)
            : typeData.title_localization;
      } catch (error) {
        console.error("Error parsing title_localization:", error);
      }
    }

    if (typeData.sectionConfig) {
      try {
        fields.sectionConfig =
          typeof typeData.sectionConfig === "string"
            ? JSON.parse(typeData.sectionConfig as string)
            : typeData.sectionConfig;
      } catch (error) {
        console.error("Error parsing sectionConfig:", error);
      }
    }

    if (typeData.pageConfig) {
      try {
        fields.pageConfig =
          typeof typeData.pageConfig === "string"
            ? JSON.parse(typeData.pageConfig as string)
            : typeData.pageConfig;
      } catch (error) {
        console.error("Error parsing pageConfig:", error);
      }
    }

    if (typeData.detailCardConfig) {
      try {
        fields.detailCardConfig =
          typeof typeData.detailCardConfig === "string"
            ? JSON.parse(typeData.detailCardConfig as string)
            : typeData.detailCardConfig;
      } catch (error) {
        console.error("Error parsing detailCardConfig:", error);
      }
    }

    if (typeData.documentGenerationTemplates) {
      try {
        fields.documentGenerationTemplates =
          typeof typeData.documentGenerationTemplates === "string"
            ? JSON.parse(typeData.documentGenerationTemplates as string)
            : typeData.documentGenerationTemplates;
      } catch (error) {
        console.error("Error parsing documentGenerationTemplates:", error);
      }
    }

    if (typeData.bpTemplates) {
      try {
        fields.bpTemplates =
          typeof typeData.bpTemplates === "string"
            ? JSON.parse(typeData.bpTemplates as string)
            : typeData.bpTemplates;
      } catch (error) {
        console.error("Error parsing bpTemplates:", error);
      }
    }

    if (typeData.categoryConfig) {
      try {
        fields.categoryConfig =
          typeof typeData.categoryConfig === "string"
            ? JSON.parse(typeData.categoryConfig as string)
            : typeData.categoryConfig;
      } catch (error) {
        console.error("Error parsing categoryConfig:", error);
      }
    }

    if (typeData.fieldDisplayFormats) {
      try {
        fields.fieldDisplayFormats =
          typeof typeData.fieldDisplayFormats === "string"
            ? JSON.parse(typeData.fieldDisplayFormats as string)
            : typeData.fieldDisplayFormats;
      } catch (error) {
        console.error("Error parsing fieldDisplayFormats:", error);
      }
    }

    if (typeData.uiConfig) {
      try {
        fields.uiConfig =
          typeof typeData.uiConfig === "string"
            ? JSON.parse(typeData.uiConfig as string)
            : typeData.uiConfig;
      } catch (error) {
        console.error("Error parsing uiConfig:", error);
      }
    }

    if (typeData.relations) {
      try {
        fields.relations =
          typeof typeData.relations === "string"
            ? JSON.parse(typeData.relations as string)
            : typeData.relations;
      } catch (error) {
        console.error("Error parsing relations:", error);
      }
    }

    const params: IDataObject = {
      id: typeId,
      fields: fields,
    };

    // Get common options
    const options = this.getCommonOptions(itemIndex);
    Object.assign(params, options);

    const endpoint = this.resourceEndpoints.type.update;
    const responseData = await this.makeApiCall(
      endpoint,
      params,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'deleteType' operation
   */
  private async handleDeleteType(itemIndex: number): Promise<void> {
    let typeId = this.getNodeParameter("id", itemIndex) as string;

    // Debug logs
    console.log("=== DEBUG DELETE TYPE ===");
    console.log("Type ID received:", typeId);
    console.log("Type ID type:", typeof typeId);

    try {
      // Convert to number if it's a numeric string
      const numericId = Number(typeId);
      console.log("Converted to numeric ID:", numericId);
      console.log("Is valid number:", !isNaN(numericId));

      // Theo tài liệu API, chỉ cần gửi id dạng số
      const params: IDataObject = {
        id: numericId,
      };

      // Log for debugging
      console.log("Parameters to be sent:", JSON.stringify(params));

      // KHÔNG lấy common options vì API này chỉ chấp nhận tham số id
      console.log("Final API call parameters:", JSON.stringify(params));

      const endpoint = this.resourceEndpoints.type.delete;
      try {
        const responseData = await this.makeApiCall(
          endpoint,
          params,
          {},
          itemIndex
        );
        console.log("API Response:", JSON.stringify(responseData));
        this.addResponseToReturnData(responseData, itemIndex);
      } catch (apiError) {
        console.error("API Error Details:", JSON.stringify(apiError));

        // Tạo đối tượng lỗi có cấu trúc tương tự Bitrix24 API
        let errorResponse = {
          error: apiError.error || "UNKNOWN_ERROR",
          error_description: apiError.message || "Unknown error occurred",
          result: null,
        };

        // Nếu có thông tin chi tiết hơn trong apiError.response
        if (apiError.response) {
          errorResponse = { ...errorResponse, ...apiError.response };
        }

        // Log thông tin lỗi để debug
        console.error("Bitrix24 error response:", errorResponse);

        // Trả về response chuẩn của Bitrix API, kể cả khi có lỗi
        this.addResponseToReturnData(errorResponse, itemIndex);

        // Nếu continueOnFail là false, ném lỗi để dừng xử lý
        if (!this.continueOnFail()) {
          throw apiError;
        }
      }
    } catch (error) {
      console.error("Error in handleDeleteType:", error);

      // Tạo response chuẩn Bitrix với thông tin lỗi
      const errorResponse = {
        error: "PROCESSING_ERROR",
        error_description:
          error instanceof Error ? error.message : String(error),
      };

      this.addResponseToReturnData(errorResponse, itemIndex);

      // Nếu không set continueOnFail, vẫn throw lỗi để dừng workflow
      if (!this.continueOnFail()) {
        throw error;
      }
    }
  }

  /**
   * Handle 'getFields' operation
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;

    const requestBody: IDataObject = {
      entityTypeId: entityTypeId,
    };

    // Get common options
    const options = this.getCommonOptions(itemIndex);

    // Initialize empty query parameters
    const queryParams: IDataObject = {};

    // Handle access token if present in options
    if (options.accessToken) {
      queryParams.access_token = options.accessToken;
    }

    console.log("Debug SPA getFields - Body:", JSON.stringify(requestBody));

    const endpoint = this.resourceEndpoints.item.fields;
    const responseData = await this.makeApiCall(
      endpoint,
      requestBody,
      queryParams,
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getItems' operation
   */
  private async handleGetItems(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const returnAll = this.getNodeParameter(
      "returnAll",
      itemIndex,
      false
    ) as boolean;

    // Initialize the request body
    const requestBody: IDataObject = {
      entityTypeId: entityTypeId,
    };

    // Add limit parameter if needed
    if (!returnAll) {
      const limit = this.getNodeParameter("limit", itemIndex, 50) as number;
      requestBody.start = 0;
      requestBody.limit = limit;
    }

    // Get common options
    const options = this.getCommonOptions(itemIndex);

    // Add options to the body
    if (options.filter) {
      requestBody.filter = options.filter;
    }

    if (options.order) {
      requestBody.order = options.order;
    }

    if (options.select) {
      requestBody.select = options.select;
    }

    // Initialize empty query parameters
    const queryParams: IDataObject = {};

    // Handle access token if present in options
    if (options.accessToken) {
      queryParams.access_token = options.accessToken;
    }

    console.log("Debug SPA getItems - Body:", JSON.stringify(requestBody));

    const endpoint = this.resourceEndpoints.item.list;
    const responseData = await this.makeApiCall(
      endpoint,
      requestBody,
      queryParams,
      itemIndex,
      returnAll
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getItem' operation
   */
  private async handleGetItem(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;

    // Initialize the request body
    const requestBody: IDataObject = {
      entityTypeId: entityTypeId,
      id: itemId,
    };

    // Get common options
    const options = this.getCommonOptions(itemIndex);

    // Add options to the body
    if (options.filter) {
      requestBody.filter = options.filter;
    }

    if (options.order) {
      requestBody.order = options.order;
    }

    if (options.select) {
      requestBody.select = options.select;
    }

    // Initialize empty query parameters
    const queryParams: IDataObject = {};

    // Handle access token if present in options
    if (options.accessToken) {
      queryParams.access_token = options.accessToken;
    }

    console.log("Debug SPA getItem - Body:", JSON.stringify(requestBody));

    const endpoint = this.resourceEndpoints.item.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestBody,
      queryParams,
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'createItem' operation
   */
  private async handleCreateItem(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const fields = this.getNodeParameter(
      "fields",
      itemIndex,
      {}
    ) as IDataObject;

    // Process field values from fixed collection - new format
    const itemFields: IDataObject = {};
    if (fields.fieldItems && Array.isArray(fields.fieldItems)) {
      for (const fieldItem of fields.fieldItems) {
        if (
          fieldItem &&
          typeof fieldItem === "object" &&
          "fieldName" in fieldItem &&
          "fieldValue" in fieldItem
        ) {
          const fieldData = fieldItem as { fieldName: string; fieldValue: any };
          if (fieldData.fieldName && fieldData.fieldValue !== undefined) {
            itemFields[fieldData.fieldName] = fieldData.fieldValue;
          }
        }
      }
    }

    // Process advanced item options
    const advancedOptions = this.getNodeParameter(
      "advancedItemOptions",
      itemIndex,
      {}
    ) as IDataObject;

    // Add special fields from advanced options
    if (advancedOptions.assignedById) {
      itemFields["ASSIGNED_BY_ID"] = advancedOptions.assignedById;
    }

    if (advancedOptions.createdBy) {
      itemFields["CREATED_BY"] = advancedOptions.createdBy;
    }

    if (advancedOptions.stageId) {
      itemFields["STAGE_ID"] = advancedOptions.stageId;
    }

    // Initialize parameters
    const params: IDataObject = {
      entityTypeId: entityTypeId,
      fields: itemFields,
    };

    // Add other advanced options directly to params
    if (advancedOptions.categoryId) {
      params.categoryId = advancedOptions.categoryId;
    }

    if (advancedOptions.parentId) {
      params.parentId = advancedOptions.parentId;
    }

    // Process permissions
    if (advancedOptions.permissions) {
      try {
        params.permissions =
          typeof advancedOptions.permissions === "string"
            ? JSON.parse(advancedOptions.permissions as string)
            : advancedOptions.permissions;
      } catch (error) {
        console.error("Error parsing permissions:", error);
      }
    }

    // Get common options
    const options = this.getCommonOptions(itemIndex);
    Object.assign(params, options);

    const endpoint = this.resourceEndpoints.item.add;
    const responseData = await this.makeApiCall(
      endpoint,
      params,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'updateItem' operation
   */
  private async handleUpdateItem(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;
    const fields = this.getNodeParameter(
      "fields",
      itemIndex,
      {}
    ) as IDataObject;

    // Process field values from fixed collection - new format
    const itemFields: IDataObject = {};
    if (fields.fieldItems && Array.isArray(fields.fieldItems)) {
      for (const fieldItem of fields.fieldItems) {
        if (
          fieldItem &&
          typeof fieldItem === "object" &&
          "fieldName" in fieldItem &&
          "fieldValue" in fieldItem
        ) {
          const fieldData = fieldItem as { fieldName: string; fieldValue: any };
          if (fieldData.fieldName && fieldData.fieldValue !== undefined) {
            itemFields[fieldData.fieldName] = fieldData.fieldValue;
          }
        }
      }
    }

    // Process advanced item options
    const advancedOptions = this.getNodeParameter(
      "advancedItemOptions",
      itemIndex,
      {}
    ) as IDataObject;

    // Add special fields from advanced options
    if (advancedOptions.assignedById) {
      itemFields["ASSIGNED_BY_ID"] = advancedOptions.assignedById;
    }

    if (advancedOptions.stageId) {
      itemFields["STAGE_ID"] = advancedOptions.stageId;
    }

    // Initialize params
    const params: IDataObject = {
      entityTypeId: entityTypeId,
      id: itemId,
      fields: itemFields,
    };

    // Add other advanced options directly to params
    if (advancedOptions.categoryId) {
      params.categoryId = advancedOptions.categoryId;
    }

    if (advancedOptions.parentId) {
      params.parentId = advancedOptions.parentId;
    }

    // Process permissions
    if (advancedOptions.permissions) {
      try {
        params.permissions =
          typeof advancedOptions.permissions === "string"
            ? JSON.parse(advancedOptions.permissions as string)
            : advancedOptions.permissions;
      } catch (error) {
        console.error("Error parsing permissions:", error);
      }
    }

    // Get common options
    const options = this.getCommonOptions(itemIndex);
    Object.assign(params, options);

    const endpoint = this.resourceEndpoints.item.update;
    const responseData = await this.makeApiCall(
      endpoint,
      params,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'deleteItem' operation
   */
  private async handleDeleteItem(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;

    const params: IDataObject = {
      entityTypeId: entityTypeId,
      id: itemId,
    };

    // Get common options
    const options = this.getCommonOptions(itemIndex);
    Object.assign(params, options);

    const endpoint = this.resourceEndpoints.item.delete;
    const responseData = await this.makeApiCall(
      endpoint,
      params,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

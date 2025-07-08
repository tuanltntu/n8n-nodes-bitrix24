import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handle Bitrix24 CRM Catalog operations
 */
export class CatalogResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    add: "crm.catalog.add",
    update: "crm.catalog.update",
    delete: "crm.catalog.delete",
    get: "crm.catalog.get",
    list: "crm.catalog.list",
    fields: "crm.catalog.fields",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process catalog operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "create":
            await this.handleCreate(i);
            break;
          case "update":
            await this.handleUpdate(i);
            break;
          case "delete":
            await this.handleDelete(i);
            break;
          case "get":
            await this.handleGet(i);
            break;
          case "getAll":
            await this.handleGetAll(i);
            break;
          case "getFields":
            await this.handleGetFields(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Unsupported operation "${operation}" for Catalog resource`,
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
      create: "add",
      update: "update",
      delete: "delete",
      get: "get",
      getAll: "list",
      getFields: "fields",
    };

    const endpoint = this.resourceEndpoints[endpointMap[operation]];
    if (!endpoint) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Unsupported operation "${operation}" for Catalog resource`
      );
    }

    return endpoint;
  }

  /**
   * Handle getting catalog fields
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const endpoint = this.getEndpoint("getFields");

    const responseData = await this.makeApiCall(endpoint, {}, {}, itemIndex);

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle creating a catalog
   */
  private async handleCreate(itemIndex: number): Promise<void> {
    // Get required fields
    const name = this.getNodeParameter("name", itemIndex) as string;
    const isDefault = this.getNodeParameter("isDefault", itemIndex) as boolean;
    const isSku = this.getNodeParameter("isSku", itemIndex) as boolean;

    // Get additional fields
    const additionalFields = this.getNodeParameter(
      "additionalFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Prepare fields
    const fields: IDataObject = {
      NAME: name,
      IS_DEFAULT: isDefault ? "Y" : "N",
      IS_SKU: isSku ? "Y" : "N",
    };

    // Add additional fields if provided
    if (additionalFields.description) {
      fields.DESCRIPTION = additionalFields.description;
    }
    if (additionalFields.sort) {
      fields.SORT = additionalFields.sort;
    }
    if (additionalFields.ownerId) {
      fields.OWNER_ID = additionalFields.ownerId;
    }
    if (additionalFields.xmlId) {
      fields.XML_ID = additionalFields.xmlId;
    }

    // Make API call
    const endpoint = this.getEndpoint("create");
    const responseData = await this.makeApiCall(
      endpoint,
      { fields },
      {},
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle updating a catalog
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const catalogId = this.getNodeParameter("catalogId", itemIndex) as string;

    // Get optional required fields
    const name = this.getNodeParameter("name", itemIndex, "") as string;
    const isDefault = this.getNodeParameter("isDefault", itemIndex, null) as
      | boolean
      | null;
    const isSku = this.getNodeParameter("isSku", itemIndex, null) as
      | boolean
      | null;

    // Get additional fields
    const additionalFields = this.getNodeParameter(
      "additionalFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Prepare fields
    const fields: IDataObject = {};

    // Add fields only if they have values
    if (name) {
      fields.NAME = name;
    }

    if (isDefault !== null) {
      fields.IS_DEFAULT = isDefault ? "Y" : "N";
    }

    if (isSku !== null) {
      fields.IS_SKU = isSku ? "Y" : "N";
    }

    // Add additional fields if provided
    if (additionalFields.description) {
      fields.DESCRIPTION = additionalFields.description;
    }
    if (additionalFields.sort) {
      fields.SORT = additionalFields.sort;
    }
    if (additionalFields.ownerId) {
      fields.OWNER_ID = additionalFields.ownerId;
    }
    if (additionalFields.xmlId) {
      fields.XML_ID = additionalFields.xmlId;
    }

    // Check if there are any fields to update
    if (Object.keys(fields).length === 0) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Please provide at least one field to update",
        { itemIndex }
      );
    }

    // Make API call
    const endpoint = this.getEndpoint("update");
    const responseData = await this.makeApiCall(
      endpoint,
      {
        id: catalogId,
        fields,
      },
      {},
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle deleting a catalog
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const catalogId = this.getNodeParameter("catalogId", itemIndex) as string;

    const endpoint = this.getEndpoint("delete");
    const responseData = await this.makeApiCall(
      endpoint,
      { id: catalogId },
      {},
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle getting a catalog
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const catalogId = this.getNodeParameter("catalogId", itemIndex) as string;

    // Get options
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const params: IDataObject = { id: catalogId };

    // Add select fields if specified
    if (options.select) {
      params.select = options.select;
    }

    // Add filter if provided
    if (options.filter) {
      try {
        params.filter =
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

    const endpoint = this.getEndpoint("get");
    const responseData = await this.makeApiCall(
      endpoint,
      params,
      {},
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle getting all catalogs
   */
  private async handleGetAll(itemIndex: number): Promise<void> {
    // Get parameters for filter and options
    const jsonParameters = this.getNodeParameter(
      "jsonParameters",
      itemIndex,
      false
    ) as boolean;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const additionalOptions = this.getNodeParameter(
      "additionalOptions",
      itemIndex,
      {}
    ) as IDataObject;
    const params: IDataObject = {};

    // Handle filter parameters
    if (jsonParameters && options.filtersJson) {
      const filtersJson = this.getNodeParameter(
        "filtersJson",
        itemIndex,
        ""
      ) as string;
      if (filtersJson) {
        try {
          params.filter = JSON.parse(filtersJson);
        } catch (error) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            "Filter must be a valid JSON",
            { itemIndex }
          );
        }
      }
    } else if (options.filter) {
      try {
        params.filter =
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
    if (options.order || additionalOptions.order) {
      const orderValue = options.order || additionalOptions.order;
      try {
        params.order =
          typeof orderValue === "string"
            ? JSON.parse(orderValue as string)
            : orderValue;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Order must be a valid JSON",
          { itemIndex }
        );
      }
    }

    // Add select fields if specified
    if (options.select) {
      params.select = options.select;
    }

    // Add pagination parameters
    if (options.start || additionalOptions.start) {
      params.start = options.start || additionalOptions.start;
    }

    // Check for returnAll parameter
    const returnAll = this.getNodeParameter(
      "returnAll",
      itemIndex,
      false
    ) as boolean;

    if (returnAll) {
      // No limits for returnAll
    }

    const endpoint = this.getEndpoint("getAll");
    const responseData = await this.makeApiCall(
      endpoint,
      params,
      {},
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }
}

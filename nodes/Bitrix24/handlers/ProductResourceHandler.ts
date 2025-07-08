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
 * Handle Bitrix24 CRM Product operations
 */
export class ProductResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    add: "crm.product.add",
    update: "crm.product.update",
    delete: "crm.product.delete",
    get: "crm.product.get",
    list: "crm.product.list",
    fields: "crm.product.fields",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process product operations
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
              `Unsupported operation "${operation}" for Product resource`,
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
        `Unsupported operation "${operation}" for Product resource`
      );
    }

    return endpoint;
  }

  /**
   * Handle getting product fields
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const endpoint = this.getEndpoint("getFields");

    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      {},
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle creating a product
   */
  private async handleCreate(itemIndex: number): Promise<void> {
    const productFields = this.getNodeParameter(
      "productFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Make API call
    const endpoint = this.getEndpoint("create");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      { fields: productFields },
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle updating a product
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const productId = this.getNodeParameter("productId", itemIndex) as string;
    const productFields = this.getNodeParameter(
      "productFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Make API call
    const endpoint = this.getEndpoint("update");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      {
        id: productId,
        fields: productFields,
      },
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle deleting a product
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const productId = this.getNodeParameter("productId", itemIndex) as string;

    const endpoint = this.getEndpoint("delete");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      { id: productId },
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle getting a product
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const productId = this.getNodeParameter("productId", itemIndex) as string;

    // Get options
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const params: IDataObject = { id: productId };

    // Add select fields if specified
    if (options.select) {
      params.select = options.select;
    }

    const endpoint = this.getEndpoint("get");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle getting all products
   */
  private async handleGetAll(itemIndex: number): Promise<void> {
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

    // Add order if provided
    if (additionalOptions.order) {
      try {
        params.order =
          typeof additionalOptions.order === "string"
            ? JSON.parse(additionalOptions.order as string)
            : additionalOptions.order;
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
    if (additionalOptions.start) {
      params.start = additionalOptions.start;
    }

    // Check for returnAll parameter
    const returnAll = this.getNodeParameter(
      "returnAll",
      itemIndex,
      false
    ) as boolean;

    if (!returnAll) {
      const limit = this.getNodeParameter("limit", itemIndex, 50) as number;
      params.limit = limit;
    }

    const endpoint = this.getEndpoint("getAll");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }
}

import {
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
  IExecuteFunctions,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handler for Bitrix24 CRM user field operations
 */
export class UserFieldResourceHandler extends ResourceHandlerBase {
  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process all operations for user fields
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
        } else if (operation === "delete") {
          await this.handleDelete(i);
        } else if (operation === "get") {
          await this.handleGet(i);
        } else if (operation === "getFields") {
          await this.handleGetFields(i);
        } else if (operation === "getList") {
          await this.handleGetList(i);
        } else if (operation === "update") {
          await this.handleUpdate(i);
        } else {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `The operation "${operation}" is not supported for user fields!`,
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

  /**
   * Handle the "add" operation for user fields
   */
  private async handleAdd(itemIndex: number): Promise<void> {
    const fields = this.getNodeParameter("fields", itemIndex) as string;
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;

    // Parse fields
    const fieldData = this.parseJsonParameter(
      fields,
      'The "fields" parameter must be valid JSON',
      itemIndex
    );

    // API call
    const responseData = await this.makeApiCall(
      "crm.userfield.add",
      {
        fields: {
          ...fieldData,
          ENTITY_ID: entityId,
        },
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the "delete" operation for user fields
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const id = this.getNodeParameter("id", itemIndex) as string;

    // API call
    const responseData = await this.makeApiCall(
      "crm.userfield.delete",
      { id },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the "get" operation for user fields
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const id = this.getNodeParameter("id", itemIndex) as string;

    // API call
    const responseData = await this.makeApiCall(
      "crm.userfield.get",
      { id },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the "getFields" operation for user fields
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;

    // API call
    const responseData = await this.makeApiCall(
      "crm.userfield.fields",
      {
        entityId,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the "getList" operation for user fields
   */
  private async handleGetList(itemIndex: number): Promise<void> {
    const filter = this.getNodeParameter("filter", itemIndex, "{}") as string;
    const order = this.getNodeParameter("order", itemIndex, "{}") as string;
    const select = this.getNodeParameter("select", itemIndex, []) as string[];

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

    // API call
    const responseData = await this.makeApiCall(
      "crm.userfield.list",
      {
        filter: filterData,
        order: orderData,
        select: select.length ? select : undefined,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle the "update" operation for user fields
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const id = this.getNodeParameter("id", itemIndex) as string;
    const fields = this.getNodeParameter("fields", itemIndex) as string;

    // Parse fields
    const fieldData = this.parseJsonParameter(
      fields,
      'The "fields" parameter must be valid JSON',
      itemIndex
    );

    // API call
    const responseData = await this.makeApiCall(
      "crm.userfield.update",
      {
        id,
        fields: fieldData,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }
}

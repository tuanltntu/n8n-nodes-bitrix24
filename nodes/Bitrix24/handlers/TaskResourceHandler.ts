import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Xử lý các tác vụ Task của Bitrix24
 */
export class TaskResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    create: "tasks.task.add",
    update: "tasks.task.update",
    delete: "tasks.task.delete",
    get: "tasks.task.get",
    getAll: "tasks.task.list",
    addComment: "tasks.task.commentitem.add",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Xử lý tác vụ Task
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
          case "addComment":
            await this.handleAddComment(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Không hỗ trợ tác vụ "${operation}" cho Task`,
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
   * Lấy endpoint dựa trên resource và action
   */
  private getEndpoint(action: string): string {
    return this.resourceEndpoints[action];
  }

  /**
   * Xử lý tham số tùy chỉnh
   */
  private processCustomParameters(
    options: IDataObject,
    params: IDataObject,
    itemIndex: number
  ): void {
    if (!options.customParameters) return;

    try {
      const customParams =
        typeof options.customParameters === "string"
          ? this.parseJsonParameter(
              options.customParameters as string,
              "Custom parameters phải là JSON hợp lệ",
              itemIndex
            )
          : options.customParameters;

      Object.assign(params, customParams);
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Custom parameters phải là JSON hợp lệ",
        { itemIndex }
      );
    }
  }

  /**
   * Xử lý 'create'
   */
  private async handleCreate(itemIndex: number): Promise<void> {
    const fields = this.getNodeParameter(
      "fields",
      itemIndex,
      {}
    ) as IDataObject;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestParams: IDataObject = { fields };
    this.processCustomParameters(options, requestParams, itemIndex);

    const endpoint = this.getEndpoint("create");
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'update'
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const taskId = this.getNodeParameter("taskId", itemIndex) as string;
    const fieldsValues = this.getNodeParameter(
      "fields",
      itemIndex
    ) as IDataObject;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestParams: IDataObject = {
      taskId,
      fields: fieldsValues,
    };
    this.processCustomParameters(options, requestParams, itemIndex);

    const endpoint = this.getEndpoint("update");
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'delete'
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const taskId = this.getNodeParameter("taskId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestParams: IDataObject = { taskId };
    this.processCustomParameters(options, requestParams, itemIndex);

    const endpoint = this.getEndpoint("delete");
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'get'
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const taskId = this.getNodeParameter("taskId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const queryParams: IDataObject = { id: taskId };

    if (options.customParameters) {
      try {
        const customParams = this.parseJsonParameter(
          options.customParameters as string,
          'JSON không hợp lệ trong trường "Custom Parameters"',
          itemIndex
        );
        Object.assign(queryParams, customParams);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          'JSON không hợp lệ trong trường "Custom Parameters"',
          { itemIndex }
        );
      }
    }

    const endpoint = this.getEndpoint("get");
    const responseData = await this.makeApiCall(
      endpoint,
      {},
      queryParams,
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'getAll'
   */
  private async handleGetAll(itemIndex: number): Promise<void> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const qs: IDataObject = {};

    // Xử lý filter
    if (options.filter) {
      try {
        qs.filter =
          typeof options.filter === "string"
            ? this.parseJsonParameter(
                options.filter as string,
                "Filter phải là JSON hợp lệ",
                itemIndex
              )
            : options.filter;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Filter phải là JSON hợp lệ",
          { itemIndex }
        );
      }
    }

    // Xử lý order
    if (options.order) {
      try {
        qs.order =
          typeof options.order === "string"
            ? this.parseJsonParameter(
                options.order as string,
                "Order phải là JSON hợp lệ",
                itemIndex
              )
            : options.order;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Order phải là JSON hợp lệ",
          { itemIndex }
        );
      }
    }

    // Xử lý select
    if (
      options.select &&
      Array.isArray(options.select) &&
      options.select.length > 0
    ) {
      qs.select = options.select;
    }

    // Xử lý custom parameters
    if (options.customParameters) {
      try {
        const customParams = this.parseJsonParameter(
          options.customParameters as string,
          'JSON không hợp lệ trong trường "Custom Parameters"',
          itemIndex
        );
        Object.assign(qs, customParams);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          'JSON không hợp lệ trong trường "Custom Parameters"',
          { itemIndex }
        );
      }
    }

    const returnAll = this.getNodeParameter(
      "returnAll",
      itemIndex,
      false
    ) as boolean;
    const endpoint = this.getEndpoint("getAll");
    const responseData = await this.makeApiCall(
      endpoint,
      {},
      qs,
      itemIndex,
      returnAll
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'addComment'
   */
  private async handleAddComment(itemIndex: number): Promise<void> {
    const taskId = this.getNodeParameter("taskId", itemIndex) as string;
    const comment = this.getNodeParameter("comment", itemIndex) as string;

    const requestParams: IDataObject = {
      taskId: taskId,
      fields: {
        AUTHOR_ID: 0, // 0 = current user
        POST_MESSAGE: comment,
      },
    };

    const endpoint = this.getEndpoint("addComment");
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

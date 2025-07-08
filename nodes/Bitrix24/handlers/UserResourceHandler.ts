import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Xử lý các tác vụ User của Bitrix24
 */
export class UserResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    get: "user.get",
    getAll: "user.get",
    getCurrent: "user.current",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Xử lý tác vụ User
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "get":
            await this.handleGet(i);
            break;
          case "getAll":
            await this.handleGetAll(i);
            break;
          case "getCurrent":
            await this.handleGetCurrent(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Không hỗ trợ tác vụ "${operation}" cho User`,
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
   * Xử lý 'get'
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const userId = this.getNodeParameter("userId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const queryParams: IDataObject = { ID: userId };

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

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.get,
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
    const returnAll = this.getNodeParameter(
      "returnAll",
      itemIndex,
      false
    ) as boolean;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const qs: IDataObject = {};

    if (options.filter) {
      qs.FILTER = options.filter;
    }

    if (options.order) {
      qs.ORDER = options.order;
    }

    if (options.adminMode) {
      qs.ADMIN_MODE = options.adminMode ? "Y" : "N";
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

    // Đặt giá trị mặc định cho start để đảm bảo phân trang hoạt động đúng
    if (!returnAll) {
      qs.start = -1;
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.get,
      {},
      qs,
      itemIndex,
      returnAll
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'getCurrent'
   */
  private async handleGetCurrent(itemIndex: number): Promise<void> {
    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getCurrent,
      {},
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

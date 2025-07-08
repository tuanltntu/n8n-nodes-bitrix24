import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handler for Bitrix24 MessageService operations
 */
export class MessageServiceResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    sendMessage: "messageservice.message.send",
    getProviders: "messageservice.provider.list",
    getProviderLimits: "messageservice.provider.limits.get",
    getMessageStatus: "messageservice.message.status.get",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process MessageService operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        if (!this.resourceEndpoints[operation]) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `The operation "${operation}" is not supported for MessageService`,
            { itemIndex: i }
          );
        }

        const endpoint = this.resourceEndpoints[operation];
        let responseData;

        switch (operation) {
          case "sendMessage":
            responseData = await this.handleSendMessage(endpoint, i);
            break;
          case "getProviders":
            responseData = await this.handleGetProviders(endpoint, i);
            break;
          case "getProviderLimits":
            responseData = await this.handleGetProviderLimits(endpoint, i);
            break;
          case "getMessageStatus":
            responseData = await this.handleGetMessageStatus(endpoint, i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `The operation "${operation}" is not supported`,
              { itemIndex: i }
            );
        }

        this.addResponseToReturnData(responseData, i);
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
   * Handle send message operation
   */
  private async handleSendMessage(
    endpoint: string,
    itemIndex: number
  ): Promise<IDataObject> {
    const phoneNumber = this.getNodeParameter(
      "phoneNumber",
      itemIndex
    ) as string;
    const message = this.getNodeParameter("message", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      phone: phoneNumber,
      message: message,
    };

    // Add any additional options
    Object.assign(body, options);

    return this.makeApiCall(endpoint, body);
  }

  /**
   * Handle get providers operation
   */
  private async handleGetProviders(
    endpoint: string,
    itemIndex: number
  ): Promise<IDataObject> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    return this.makeApiCall(endpoint, options);
  }

  /**
   * Handle get provider limits operation
   */
  private async handleGetProviderLimits(
    endpoint: string,
    itemIndex: number
  ): Promise<IDataObject> {
    const providerId = this.getNodeParameter("providerId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      provider_id: providerId,
      ...options,
    };

    return this.makeApiCall(endpoint, body);
  }

  /**
   * Handle get message status operation
   */
  private async handleGetMessageStatus(
    endpoint: string,
    itemIndex: number
  ): Promise<IDataObject> {
    const messageId = this.getNodeParameter("messageId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      message_id: messageId,
      ...options,
    };

    return this.makeApiCall(endpoint, body);
  }
}

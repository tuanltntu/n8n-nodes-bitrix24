import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handler for Bitrix24 OpenLines operations
 */
export class OpenLinesResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    sendMessage: "imopenlines.session.message.add",
    getMessages: "imopenlines.session.message.list",
    createSession: "imopenlines.session.start",
    closeSession: "imopenlines.session.finish",
    getSessions: "imopenlines.session.list",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process OpenLines operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        if (!this.resourceEndpoints[operation]) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `The operation "${operation}" is not supported for OpenLines`,
            { itemIndex: i }
          );
        }

        const endpoint = this.resourceEndpoints[operation];
        let responseData;

        switch (operation) {
          case "sendMessage":
            responseData = await this.handleSendMessage(endpoint, i);
            break;
          case "getMessages":
            responseData = await this.handleGetMessages(endpoint, i);
            break;
          case "createSession":
            responseData = await this.handleCreateSession(endpoint, i);
            break;
          case "closeSession":
            responseData = await this.handleCloseSession(endpoint, i);
            break;
          case "getSessions":
            responseData = await this.handleGetSessions(endpoint, i);
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
    const sessionId = this.getNodeParameter("sessionId", itemIndex) as string;
    const message = this.getNodeParameter("message", itemIndex) as string;
    const chatId = this.getNodeParameter("chatId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      session_id: sessionId,
      message: message,
      chat_id: chatId,
      ...options,
    };

    return this.makeApiCall(endpoint, body);
  }

  /**
   * Handle get messages operation
   */
  private async handleGetMessages(
    endpoint: string,
    itemIndex: number
  ): Promise<IDataObject> {
    const sessionId = this.getNodeParameter("sessionId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      session_id: sessionId,
      ...options,
    };

    return this.makeApiCall(endpoint, body);
  }

  /**
   * Handle create session operation
   */
  private async handleCreateSession(
    endpoint: string,
    itemIndex: number
  ): Promise<IDataObject> {
    const configId = this.getNodeParameter("configId", itemIndex) as string;
    const userId = this.getNodeParameter("userId", itemIndex, "") as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      config_id: configId,
      ...options,
    };

    if (userId) {
      body.user_id = userId;
    }

    return this.makeApiCall(endpoint, body);
  }

  /**
   * Handle close session operation
   */
  private async handleCloseSession(
    endpoint: string,
    itemIndex: number
  ): Promise<IDataObject> {
    const sessionId = this.getNodeParameter("sessionId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      session_id: sessionId,
      ...options,
    };

    return this.makeApiCall(endpoint, body);
  }

  /**
   * Handle get sessions operation
   */
  private async handleGetSessions(
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
}

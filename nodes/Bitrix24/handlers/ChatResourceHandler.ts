import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";
import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

export class ChatResourceHandler extends ResourceHandlerBase {
  private resourceEndpoints = {
    sendMessage: "im.message.add",
    getMessages: "im.dialog.messages.get",
    getChat: "im.chat.get",
    getChats: "im.recent.get",
    createChat: "im.chat.add",
    updateChat: "im.chat.update",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  public async process(): Promise<INodeExecutionData[]> {
    for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
      try {
        const operation = this.getNodeParameter(
          "operation",
          itemIndex
        ) as string;

        switch (operation) {
          case "sendMessage":
            await this.handleSendMessage(itemIndex);
            break;
          case "getMessages":
            await this.handleGetMessages(itemIndex);
            break;
          case "getChat":
            await this.handleGetChat(itemIndex);
            break;
          case "getChats":
            await this.handleGetChats(itemIndex);
            break;
          case "createChat":
            await this.handleCreateChat(itemIndex);
            break;
          case "updateChat":
            await this.handleUpdateChat(itemIndex);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Unsupported operation "${operation}" for Chat resource`,
              { itemIndex }
            );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          this.addErrorToReturnData(error, itemIndex);
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
  private async handleSendMessage(itemIndex: number): Promise<void> {
    const chatId = this.getNodeParameter("chatId", itemIndex) as string;
    const message = this.getNodeParameter("message", itemIndex) as string;
    const additionalFields = this.getNodeParameter(
      "additionalMessageFields",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      DIALOG_ID: chatId,
      MESSAGE: message,
    };

    if (additionalFields.attach) {
      try {
        body.ATTACH = JSON.parse(additionalFields.attach as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (additionalFields.system) {
      body.SYSTEM = additionalFields.system ? "Y" : "N";
    }

    if (additionalFields.urlPreview !== undefined) {
      body.URL_PREVIEW = additionalFields.urlPreview ? "Y" : "N";
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.sendMessage,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get messages operation
   */
  private async handleGetMessages(itemIndex: number): Promise<void> {
    const chatId = this.getNodeParameter("chatId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      DIALOG_ID: chatId,
    };

    if (options.lastId) {
      body.LAST_ID = options.lastId;
    }

    if (options.firstId) {
      body.FIRST_ID = options.firstId;
    }

    if (options.limit) {
      body.LIMIT = options.limit;
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getMessages,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get chat operation
   */
  private async handleGetChat(itemIndex: number): Promise<void> {
    const chatId = this.getNodeParameter("chatId", itemIndex) as string;

    const body: IDataObject = {
      CHAT_ID: chatId,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getChat,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get chats operation
   */
  private async handleGetChats(itemIndex: number): Promise<void> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {};

    if (options.filter) {
      try {
        body.filter = JSON.parse(options.filter as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.order) {
      try {
        body.order = JSON.parse(options.order as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.start) {
      body.start = options.start;
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getChats,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle create chat operation
   */
  private async handleCreateChat(itemIndex: number): Promise<void> {
    const chatTitle = this.getNodeParameter("chatTitle", itemIndex) as string;
    const chatType = this.getNodeParameter("chatType", itemIndex) as string;
    const users = this.getNodeParameter("users", itemIndex, "") as string;

    const body: IDataObject = {
      TITLE: chatTitle,
      TYPE: chatType,
    };

    if (users) {
      const userIds = users.split(",").map((id) => id.trim());
      body.USERS = userIds;
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.createChat,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle update chat operation
   */
  private async handleUpdateChat(itemIndex: number): Promise<void> {
    const chatId = this.getNodeParameter("chatId", itemIndex) as string;
    const updateFields = this.getNodeParameter(
      "updateFields",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {
      CHAT_ID: chatId,
    };

    if (updateFields.title) {
      body.TITLE = updateFields.title;
    }

    if (updateFields.description) {
      body.DESCRIPTION = updateFields.description;
    }

    if (updateFields.color) {
      body.COLOR = updateFields.color;
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.updateChat,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

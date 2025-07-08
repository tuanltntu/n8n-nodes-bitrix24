import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";
import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

export class NotifyResourceHandler extends ResourceHandlerBase {
  private resourceEndpoints = {
    sendSystemNotification: "im.notify.system.add",
    sendPersonalNotification: "im.notify.personal.add",
    sendPublicNotification: "im.notify.public.add",
    deleteNotification: "im.notify.delete",
    markAsRead: "im.notify.read",
    markAsUnread: "im.notify.unread",
    getNotifications: "im.notify.history.get",
    getSchema: "im.notify.schema.get",
    confirmNotification: "im.notify.confirm",
    answerNotification: "im.notify.answer",
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
          case "sendSystemNotification":
            await this.handleSendSystemNotification(itemIndex);
            break;
          case "sendPersonalNotification":
            await this.handleSendPersonalNotification(itemIndex);
            break;
          case "sendPublicNotification":
            await this.handleSendPublicNotification(itemIndex);
            break;
          case "deleteNotification":
            await this.handleDeleteNotification(itemIndex);
            break;
          case "markAsRead":
            await this.handleMarkAsRead(itemIndex);
            break;
          case "markAsUnread":
            await this.handleMarkAsUnread(itemIndex);
            break;
          case "getNotifications":
            await this.handleGetNotifications(itemIndex);
            break;
          case "getSchema":
            await this.handleGetSchema(itemIndex);
            break;
          case "confirmNotification":
            await this.handleConfirmNotification(itemIndex);
            break;
          case "answerNotification":
            await this.handleAnswerNotification(itemIndex);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Unsupported operation "${operation}" for Notify resource`,
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
   * Handle send system notification operation
   */
  private async handleSendSystemNotification(itemIndex: number): Promise<void> {
    const userId = this.getNodeParameter("userId", itemIndex) as number;
    const message = this.getNodeParameter("message", itemIndex) as string;
    const tag = this.getNodeParameter("tag", itemIndex, "") as string;
    const subTag = this.getNodeParameter("subTag", itemIndex, "") as string;
    const notifyType = this.getNodeParameter(
      "notifyType",
      itemIndex,
      "simple"
    ) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    // Validate required parameters
    if (!userId || userId <= 0) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "User ID is required and must be greater than 0",
        { itemIndex }
      );
    }

    if (!message || message.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Message is required and cannot be empty",
        { itemIndex }
      );
    }

    const body: IDataObject = {
      USER_ID: userId,
      MESSAGE: message,
    };

    if (tag) {
      body.TAG = tag;
    }

    if (subTag) {
      body.SUB_TAG = subTag;
    }

    if (notifyType && notifyType !== "simple") {
      body.NOTIFY_TYPE = notifyType;
    }

    // Add optional parameters
    if (options.attachments) {
      try {
        body.ATTACH = JSON.parse(options.attachments as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.buttons && notifyType === "buttons") {
      try {
        body.BUTTONS = JSON.parse(options.buttons as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.confirmText && notifyType === "confirm") {
      body.CONFIRM_TEXT = options.confirmText;
    }

    if (options.declineText && notifyType === "confirm") {
      body.DECLINE_TEXT = options.declineText;
    }

    if (options.urlPreview !== undefined) {
      body.URL_PREVIEW = options.urlPreview ? "Y" : "N";
    }

    if (options.sound !== undefined) {
      body.SOUND = options.sound ? "Y" : "N";
    }

    if (options.push !== undefined) {
      body.PUSH = options.push ? "Y" : "N";
    }

    if (options.email !== undefined) {
      body.EMAIL = options.email ? "Y" : "N";
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.sendSystemNotification,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle send personal notification operation
   */
  private async handleSendPersonalNotification(
    itemIndex: number
  ): Promise<void> {
    const userId = this.getNodeParameter("userId", itemIndex) as number;
    const message = this.getNodeParameter("message", itemIndex) as string;
    const tag = this.getNodeParameter("tag", itemIndex, "") as string;
    const subTag = this.getNodeParameter("subTag", itemIndex, "") as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    // Validate required parameters
    if (!userId || userId <= 0) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "User ID is required and must be greater than 0",
        { itemIndex }
      );
    }

    if (!message || message.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Message is required and cannot be empty",
        { itemIndex }
      );
    }

    const body: IDataObject = {
      USER_ID: userId,
      MESSAGE: message,
    };

    if (tag) {
      body.TAG = tag;
    }

    if (subTag) {
      body.SUB_TAG = subTag;
    }

    // Add optional parameters
    if (options.attachments) {
      try {
        body.ATTACH = JSON.parse(options.attachments as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.urlPreview !== undefined) {
      body.URL_PREVIEW = options.urlPreview ? "Y" : "N";
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.sendPersonalNotification,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle send public notification operation
   */
  private async handleSendPublicNotification(itemIndex: number): Promise<void> {
    const chatId = this.getNodeParameter("chatId", itemIndex) as number;
    const message = this.getNodeParameter("message", itemIndex) as string;
    const tag = this.getNodeParameter("tag", itemIndex, "") as string;
    const subTag = this.getNodeParameter("subTag", itemIndex, "") as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    // Validate required parameters
    if (!chatId || chatId <= 0) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Chat ID is required and must be greater than 0",
        { itemIndex }
      );
    }

    if (!message || message.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Message is required and cannot be empty",
        { itemIndex }
      );
    }

    const body: IDataObject = {
      CHAT_ID: chatId,
      MESSAGE: message,
    };

    if (tag) {
      body.TAG = tag;
    }

    if (subTag) {
      body.SUB_TAG = subTag;
    }

    // Add optional parameters
    if (options.attachments) {
      try {
        body.ATTACH = JSON.parse(options.attachments as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.urlPreview !== undefined) {
      body.URL_PREVIEW = options.urlPreview ? "Y" : "N";
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.sendPublicNotification,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle delete notification operation
   */
  private async handleDeleteNotification(itemIndex: number): Promise<void> {
    const notificationId = this.getNodeParameter(
      "notificationId",
      itemIndex
    ) as string;

    const body: IDataObject = {
      ID: notificationId,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.deleteNotification,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle mark as read operation
   */
  private async handleMarkAsRead(itemIndex: number): Promise<void> {
    const notificationId = this.getNodeParameter(
      "notificationId",
      itemIndex
    ) as string;

    const body: IDataObject = {
      ID: notificationId,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.markAsRead,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle mark as unread operation
   */
  private async handleMarkAsUnread(itemIndex: number): Promise<void> {
    const notificationId = this.getNodeParameter(
      "notificationId",
      itemIndex
    ) as string;

    const body: IDataObject = {
      ID: notificationId,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.markAsUnread,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get notifications operation
   */
  private async handleGetNotifications(itemIndex: number): Promise<void> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {};

    if (options.limit) {
      body.LIMIT = options.limit;
    }

    if (options.offset) {
      body.OFFSET = options.offset;
    }

    if (options.filter) {
      try {
        const filter = JSON.parse(options.filter as string);
        Object.assign(body, filter);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.order) {
      try {
        body.ORDER = JSON.parse(options.order as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getNotifications,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get schema operation
   */
  private async handleGetSchema(itemIndex: number): Promise<void> {
    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getSchema,
      {},
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle confirm notification operation
   */
  private async handleConfirmNotification(itemIndex: number): Promise<void> {
    const notificationId = this.getNodeParameter(
      "notificationId",
      itemIndex
    ) as string;

    const body: IDataObject = {
      ID: notificationId,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.confirmNotification,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle answer notification operation
   */
  private async handleAnswerNotification(itemIndex: number): Promise<void> {
    const notificationId = this.getNodeParameter(
      "notificationId",
      itemIndex
    ) as string;
    const message = this.getNodeParameter("message", itemIndex) as string;

    const body: IDataObject = {
      ID: notificationId,
      ANSWER_TEXT: message,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.answerNotification,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

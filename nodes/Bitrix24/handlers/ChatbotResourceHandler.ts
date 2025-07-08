import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

export class ChatbotResourceHandler extends ResourceHandlerBase {
  private resourceEndpoints = {
    botManagement: {
      registerBot: "imbot.register",
      unregisterBot: "imbot.unregister",
      updateBot: "imbot.update",
    },
    botCommand: {
      registerCommand: "imbot.command.register",
      unregisterCommand: "imbot.command.unregister",
      updateCommand: "imbot.command.update",
      answerCommand: "imbot.command.answer",
    },
    botMessage: {
      addMessage: "imbot.message.add",
      updateMessage: "imbot.message.update",
      deleteMessage: "imbot.message.delete",
      sendTyping: "imbot.chat.sendTyping",
    },
    botChat: {
      chatGet: "imbot.chat.get",
      chatLeave: "imbot.chat.leave",
      chatSetOwner: "imbot.chat.setOwner",
      chatUpdateAvatar: "imbot.chat.updateAvatar",
      chatUpdateColor: "imbot.chat.updateColor",
      chatUpdateTitle: "imbot.chat.updateTitle",
      chatUserAdd: "imbot.chat.user.add",
      chatUserList: "imbot.chat.user.list",
      chatUserDelete: "imbot.chat.user.delete",
    },
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  public async process(): Promise<INodeExecutionData[]> {
    for (
      let itemIndex = 0;
      itemIndex < this.executeFunctions.getInputData().length;
      itemIndex++
    ) {
      try {
        const operation = this.executeFunctions.getNodeParameter(
          "operation",
          itemIndex
        ) as string;

        switch (operation) {
          // Bot Management Operations
          case "registerBot":
            await this.handleRegisterBot(itemIndex);
            break;
          case "unregisterBot":
            await this.handleUnregisterBot(itemIndex);
            break;
          case "updateBot":
            await this.handleUpdateBot(itemIndex);
            break;

          // Bot Command Operations
          case "registerCommand":
            await this.handleRegisterCommand(itemIndex);
            break;
          case "unregisterCommand":
            await this.handleUnregisterCommand(itemIndex);
            break;
          case "updateCommand":
            await this.handleUpdateCommand(itemIndex);
            break;
          case "answerCommand":
            await this.handleAnswerCommand(itemIndex);
            break;

          // Bot Message Operations
          case "sendMessage":
            await this.handleAddMessage(itemIndex);
            break;
          case "addMessage":
            await this.handleAddMessage(itemIndex);
            break;
          case "updateMessage":
            await this.handleUpdateMessage(itemIndex);
            break;
          case "deleteMessage":
            await this.handleDeleteMessage(itemIndex);
            break;
          case "sendTyping":
            await this.handleSendTyping(itemIndex);
            break;

          // Bot Chat Operations
          case "chatGet":
            await this.handleChatGet(itemIndex);
            break;
          case "chatLeave":
            await this.handleChatLeave(itemIndex);
            break;
          case "chatSetOwner":
            await this.handleChatSetOwner(itemIndex);
            break;
          case "chatUpdateAvatar":
            await this.handleChatUpdateAvatar(itemIndex);
            break;
          case "chatUpdateColor":
            await this.handleChatUpdateColor(itemIndex);
            break;
          case "chatUpdateTitle":
            await this.handleChatUpdateTitle(itemIndex);
            break;
          case "chatUserAdd":
            await this.handleChatUserAdd(itemIndex);
            break;
          case "chatUserList":
            await this.handleChatUserList(itemIndex);
            break;
          case "chatUserDelete":
            await this.handleChatUserDelete(itemIndex);
            break;

          default:
            throw new Error(`The operation "${operation}" is not supported!`);
        }
      } catch (error) {
        if (error instanceof Error) {
          this.addResponseToReturnData({ error: error.message }, itemIndex);
        } else {
          this.addResponseToReturnData(
            { error: "Unknown error occurred" },
            itemIndex
          );
        }
      }
    }

    return this.returnData;
  }

  /* Bot Command Operations */
  private async handleRegisterCommand(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const command = this.executeFunctions.getNodeParameter(
      "command",
      itemIndex
    ) as string;
    const commandHandler = this.executeFunctions.getNodeParameter(
      "commandHandler",
      itemIndex
    ) as string;

    const options = this.executeFunctions.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestData: IDataObject = {
      BOT_ID: botId,
      COMMAND: command,
      COMMON: "N",
      HIDDEN: "N",
      EXTRANET_SUPPORT: "N",
      EVENT_COMMAND_ADD: commandHandler,
    };

    // Add optional parameters
    if (options.commandDescription) {
      requestData.COMMAND_PARAMS = options.commandDescription;
    }
    if (options.isCommon) {
      requestData.COMMON = options.isCommon === true ? "Y" : "N";
    }
    if (options.isHidden) {
      requestData.HIDDEN = options.isHidden === true ? "Y" : "N";
    }
    if (options.allowExtranet) {
      requestData.EXTRANET_SUPPORT = options.allowExtranet === true ? "Y" : "N";
    }

    const response = await this.makeApiCall(
      this.resourceEndpoints.botCommand.registerCommand,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleUnregisterCommand(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const commandId = this.executeFunctions.getNodeParameter(
      "commandId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      COMMAND_ID: commandId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botCommand.unregisterCommand,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleUpdateCommand(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const commandId = this.executeFunctions.getNodeParameter(
      "commandId",
      itemIndex
    ) as string;

    const options = this.executeFunctions.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestData: IDataObject = {
      BOT_ID: botId,
      COMMAND_ID: commandId,
    };

    // Add optional parameters
    if (options.command) {
      requestData.COMMAND = options.command;
    }
    if (options.commandHandler) {
      requestData.EVENT_COMMAND_ADD = options.commandHandler;
    }
    if (options.commandDescription) {
      requestData.COMMAND_PARAMS = options.commandDescription;
    }
    if (options.isCommon !== undefined) {
      requestData.COMMON = options.isCommon === true ? "Y" : "N";
    }
    if (options.isHidden !== undefined) {
      requestData.HIDDEN = options.isHidden === true ? "Y" : "N";
    }
    if (options.allowExtranet !== undefined) {
      requestData.EXTRANET_SUPPORT = options.allowExtranet === true ? "Y" : "N";
    }

    const response = await this.makeApiCall(
      this.resourceEndpoints.botCommand.updateCommand,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleAnswerCommand(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const commandId = this.executeFunctions.getNodeParameter(
      "commandId",
      itemIndex
    ) as string;
    const messageText = this.executeFunctions.getNodeParameter(
      "messageText",
      itemIndex
    ) as string;

    const options = this.executeFunctions.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestData: IDataObject = {
      BOT_ID: botId,
      COMMAND_ID: commandId,
      MESSAGE: messageText,
    };

    // Add optional parameters
    if (options.messageType) {
      requestData.MESSAGE_TYPE = options.messageType;
    }
    if (options.attachments) {
      requestData.ATTACH = options.attachments;
    }
    if (options.keyboardButtons) {
      requestData.KEYBOARD = options.keyboardButtons;
    }

    const response = await this.makeApiCall(
      this.resourceEndpoints.botCommand.answerCommand,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  /* Bot Message Operations */
  private async handleAddMessage(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const dialogId = this.executeFunctions.getNodeParameter(
      "dialogId",
      itemIndex
    ) as string;
    const messageText = this.executeFunctions.getNodeParameter(
      "messageText",
      itemIndex
    ) as string;

    const options = this.executeFunctions.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestData: IDataObject = {
      BOT_ID: botId,
      DIALOG_ID: dialogId,
      MESSAGE: messageText,
    };

    // Add optional parameters
    if (options.messageType) {
      requestData.SYSTEM = options.messageType === "system" ? "Y" : "N";
    }
    if (options.attachments) {
      requestData.ATTACH = options.attachments;
    }
    if (options.keyboardButtons) {
      requestData.KEYBOARD = options.keyboardButtons;
    }
    if (options.urlPreview !== undefined) {
      requestData.URL_PREVIEW = options.urlPreview === true ? "Y" : "N";
    }

    const response = await this.makeApiCall(
      this.resourceEndpoints.botMessage.addMessage,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleUpdateMessage(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const messageId = this.executeFunctions.getNodeParameter(
      "messageId",
      itemIndex
    ) as string;
    const messageText = this.executeFunctions.getNodeParameter(
      "messageText",
      itemIndex
    ) as string;

    const options = this.executeFunctions.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestData: IDataObject = {
      BOT_ID: botId,
      MESSAGE_ID: messageId,
      MESSAGE: messageText,
    };

    // Add optional parameters
    if (options.attachments) {
      requestData.ATTACH = options.attachments;
    }
    if (options.keyboardButtons) {
      requestData.KEYBOARD = options.keyboardButtons;
    }
    if (options.urlPreview !== undefined) {
      requestData.URL_PREVIEW = options.urlPreview === true ? "Y" : "N";
    }

    const response = await this.makeApiCall(
      this.resourceEndpoints.botMessage.updateMessage,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleDeleteMessage(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const messageId = this.executeFunctions.getNodeParameter(
      "messageId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      MESSAGE_ID: messageId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botMessage.deleteMessage,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleSendTyping(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const dialogId = this.executeFunctions.getNodeParameter(
      "dialogId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      DIALOG_ID: dialogId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botMessage.sendTyping,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  /* Bot Management Operations */
  private async handleRegisterBot(itemIndex: number): Promise<void> {
    const botType = this.executeFunctions.getNodeParameter(
      "botType",
      itemIndex
    ) as string;
    const botName = this.executeFunctions.getNodeParameter(
      "botName",
      itemIndex
    ) as string;
    const botCode = this.executeFunctions.getNodeParameter(
      "botCode",
      itemIndex
    ) as string;
    const eventHandler = this.executeFunctions.getNodeParameter(
      "eventHandler",
      itemIndex
    ) as string;

    const options = this.executeFunctions.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestData: IDataObject = {
      TYPE: botType,
      CODE: botCode,
      EVENT_HANDLER: eventHandler,
      PROPERTIES: {
        NAME: botName,
      },
    };

    // Add optional parameters
    if (options.openLineId) {
      requestData.OPENLINE = options.openLineId;
    }
    if (options.clientId) {
      requestData.CLIENT_ID = options.clientId;
    }
    if (options.languageId) {
      requestData.LANG = options.languageId;
    }
    if (options.botDescription) {
      (requestData.PROPERTIES as IDataObject).DESCRIPTION =
        options.botDescription;
    }
    if (options.botAvatar) {
      (requestData.PROPERTIES as IDataObject).AVATAR = options.botAvatar;
    }

    const response = await this.makeApiCall(
      this.resourceEndpoints.botManagement.registerBot,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleUnregisterBot(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botManagement.unregisterBot,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleUpdateBot(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;

    const options = this.executeFunctions.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestData: IDataObject = {
      BOT_ID: botId,
    };

    // Add optional parameters
    if (options.botName) {
      requestData.NAME = options.botName;
    }
    if (options.botDescription) {
      requestData.PROPERTIES = {
        DESCRIPTION: options.botDescription,
      };
    }
    if (options.botAvatar) {
      requestData.PROPERTIES = {
        ...(requestData.PROPERTIES as IDataObject),
        AVATAR: options.botAvatar,
      };
    }

    const response = await this.makeApiCall(
      this.resourceEndpoints.botManagement.updateBot,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  /* Bot Chat Operations */
  private async handleChatGet(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatGet,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatLeave(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatLeave,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatSetOwner(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;
    const userId = this.executeFunctions.getNodeParameter(
      "userId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
      USER_ID: userId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatSetOwner,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatUpdateAvatar(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;
    const fileId = this.executeFunctions.getNodeParameter(
      "fileId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
      FILE_ID: fileId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatUpdateAvatar,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatUpdateColor(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;
    const color = this.executeFunctions.getNodeParameter(
      "color",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
      COLOR: color,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatUpdateColor,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatUpdateTitle(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;
    const title = this.executeFunctions.getNodeParameter(
      "title",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
      TITLE: title,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatUpdateTitle,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatUserAdd(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;
    const userId = this.executeFunctions.getNodeParameter(
      "userId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
      USER_ID: userId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatUserAdd,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatUserList(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatUserList,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }

  private async handleChatUserDelete(itemIndex: number): Promise<void> {
    const botId = this.executeFunctions.getNodeParameter(
      "botId",
      itemIndex
    ) as string;
    const chatId = this.executeFunctions.getNodeParameter(
      "chatId",
      itemIndex
    ) as string;
    const userId = this.executeFunctions.getNodeParameter(
      "userId",
      itemIndex
    ) as string;

    const requestData: IDataObject = {
      BOT_ID: botId,
      CHAT_ID: chatId,
      USER_ID: userId,
    };

    const response = await this.makeApiCall(
      this.resourceEndpoints.botChat.chatUserDelete,
      requestData,
      {},
      itemIndex
    );
    this.addResponseToReturnData(response, itemIndex);
  }
}

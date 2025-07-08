import { INodeProperties } from "n8n-workflow";

// Chatbot operations
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["chatbot"],
    },
  },
  options: [
    // Bot Management Operations
    {
      name: "Register Bot",
      value: "registerBot",
      description: "Register a new bot (imbot.register)",
      action: "Register bot",
    },
    {
      name: "Unregister Bot",
      value: "unregisterBot",
      description: "Unregister bot (imbot.unregister)",
      action: "Unregister bot",
    },
    {
      name: "Update Bot",
      value: "updateBot",
      description: "Update bot information (imbot.update)",
      action: "Update bot",
    },

    // Bot Command Operations
    {
      name: "Register Command",
      value: "registerCommand",
      description: "Register bot command (imbot.command.register)",
      action: "Register command",
    },
    {
      name: "Unregister Command",
      value: "unregisterCommand",
      description: "Unregister bot command (imbot.command.unregister)",
      action: "Unregister command",
    },
    {
      name: "Update Command",
      value: "updateCommand",
      description: "Update a bot command",
      action: "Update a bot command",
    },
    {
      name: "Answer Command",
      value: "answerCommand",
      description: "Answer to a bot command",
      action: "Answer to a bot command",
    },

    // Bot Message Operations
    {
      name: "Send Message",
      value: "sendMessage",
      description: "Send message to chat (imbot.message.add)",
      action: "Send message",
    },
    {
      name: "Update Message",
      value: "updateMessage",
      description: "Update message (imbot.message.update)",
      action: "Update message",
    },
    {
      name: "Delete Message",
      value: "deleteMessage",
      description: "Delete message (imbot.message.delete)",
      action: "Delete message",
    },
    {
      name: "Send Typing",
      value: "sendTyping",
      description: "Send typing indicator (imbot.chat.sendTyping)",
      action: "Send typing",
    },

    // Bot Chat Operations
    {
      name: "Get Chat",
      value: "chatGet",
      description: "Get chat information (imbot.chat.get)",
      action: "Get chat",
    },
    {
      name: "Leave Chat",
      value: "chatLeave",
      description: "Leave chat (imbot.chat.leave)",
      action: "Leave chat",
    },
    {
      name: "Set Chat Owner",
      value: "chatSetOwner",
      description: "Set chat owner (imbot.chat.setOwner)",
      action: "Set chat owner",
    },
    {
      name: "Update Chat Avatar",
      value: "chatUpdateAvatar",
      description: "Update chat avatar (imbot.chat.updateAvatar)",
      action: "Update chat avatar",
    },
    {
      name: "Update Chat Color",
      value: "chatUpdateColor",
      description: "Update chat color (imbot.chat.updateColor)",
      action: "Update chat color",
    },
    {
      name: "Update Chat Title",
      value: "chatUpdateTitle",
      description: "Update chat title (imbot.chat.updateTitle)",
      action: "Update chat title",
    },
    {
      name: "Add Chat User",
      value: "chatUserAdd",
      description: "Add user to chat (imbot.chat.user.add)",
      action: "Add chat user",
    },
    {
      name: "List Chat Users",
      value: "chatUserList",
      description: "List chat users (imbot.chat.user.list)",
      action: "List chat users",
    },
    {
      name: "Delete Chat User",
      value: "chatUserDelete",
      description: "Delete user from chat (imbot.chat.user.delete)",
      action: "Delete chat user",
    },
  ],
  default: "sendMessage",
};

// Bot ID field - used by most operations
const botIdField: INodeProperties = {
  displayName: "Bot ID",
  name: "botId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: [
        "unregisterBot",
        "updateBot",
        "registerCommand",
        "unregisterCommand",
        "updateCommand",
        "answerCommand",
        "sendMessage",
        "updateMessage",
        "deleteMessage",
        "sendTyping",
        "chatGet",
        "chatLeave",
        "chatSetOwner",
        "chatUpdateAvatar",
        "chatUpdateColor",
        "chatUpdateTitle",
        "chatUserAdd",
        "chatUserList",
        "chatUserDelete",
      ],
    },
  },
  description: "ID of the chatbot",
};

// Bot Type field - for registerBot
const botTypeField: INodeProperties = {
  displayName: "Bot Type",
  name: "botType",
  type: "options",
  options: [
    {
      name: "Internal Bot",
      value: "B",
    },
    {
      name: "Service(supervisor)",
      value: "S",
    },
    {
      name: "Open channel",
      value: "O",
    },
  ],
  default: "B",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["registerBot"],
    },
  },
  description: "Type of the bot",
};

// Bot Name field - for registerBot
const botNameField: INodeProperties = {
  displayName: "Bot Name",
  name: "botName",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["registerBot"],
    },
  },
  description: "Name of the chatbot",
};

// Bot Code field - for registerBot
const botCodeField: INodeProperties = {
  displayName: "Bot Code",
  name: "botCode",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["registerBot"],
    },
  },
  description: "Unique code for the chatbot",
};

// Event Handler field - for registerBot
const eventHandlerField: INodeProperties = {
  displayName: "Event Handler",
  name: "eventHandler",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["registerBot"],
    },
  },
  description: "Event handler URL for the bot",
};

// Command field - for registerCommand
const commandField: INodeProperties = {
  displayName: "Command",
  name: "command",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["registerCommand"],
    },
  },
  description: "Command text",
};

// Command Handler field - for registerCommand
const commandHandlerField: INodeProperties = {
  displayName: "Command Handler",
  name: "commandHandler",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["registerCommand"],
    },
  },
  description: "Command handler URL",
};

// Command ID field - for unregisterCommand, updateCommand
const commandIdField: INodeProperties = {
  displayName: "Command ID",
  name: "commandId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["unregisterCommand", "updateCommand", "answerCommand"],
    },
  },
  description: "ID of the command",
};

// Dialog ID field - for sendMessage, sendTyping, getDialog
const dialogIdField: INodeProperties = {
  displayName: "Dialog ID",
  name: "dialogId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["sendMessage", "sendTyping", "getDialog"],
    },
  },
  description: "ID of the dialog/chat",
};

// Message Text field - for sendMessage, updateMessage, answerCommand
const messageTextField: INodeProperties = {
  displayName: "Message Text",
  name: "messageText",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["sendMessage", "updateMessage", "answerCommand"],
    },
  },
  description: "Text of the message",
};

// Message ID field - for updateMessage, deleteMessage, likeMessage
const messageIdField: INodeProperties = {
  displayName: "Message ID",
  name: "messageId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["updateMessage", "deleteMessage", "likeMessage"],
    },
  },
  description: "ID of the message",
};

// Action field - for likeMessage
const actionField: INodeProperties = {
  displayName: "Action",
  name: "action",
  type: "options",
  options: [
    { name: "Like", value: "like" },
    { name: "Unlike", value: "unlike" },
  ],
  default: "like",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["likeMessage"],
    },
  },
  description: "Action to perform on the message",
};

// Chat ID field - for chat operations
const chatIdField: INodeProperties = {
  displayName: "Chat ID",
  name: "chatId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: [
        "chatGet",
        "chatLeave",
        "chatSetOwner",
        "chatUpdateAvatar",
        "chatUpdateColor",
        "chatUpdateTitle",
        "chatUserAdd",
        "chatUserList",
        "chatUserDelete",
      ],
    },
  },
  description: "ID of the chat",
};

// Title field - for setChatTitle
const titleField: INodeProperties = {
  displayName: "Title",
  name: "title",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["chatUpdateTitle"],
    },
  },
  description: "Title of the chat",
};

// User IDs field - for addChatUser
const userIdsField: INodeProperties = {
  displayName: "User IDs",
  name: "userIds",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["chatUserAdd"],
    },
  },
  description: "Comma-separated list of user IDs to add to chat",
};

// User ID field - for single user operations
const userIdField: INodeProperties = {
  displayName: "User ID",
  name: "userId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["chatUserDelete"],
    },
  },
  description: "ID of the user",
};

// File ID field - for sendFile
const fileIdField: INodeProperties = {
  displayName: "File ID",
  name: "fileId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["sendFile"],
    },
  },
  description: "ID of the file to use as avatar",
};

// Color field - for setChatColor
const colorField: INodeProperties = {
  displayName: "Color",
  name: "color",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chatbot"],
      operation: ["chatUpdateColor"],
    },
  },
  description: "Color code for the chat",
};

// Options collection
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["chatbot"],
    },
  },
  options: [
    {
      displayName: "Client ID",
      name: "clientId",
      type: "string",
      default: "",
      description: "Client ID for the request",
    },
    {
      displayName: "Open Line ID",
      name: "openLineId",
      type: "string",
      default: "",
      description: "Open Line ID",
    },
    {
      displayName: "Language ID",
      name: "languageId",
      type: "string",
      default: "",
      description: "Language code",
    },
    {
      displayName: "Bot Description",
      name: "botDescription",
      type: "string",
      default: "",
      description: "Description of the bot",
    },
    {
      displayName: "Bot Avatar",
      name: "botAvatar",
      type: "string",
      default: "",
      description: "URL to bot avatar image",
    },
    {
      displayName: "Command Description",
      name: "commandDescription",
      type: "string",
      default: "",
      description: "Description of the command",
    },
    {
      displayName: "Is Common",
      name: "isCommon",
      type: "boolean",
      default: false,
      description: "Whether the command is common",
    },
    {
      displayName: "Is Hidden",
      name: "isHidden",
      type: "boolean",
      default: false,
      description: "Whether the command is hidden",
    },
    {
      displayName: "Allow Extranet",
      name: "allowExtranet",
      type: "boolean",
      default: false,
      description: "Whether to allow extranet access",
    },
    {
      displayName: "Message Type",
      name: "messageType",
      type: "options",
      options: [
        { name: "Text", value: "text" },
        { name: "System", value: "system" },
      ],
      default: "text",
      description: "Type of the message",
    },
    {
      displayName: "Attachments",
      name: "attachments",
      type: "json",
      default: "[]",
      description: "Attachments in JSON format",
    },
    {
      displayName: "Keyboard Buttons",
      name: "keyboardButtons",
      type: "json",
      default: "[]",
      description: "Keyboard layout in JSON format",
    },
    {
      displayName: "URL Preview",
      name: "urlPreview",
      type: "boolean",
      default: true,
      description: "Whether to show URL preview",
    },
    {
      displayName: "Custom Parameters",
      name: "customParameters",
      type: "json",
      default: "{}",
      description: "Additional parameters in JSON format",
    },
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      description: "Access token for authentication",
    },
  ],
};

export const chatbotOperations = [
  {
    name: "Register Bot",
    value: "registerBot",
    description: "Register a new bot (imbot.register)",
    action: "Register bot",
  },
  {
    name: "Unregister Bot",
    value: "unregisterBot",
    description: "Unregister bot (imbot.unregister)",
    action: "Unregister bot",
  },
  {
    name: "Update Bot",
    value: "updateBot",
    description: "Update bot information (imbot.update)",
    action: "Update bot",
  },
  {
    name: "Register Command",
    value: "registerCommand",
    description: "Register bot command (imbot.command.register)",
    action: "Register command",
  },
  {
    name: "Unregister Command",
    value: "unregisterCommand",
    description: "Unregister bot command (imbot.command.unregister)",
    action: "Unregister command",
  },
  {
    name: "Update Command",
    value: "updateCommand",
    description: "Update a bot command",
    action: "Update a bot command",
  },
  {
    name: "Answer Command",
    value: "answerCommand",
    description: "Answer to a bot command",
    action: "Answer to a bot command",
  },
  {
    name: "Send Message",
    value: "sendMessage",
    description: "Send message to chat (imbot.message.add)",
    action: "Send message",
  },
  {
    name: "Update Message",
    value: "updateMessage",
    description: "Update message (imbot.message.update)",
    action: "Update message",
  },
  {
    name: "Delete Message",
    value: "deleteMessage",
    description: "Delete message (imbot.message.delete)",
    action: "Delete message",
  },
  {
    name: "Send Typing",
    value: "sendTyping",
    description: "Send typing indicator (imbot.chat.sendTyping)",
    action: "Send typing",
  },
  {
    name: "Get Chat",
    value: "chatGet",
    description: "Get chat information (imbot.chat.get)",
    action: "Get chat",
  },
  {
    name: "Leave Chat",
    value: "chatLeave",
    description: "Leave chat (imbot.chat.leave)",
    action: "Leave chat",
  },
  {
    name: "Set Chat Owner",
    value: "chatSetOwner",
    description: "Set chat owner (imbot.chat.setOwner)",
    action: "Set chat owner",
  },
  {
    name: "Update Chat Avatar",
    value: "chatUpdateAvatar",
    description: "Update chat avatar (imbot.chat.updateAvatar)",
    action: "Update chat avatar",
  },
  {
    name: "Update Chat Color",
    value: "chatUpdateColor",
    description: "Update chat color (imbot.chat.updateColor)",
    action: "Update chat color",
  },
  {
    name: "Update Chat Title",
    value: "chatUpdateTitle",
    description: "Update chat title (imbot.chat.updateTitle)",
    action: "Update chat title",
  },
  {
    name: "Add Chat User",
    value: "chatUserAdd",
    description: "Add user to chat (imbot.chat.user.add)",
    action: "Add chat user",
  },
  {
    name: "List Chat Users",
    value: "chatUserList",
    description: "List chat users (imbot.chat.user.list)",
    action: "List chat users",
  },
  {
    name: "Delete Chat User",
    value: "chatUserDelete",
    description: "Delete user from chat (imbot.chat.user.delete)",
    action: "Delete chat user",
  },
];

export const chatbotFields: INodeProperties[] = [
  operationField,
  botIdField,
  botTypeField,
  botNameField,
  botCodeField,
  eventHandlerField,
  commandField,
  commandHandlerField,
  commandIdField,
  dialogIdField,
  messageTextField,
  messageIdField,
  actionField,
  chatIdField,
  titleField,
  userIdsField,
  userIdField,
  fileIdField,
  colorField,
  optionsCollection,
];

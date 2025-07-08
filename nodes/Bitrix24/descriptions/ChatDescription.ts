import { INodeProperties } from "n8n-workflow";

// Chat operations
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["chat"],
    },
  },
  options: [
    {
      name: "Send Message",
      value: "sendMessage",
      description: "Send message to chat (im.message.add)",
      action: "Send message to chat",
    },
    {
      name: "Get Messages",
      value: "getMessages",
      description: "Get messages from chat (im.message.list)",
      action: "Get messages from chat",
    },
    {
      name: "Update Message",
      value: "updateMessage",
      description: "Update message in chat (im.message.update)",
      action: "Update message in chat",
    },
    {
      name: "Delete Message",
      value: "deleteMessage",
      description: "Delete message from chat (im.message.delete)",
      action: "Delete message from chat",
    },
    {
      name: "Create Chat",
      value: "createChat",
      description: "Create a new chat (im.chat.add)",
      action: "Create a new chat",
    },
    {
      name: "Get Chat",
      value: "getChat",
      description: "Get chat information (im.chat.get)",
      action: "Get chat information",
    },
    {
      name: "Update Chat",
      value: "updateChat",
      description: "Update chat settings (im.chat.update)",
      action: "Update chat settings",
    },
    {
      name: "Get Chat Users",
      value: "getChatUsers",
      description: "Get users in chat (im.chat.user.list)",
      action: "Get users in chat",
    },
  ],
  default: "sendMessage",
};

// Chat ID field
const chatIdField: INodeProperties = {
  displayName: "Chat ID",
  name: "chatId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chat"],
      operation: ["sendMessage", "getMessages", "getChat", "updateChat"],
    },
  },
  description: "ID of the chat",
};

// Message field
const messageField: INodeProperties = {
  displayName: "Message",
  name: "message",
  type: "string",
  required: true,
  default: "",
  description: "Message text to send",
  displayOptions: {
    show: {
      resource: ["chat"],
      operation: ["sendMessage"],
    },
  },
};

// Chat Title field
const chatTitleField: INodeProperties = {
  displayName: "Chat Title",
  name: "chatTitle",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["chat"],
      operation: ["createChat", "updateChat"],
    },
  },
  description: "Title of the chat",
};

// Chat Type field
const chatTypeField: INodeProperties = {
  displayName: "Chat Type",
  name: "chatType",
  type: "options",
  options: [
    { name: "Chat", value: "CHAT" },
    { name: "Open Line", value: "OPENLINE" },
    { name: "Call", value: "CALL" },
  ],
  default: "CHAT",
  displayOptions: {
    show: {
      resource: ["chat"],
      operation: ["createChat"],
    },
  },
  description: "Type of the chat",
};

// Users field
const usersField: INodeProperties = {
  displayName: "Users",
  name: "users",
  type: "string",
  default: "",
  displayOptions: {
    show: {
      resource: ["chat"],
      operation: ["createChat"],
    },
  },
  description: "Comma-separated list of user IDs",
};

// Additional message fields collection
const additionalMessageFieldsCollection: INodeProperties = {
  displayName: "Additional Message Fields",
  name: "additionalMessageFields",
  type: "collection",
  placeholder: "Add Field",
  default: {},
  displayOptions: {
    show: {
      resource: ["chat"],
      operation: ["sendMessage"],
    },
  },
  options: [
    {
      displayName: "Attach",
      name: "attach",
      type: "json",
      default: "[]",
      description: "Attachments in JSON format",
    },
    {
      displayName: "System",
      name: "system",
      type: "boolean",
      default: false,
      description: "Whether this is a system message",
    },
    {
      displayName: "URL Preview",
      name: "urlPreview",
      type: "boolean",
      default: true,
      description: "Whether to show URL preview",
    },
  ],
};

// Update chat fields collection
const updateChatFieldsCollection: INodeProperties = {
  displayName: "Update Fields",
  name: "updateFields",
  type: "collection",
  placeholder: "Add Field",
  default: {},
  displayOptions: {
    show: {
      resource: ["chat"],
      operation: ["updateChat"],
    },
  },
  options: [
    {
      displayName: "Title",
      name: "title",
      type: "string",
      default: "",
      description: "New chat title",
    },
    {
      displayName: "Description",
      name: "description",
      type: "string",
      default: "",
      description: "New chat description",
    },
    {
      displayName: "Color",
      name: "color",
      type: "options",
      options: [
        { name: "Red", value: "RED" },
        { name: "Green", value: "GREEN" },
        { name: "Blue", value: "BLUE" },
        { name: "Yellow", value: "YELLOW" },
        { name: "Pink", value: "PINK" },
        { name: "Purple", value: "PURPLE" },
        { name: "Orange", value: "ORANGE" },
        { name: "Gray", value: "GRAY" },
      ],
      default: "BLUE",
      description: "Chat color",
    },
  ],
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
      resource: ["chat"],
      operation: ["getAll"],
    },
  },
  options: [
    {
      displayName: "Filter",
      name: "filter",
      type: "json",
      default: "{}",
      description: "Filter criteria in JSON format",
    },
    {
      displayName: "Order",
      name: "order",
      type: "json",
      default: "{}",
      description: "Sort order in JSON format",
    },
    {
      displayName: "Start",
      name: "start",
      type: "number",
      default: 0,
      description: "The record number to start the selection from",
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

export const chatOperations = [
  {
    name: "Send Message",
    value: "sendMessage",
    description: "Send message to chat (im.message.add)",
    action: "Send message to chat",
  },
  {
    name: "Get Messages",
    value: "getMessages",
    description: "Get messages from chat (im.message.list)",
    action: "Get messages from chat",
  },
  {
    name: "Update Message",
    value: "updateMessage",
    description: "Update message in chat (im.message.update)",
    action: "Update message in chat",
  },
  {
    name: "Delete Message",
    value: "deleteMessage",
    description: "Delete message from chat (im.message.delete)",
    action: "Delete message from chat",
  },
  {
    name: "Create Chat",
    value: "createChat",
    description: "Create a new chat (im.chat.add)",
    action: "Create a new chat",
  },
  {
    name: "Get Chat",
    value: "getChat",
    description: "Get chat information (im.chat.get)",
    action: "Get chat information",
  },
  {
    name: "Update Chat",
    value: "updateChat",
    description: "Update chat settings (im.chat.update)",
    action: "Update chat settings",
  },
  {
    name: "Get Chat Users",
    value: "getChatUsers",
    description: "Get users in chat (im.chat.user.list)",
    action: "Get users in chat",
  },
];

export const chatFields: INodeProperties[] = [
  operationField,
  chatIdField,
  messageField,
  chatTitleField,
  chatTypeField,
  usersField,
  additionalMessageFieldsCollection,
  updateChatFieldsCollection,
  optionsCollection,
];

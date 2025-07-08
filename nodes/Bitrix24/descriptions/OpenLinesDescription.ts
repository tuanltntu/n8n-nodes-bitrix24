import { INodeProperties } from "n8n-workflow";

// OpenLines operations
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["openLines"],
    },
  },
  options: [
    {
      name: "Get Open Lines",
      value: "getOpenLines",
      description: "Get open lines configuration (imopenlines.config.list.get)",
      action: "Get open lines configuration",
    },
    {
      name: "Get Session",
      value: "getSession",
      description: "Get session information (imopenlines.session.get)",
      action: "Get session information",
    },
    {
      name: "Start Session",
      value: "startSession",
      description: "Start new session (imopenlines.session.start)",
      action: "Start new session",
    },
    {
      name: "Finish Session",
      value: "finishSession",
      description: "Finish session (imopenlines.session.finish)",
      action: "Finish session",
    },
    {
      name: "Send Message",
      value: "sendMessage",
      description: "Send message to session (imopenlines.message.add)",
      action: "Send message",
    },
    {
      name: "Get Messages",
      value: "getMessages",
      description: "Get session messages (imopenlines.message.list)",
      action: "Get session messages",
    },
    {
      name: "Transfer Session",
      value: "transferSession",
      description:
        "Transfer session to another operator (imopenlines.session.transfer)",
      action: "Transfer session",
    },
    {
      name: "Close Session",
      value: "closeSession",
      description: "Close session (imopenlines.session.close)",
      action: "Close session",
    },
  ],
  default: "sendMessage",
};

// Session ID field
const sessionIdField: INodeProperties = {
  displayName: "Session ID",
  name: "sessionId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the session",
  displayOptions: {
    show: {
      resource: ["openLines"],
      operation: ["sendMessage", "getMessages", "closeSession"],
    },
  },
};

// Message field
const messageField: INodeProperties = {
  displayName: "Message",
  name: "message",
  type: "string",
  required: true,
  default: "",
  description: "Message content",
  typeOptions: {
    rows: 4,
  },
  displayOptions: {
    show: {
      resource: ["openLines"],
      operation: ["sendMessage"],
    },
  },
};

// Configuration ID field
const configIdField: INodeProperties = {
  displayName: "Configuration ID",
  name: "configId",
  type: "string",
  required: true,
  default: "",
  description: "OpenLines configuration ID",
  displayOptions: {
    show: {
      resource: ["openLines"],
      operation: ["createSession"],
    },
  },
};

// User ID field
const userIdField: INodeProperties = {
  displayName: "User ID",
  name: "userId",
  type: "string",
  default: "",
  description: "User ID for the session",
  displayOptions: {
    show: {
      resource: ["openLines"],
      operation: ["createSession"],
    },
  },
};

// Chat ID field
const chatIdField: INodeProperties = {
  displayName: "Chat ID",
  name: "chatId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the chat",
  displayOptions: {
    show: {
      resource: ["openLines"],
      operation: ["sendMessage"],
    },
  },
};

// Access Token field
const accessTokenField: INodeProperties = {
  displayName: "Access Token",
  name: "accessToken",
  type: "string",
  default: "",
  description: "Access token for authentication",
  displayOptions: {
    show: {
      resource: ["openLines"],
    },
  },
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
      resource: ["openLines"],
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
      displayName: "Sort",
      name: "sort",
      type: "json",
      default: "{}",
      description: "Sort order for results in JSON format",
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

// Export operations
export const openLinesOperations = [
  {
    name: "Send Message",
    value: "sendMessage",
    description: "Send a message to a session",
    action: "Send a message",
  },
  {
    name: "Get Messages",
    value: "getMessages",
    description: "Get messages from a session",
    action: "Get messages",
  },
  {
    name: "Create Session",
    value: "createSession",
    description: "Create a new session",
    action: "Create a session",
  },
  {
    name: "Close Session",
    value: "closeSession",
    description: "Close a session",
    action: "Close a session",
  },
  {
    name: "Get Sessions",
    value: "getSessions",
    description: "Get all sessions",
    action: "Get sessions",
  },
];

// Export fields
export const openLinesFields: INodeProperties[] = [
  operationField,
  sessionIdField,
  messageField,
  userIdField,
  chatIdField,
  optionsCollection,
];

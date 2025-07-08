import { INodeProperties } from "n8n-workflow";

// User Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "get",
  displayOptions: {
    show: {
      resource: ["user"],
    },
  },
  options: [
    {
      name: "Get Current User",
      value: "getCurrent",
      description: "Get current user information (user.current)",
      action: "Get current user",
    },
    {
      name: "Get User",
      value: "get",
      description: "Get user information (user.get)",
      action: "Get user information",
    },
    {
      name: "Get All Users",
      value: "getAll",
      description: "Get list of users (user.list)",
      action: "Get list of users",
    },
    {
      name: "Add User",
      value: "add",
      description: "Add new user (user.add)",
      action: "Add new user",
    },
    {
      name: "Update User",
      value: "update",
      description: "Update user information (user.update)",
      action: "Update user",
    },
    {
      name: "Get User Fields",
      value: "getFields",
      description: "Get user fields (user.fields)",
      action: "Get user fields",
    },
  ],
};

// User ID field
const userIdField: INodeProperties = {
  displayName: "User ID",
  name: "userId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the user",
  displayOptions: {
    show: {
      resource: ["user"],
      operation: ["get", "update"],
    },
  },
};

// User data field for add/update operations
const userDataField: INodeProperties = {
  displayName: "User Data",
  name: "userData",
  type: "json",
  default: "{}",
  description: "User data in JSON format",
  displayOptions: {
    show: {
      resource: ["user"],
      operation: ["add", "update"],
    },
  },
};

// Return All field
const returnAllField: INodeProperties = {
  displayName: "Return All",
  name: "returnAll",
  type: "boolean",
  displayOptions: {
    show: {
      resource: ["user"],
      operation: ["getAll"],
    },
  },
  default: false,
  description: "Whether to return all results or only up to the limit",
};

// Limit field
const limitField: INodeProperties = {
  displayName: "Limit",
  name: "limit",
  type: "number",
  displayOptions: {
    show: {
      resource: ["user"],
      operation: ["getAll"],
      returnAll: [false],
    },
  },
  typeOptions: {
    minValue: 1,
    maxValue: 500,
  },
  default: 50,
  description: "Max number of results to return",
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
      resource: ["user"],
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
      description: "Sort criteria in JSON format",
    },
    {
      displayName: "Admin Mode",
      name: "adminMode",
      type: "boolean",
      default: false,
      description: "Whether to use admin mode",
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

// Export operations
export const userOperations = [
  {
    name: "Get",
    value: "get",
    description: "Get a user by ID",
    action: "Get a user",
  },
  {
    name: "Get All",
    value: "getAll",
    description: "Get all users",
    action: "Get all users",
  },
  {
    name: "Get Current",
    value: "getCurrent",
    description: "Get current user",
    action: "Get current user",
  },
];

// Export fields
export const userFields: INodeProperties[] = [
  operationField,
  userIdField,
  userDataField,
  returnAllField,
  limitField,
  optionsCollection,
];

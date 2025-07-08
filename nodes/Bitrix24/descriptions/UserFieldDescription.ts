import { INodeProperties } from "n8n-workflow";

/**
 * User field operations
 */
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["userField"],
    },
  },
  options: [
    {
      name: "Get User Fields",
      value: "getUserFields",
      description: "Get user fields (userfield.get)",
      action: "Get user fields",
    },
    {
      name: "Add User Field",
      value: "addUserField",
      description: "Add user field (userfield.add)",
      action: "Add user field",
    },
    {
      name: "Update User Field",
      value: "updateUserField",
      description: "Update user field (userfield.update)",
      action: "Update user field",
    },
    {
      name: "Delete User Field",
      value: "deleteUserField",
      description: "Delete user field (userfield.delete)",
      action: "Delete user field",
    },
    {
      name: "Get User Field Types",
      value: "getUserFieldTypes",
      description: "Get user field types (userfield.types)",
      action: "Get user field types",
    },
    {
      name: "Get User Field Settings",
      value: "getUserFieldSettings",
      description: "Get user field settings (userfield.settings.get)",
      action: "Get user field settings",
    },
    {
      name: "Set User Field Settings",
      value: "setUserFieldSettings",
      description: "Set user field settings (userfield.settings.set)",
      action: "Set user field settings",
    },
  ],
  default: "getUserFields",
};

/**
 * ID field for delete, get, update operations
 */
const idField: INodeProperties = {
  displayName: "ID",
  name: "id",
  type: "string",
  required: true,
  default: "",
  description: "ID of the user field",
  displayOptions: {
    show: {
      resource: ["userField"],
      operation: ["delete", "get", "update"],
    },
  },
};

/**
 * Filter field for getList operation
 */
const filterField: INodeProperties = {
  displayName: "Filter",
  name: "filter",
  type: "json",
  default: "{}",
  description: "Filter criteria in JSON format",
  displayOptions: {
    show: {
      resource: ["userField"],
      operation: ["getList"],
    },
  },
};

/**
 * Order field for getList operation
 */
const orderField: INodeProperties = {
  displayName: "Order",
  name: "order",
  type: "json",
  default: "{}",
  description: "Order criteria in JSON format",
  displayOptions: {
    show: {
      resource: ["userField"],
      operation: ["getList"],
    },
  },
};

/**
 * Select field for getList operation
 */
const selectField: INodeProperties = {
  displayName: "Select",
  name: "select",
  type: "string",
  default: "",
  description:
    "Comma-separated list of fields to return. Empty means all fields.",
  displayOptions: {
    show: {
      resource: ["userField"],
      operation: ["getList"],
    },
  },
};

/**
 * Entity ID field for getFields and add operations
 */
const entityIdField: INodeProperties = {
  displayName: "Entity ID",
  name: "entityId",
  type: "string",
  required: true,
  default: "",
  description: "Entity ID for the user field (e.g., CRM_LEAD)",
  displayOptions: {
    show: {
      resource: ["userField"],
      operation: ["getFields", "add"],
    },
  },
};

/**
 * Fields field for add and update operations
 */
const fieldsField: INodeProperties = {
  displayName: "Fields",
  name: "fields",
  type: "json",
  default: "{}",
  required: true,
  description: "Fields to create/update in JSON format",
  displayOptions: {
    show: {
      resource: ["userField"],
      operation: ["add", "update"],
    },
  },
};

/**
 * Options collection
 */
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["userField"],
    },
  },
  options: [
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      description: "Access token for authentication",
    },
  ],
};

export const userFieldOperations = [
  {
    name: "Get User Fields",
    value: "getUserFields",
    description: "Get user fields (userfield.get)",
    action: "Get user fields",
  },
  {
    name: "Add User Field",
    value: "addUserField",
    description: "Add user field (userfield.add)",
    action: "Add user field",
  },
  {
    name: "Update User Field",
    value: "updateUserField",
    description: "Update user field (userfield.update)",
    action: "Update user field",
  },
  {
    name: "Delete User Field",
    value: "deleteUserField",
    description: "Delete user field (userfield.delete)",
    action: "Delete user field",
  },
  {
    name: "Get User Field Types",
    value: "getUserFieldTypes",
    description: "Get user field types (userfield.types)",
    action: "Get user field types",
  },
  {
    name: "Get User Field Settings",
    value: "getUserFieldSettings",
    description: "Get user field settings (userfield.settings.get)",
    action: "Get user field settings",
  },
  {
    name: "Set User Field Settings",
    value: "setUserFieldSettings",
    description: "Set user field settings (userfield.settings.set)",
    action: "Set user field settings",
  },
];

export const userFieldFields: INodeProperties[] = [
  operationField,
  idField,
  filterField,
  orderField,
  selectField,
  entityIdField,
  fieldsField,
  optionsCollection,
];

import { INodeProperties } from "n8n-workflow";

/**
 * Status operations
 */
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["status"],
    },
  },
  options: [
    {
      name: "Get All Statuses",
      value: "getAll",
      description: "Get list of statuses (crm.status.list)",
      action: "Get all statuses",
    },
    {
      name: "Get Status",
      value: "get",
      description: "Get status information (crm.status.get)",
      action: "Get status",
    },
    {
      name: "Create Status",
      value: "create",
      description: "Add new status (crm.status.add)",
      action: "Create status",
    },
    {
      name: "Update Status",
      value: "update",
      description: "Update status (crm.status.update)",
      action: "Update status",
    },
    {
      name: "Delete Status",
      value: "delete",
      description: "Delete status (crm.status.delete)",
      action: "Delete status",
    },
    {
      name: "Get Status Fields",
      value: "getFields",
      description: "Get status fields (crm.status.fields)",
      action: "Get status fields",
    },
  ],
  default: "getAll",
};

/**
 * Status ID field
 */
const statusIdField: INodeProperties = {
  displayName: "Status ID",
  name: "statusId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the status",
  displayOptions: {
    show: {
      resource: ["status"],
      operation: ["get", "update", "delete"],
    },
  },
};

/**
 * Fields collection for create operation
 */
const createFieldsCollection: INodeProperties = {
  displayName: "Fields",
  name: "fields",
  type: "collection",
  placeholder: "Add Field",
  default: {},
  displayOptions: {
    show: {
      resource: ["status"],
      operation: ["create"],
    },
  },
  options: [
    {
      displayName: "Entity ID",
      name: "ENTITY_ID",
      type: "string",
      default: "",
      description:
        "Entity ID (e.g., DEAL_STAGE, LEAD_STATUS, CONTACT_TYPE) - Required",
    },
    {
      displayName: "Status ID",
      name: "STATUS_ID",
      type: "string",
      default: "",
      description: "Unique identifier for the status - Required",
    },
    {
      displayName: "Name",
      name: "NAME",
      type: "string",
      default: "",
      description: "Name of the status - Required",
    },
    {
      displayName: "Sort Order",
      name: "SORT",
      type: "number",
      default: 100,
      description: "Sort order of the status",
    },
    {
      displayName: "Extra",
      name: "EXTRA",
      type: "json",
      default: "{}",
      description: "Extra parameters as JSON object",
    },
  ],
};

/**
 * Fields collection for update operation
 */
const updateFieldsCollection: INodeProperties = {
  displayName: "Fields",
  name: "fields",
  type: "collection",
  placeholder: "Add Field",
  default: {},
  displayOptions: {
    show: {
      resource: ["status"],
      operation: ["update"],
    },
  },
  options: [
    {
      displayName: "Name",
      name: "NAME",
      type: "string",
      default: "",
      description: "Name of the status",
    },
    {
      displayName: "Sort Order",
      name: "SORT",
      type: "number",
      default: 100,
      description: "Sort order of the status",
    },
    {
      displayName: "Extra",
      name: "EXTRA",
      type: "json",
      default: "{}",
      description: "Extra parameters as JSON object",
    },
  ],
};

/**
 * Options collection for getAll operation
 */
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["status"],
      operation: ["getAll"],
    },
  },
  options: [
    {
      displayName: "Entity ID",
      name: "entityId",
      type: "string",
      default: "",
      description: "Entity ID to filter by (e.g., DEAL_STAGE, LEAD_STATUS)",
    },
    {
      displayName: "Filter",
      name: "filter",
      type: "json",
      default: "{}",
      description: "Filter criteria as JSON object",
    },
    {
      displayName: "Order",
      name: "order",
      type: "json",
      default: "{}",
      description: "Sort order as JSON object",
    },
    {
      displayName: "Select Fields",
      name: "select",
      type: "string",
      default: "",
      description: "Comma-separated list of fields to return",
    },
    {
      displayName: "Language",
      name: "lang",
      type: "string",
      default: "",
      description: "Language code for localized names",
    },
    {
      displayName: "Custom Parameters",
      name: "customParameters",
      type: "json",
      default: "{}",
      description: "Additional parameters as JSON object",
    },
  ],
};

export const statusFields: INodeProperties[] = [
  operationField,
  statusIdField,
  createFieldsCollection,
  updateFieldsCollection,
  optionsCollection,
];

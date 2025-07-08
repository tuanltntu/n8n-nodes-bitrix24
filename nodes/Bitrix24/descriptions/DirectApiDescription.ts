import { INodeProperties } from "n8n-workflow";

/**
 * DirectAPI Description - CLEAN VERSION without circular dependencies
 */

// Operation field for Direct API
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "call",
  displayOptions: {
    show: {
      resource: ["directApi"],
    },
  },
  options: [
    {
      name: "Call",
      value: "call",
      description: "Call any Bitrix24 REST API method directly",
      action: "Call any Bitrix24 REST API method",
    },
  ],
};

// Method field for Direct API
const methodField: INodeProperties = {
  displayName: "Method",
  name: "endpoint",
  type: "string",
  required: true,
  default: "",
  placeholder: "crm.lead.list",
  description:
    "Direct Bitrix24 REST API endpoint without the domain or auth parts. Example: crm.lead.list, user.get, tasks.task.list",
  displayOptions: {
    show: {
      resource: ["directApi"],
      operation: ["call"],
    },
  },
};

// Body field for Direct API
const bodyField: INodeProperties = {
  displayName: "Body",
  name: "body",
  type: "json",
  default: "{}",
  description:
    'JSON data to include in the request body. Example: {"FIELDS": {"TITLE": "New Lead", "NAME": "John"}}',
  displayOptions: {
    show: {
      resource: ["directApi"],
      operation: ["call"],
    },
  },
};

// Options collection for Direct API
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "directApiOptions",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["directApi"],
      operation: ["call"],
    },
  },
  options: [
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      description: "Use this access token instead of the one from credentials",
    },
    {
      displayName: "Debug Mode",
      name: "debug",
      type: "boolean",
      default: false,
      description:
        "Enable debug mode to see detailed request and response information",
    },
  ],
};

// Export fields using smart organization
export const directApiFields: INodeProperties[] = [
  operationField,
  methodField,
  bodyField,
  optionsCollection,
];

// Export all fields directly without operations
export const allDirectApiFields = [...directApiFields];

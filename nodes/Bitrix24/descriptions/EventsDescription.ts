import { INodeProperties } from "n8n-workflow";

/**
 * Events Description - CLEAN VERSION without circular dependencies
 */

// Event Type Field
const eventTypeField: INodeProperties = {
  displayName: "Event Type",
  name: "eventType",
  type: "options",
  options: [
    { name: "CRM Lead Add", value: "ONCRMLEADADD" },
    { name: "CRM Lead Update", value: "ONCRMLEADUPDATE" },
    { name: "CRM Deal Add", value: "ONCRMDEALADD" },
    { name: "CRM Deal Update", value: "ONCRMDEALUPDATE" },
    { name: "Task Add", value: "ONTASKADD" },
    { name: "Task Update", value: "ONTASKUPDATE" },
    { name: "User Add", value: "ONUSERADD" },
  ],
  default: "ONCRMLEADADD",
  required: true,
  description: "Type of event to listen for",
  displayOptions: {
    show: {
      resource: ["events"],
      operation: ["bind", "unbind"],
    },
  },
};

// Handler URL Field
const handlerUrlField: INodeProperties = {
  displayName: "Handler URL",
  name: "handlerUrl",
  type: "string",
  required: true,
  default: "",
  description: "URL to handle the event",
  displayOptions: {
    show: {
      resource: ["events"],
      operation: ["bind"],
    },
  },
};

// Event ID Field
const eventIdField: INodeProperties = {
  displayName: "Event ID",
  name: "eventId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the event handler",
  displayOptions: {
    show: {
      resource: ["events"],
      operation: ["unbind"],
    },
  },
};

// Bind Event operation fields
const bindFields: INodeProperties[] = [
  eventTypeField,
  handlerUrlField,
  {
    displayName: "Options",
    name: "additionalOptions",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["events"],
        operation: ["registerHandler"],
      },
    },
    options: [
      {
        displayName: "User ID",
        name: "userId",
        type: "string",
        default: "",
        description: "Bind event for specific user (optional)",
      },
      {
        displayName: "Auth Type",
        name: "authType",
        type: "options",
        options: [
          { name: "Application", value: "0" },
          { name: "User", value: "1" },
        ],
        default: "0",
        description: "Authorization type for the event",
      },
      {
        displayName: "Access Token",
        name: "accessToken",
        type: "string",
        default: "",
        description: "Access token for authentication",
      },
    ],
  },
];

// Unbind Event operation fields
const unbindFields: INodeProperties[] = [eventTypeField, eventIdField];

// Get All operation fields
const getAllFields: INodeProperties[] = [
  {
    displayName: "Scope",
    name: "scope",
    type: "string",
    default: "",
    description: "Scope to filter events (optional)",
    displayOptions: {
      show: {
        resource: ["events"],
        operation: ["getHandlers"],
      },
    },
  },
];

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "bind",
  displayOptions: {
    show: {
      resource: ["events"],
    },
  },
  options: [
    {
      name: "Register Handler",
      value: "bind",
      description: "Register event handler (event.bind)",
      action: "Register event handler",
    },
    {
      name: "Unregister Handler",
      value: "unbind",
      description: "Unregister event handler (event.unbind)",
      action: "Unregister event handler",
    },
    {
      name: "Get Handlers",
      value: "get",
      description: "Get event handlers (event.get)",
      action: "Get event handlers",
    },
  ],
};

// Export all Events operations and fields
export const eventsOperations = [
  {
    name: "Register Handler",
    value: "bind",
    description: "Register event handler (event.bind)",
    action: "Register event handler",
  },
  {
    name: "Unregister Handler",
    value: "unbind",
    description: "Unregister event handler (event.unbind)",
    action: "Unregister event handler",
  },
  {
    name: "Get Handlers",
    value: "get",
    description: "Get event handlers (event.get)",
    action: "Get event handlers",
  },
];

export const eventsFields: INodeProperties[] = [
  operationField,
  ...bindFields,
  ...getAllFields,
];

import { INodeProperties } from "n8n-workflow";

// Activity operations
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["activity"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create a new activity (crm.activity.add)",
      action: "Create a new activity",
    },
    {
      name: "Update",
      value: "update",
      description: "Update an activity (crm.activity.update)",
      action: "Update an activity",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete an activity (crm.activity.delete)",
      action: "Delete an activity",
    },
    {
      name: "Get",
      value: "get",
      description: "Get activity information (crm.activity.get)",
      action: "Get activity information",
    },
    {
      name: "Get All",
      value: "getAll",
      description: "Get all activities (crm.activity.list)",
      action: "Get all activities",
    },
    {
      name: "Get Fields",
      value: "getFields",
      description: "Get activity fields (crm.activity.fields)",
      action: "Get activity fields",
    },
  ],
  default: "getAll",
};

// Activity ID field
const activityIdField: INodeProperties = {
  displayName: "Activity ID",
  name: "activityId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["get", "delete", "update"],
    },
  },
  description: "ID of the activity to operate on",
};

// Type field for activity creation
const activityTypeField: INodeProperties = {
  displayName: "Type",
  name: "typeId",
  type: "options",
  options: [
    { name: "Call", value: "CALL" },
    { name: "Email", value: "EMAIL" },
    { name: "Meeting", value: "MEETING" },
    { name: "Task", value: "TASK" },
  ],
  default: "CALL",
  required: true,
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["create"],
    },
  },
  description: "Type of activity to create",
};

// Owner type field
const ownerTypeField: INodeProperties = {
  displayName: "Owner Type",
  name: "ownerTypeId",
  type: "options",
  options: [
    { name: "Company", value: "COMPANY" },
    { name: "Contact", value: "CONTACT" },
    { name: "Deal", value: "DEAL" },
    { name: "Lead", value: "LEAD" },
  ],
  default: "CONTACT",
  required: true,
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["create"],
    },
  },
  description: "Type of entity that owns the activity",
};

// Owner ID field
const ownerIdField: INodeProperties = {
  displayName: "Owner ID",
  name: "ownerId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["create"],
    },
  },
  description: "ID of the entity that owns the activity",
};

// Subject field
const subjectField: INodeProperties = {
  displayName: "Subject",
  name: "subject",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["create"],
    },
  },
  description: "Subject of the activity",
};

// Responsible ID field
const responsibleIdField: INodeProperties = {
  displayName: "Responsible ID",
  name: "responsibleId",
  type: "string",
  default: "",
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["create"],
    },
  },
  description: "ID of the responsible user",
};

// Start time field
const startTimeField: INodeProperties = {
  displayName: "Start Time",
  name: "startTime",
  type: "dateTime",
  default: "",
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["create"],
    },
  },
  description: "Start time of the activity",
};

// End time field
const endTimeField: INodeProperties = {
  displayName: "End Time",
  name: "endTime",
  type: "dateTime",
  default: "",
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["create"],
    },
  },
  description: "End time of the activity",
};

// Return All field
const returnAllField: INodeProperties = {
  displayName: "Return All",
  name: "returnAll",
  type: "boolean",
  default: false,
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["getAll"],
    },
  },
  description: "Whether to return all results or only up to the limit",
};

// Update fields collection
const updateFieldsCollection: INodeProperties = {
  displayName: "Update Fields",
  name: "updateFields",
  type: "collection",
  placeholder: "Add Field",
  default: {},
  displayOptions: {
    show: {
      resource: ["activity"],
      operation: ["update"],
    },
  },
  options: [
    {
      displayName: "Subject",
      name: "subject",
      type: "string",
      default: "",
      description: "Subject of the activity",
    },
    {
      displayName: "Type",
      name: "typeId",
      type: "options",
      options: [
        { name: "Call", value: "CALL" },
        { name: "Email", value: "EMAIL" },
        { name: "Meeting", value: "MEETING" },
        { name: "Task", value: "TASK" },
      ],
      default: "CALL",
      description: "Type of activity",
    },
    {
      displayName: "Responsible ID",
      name: "responsibleId",
      type: "string",
      default: "",
      description: "ID of the responsible user",
    },
    {
      displayName: "Start Time",
      name: "startTime",
      type: "dateTime",
      default: "",
      description: "Start time of the activity",
    },
    {
      displayName: "End Time",
      name: "endTime",
      type: "dateTime",
      default: "",
      description: "End time of the activity",
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
      resource: ["activity"],
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
      displayName: "Select",
      name: "select",
      type: "json",
      default: "[]",
      description: "Fields to select in JSON format",
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

export const activityOperations = [
  {
    name: "Create",
    value: "create",
    description: "Create a new activity (crm.activity.add)",
    action: "Create a new activity",
  },
  {
    name: "Delete",
    value: "delete",
    description: "Delete an activity (crm.activity.delete)",
    action: "Delete an activity",
  },
  {
    name: "Get",
    value: "get",
    description: "Get activity information (crm.activity.get)",
    action: "Get activity information",
  },
  {
    name: "Get All",
    value: "getAll",
    description: "Get all activities (crm.activity.list)",
    action: "Get all activities",
  },
  {
    name: "Get Fields",
    value: "getFields",
    description: "Get activity fields (crm.activity.fields)",
    action: "Get activity fields",
  },
  {
    name: "Update",
    value: "update",
    description: "Update an activity (crm.activity.update)",
    action: "Update an activity",
  },
];

export const activityFields: INodeProperties[] = [
  operationField,
  activityIdField,
  activityTypeField,
  ownerTypeField,
  ownerIdField,
  subjectField,
  responsibleIdField,
  startTimeField,
  endTimeField,
  updateFieldsCollection,
  optionsCollection,
];

import { INodeProperties } from "n8n-workflow";

// Task Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "create",
  displayOptions: {
    show: {
      resource: ["task"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create a new task (tasks.task.add)",
      action: "Create a new task",
    },
    {
      name: "Get",
      value: "get",
      description: "Get task information (tasks.task.get)",
      action: "Get task information",
    },
    {
      name: "Get All",
      value: "getAll",
      description: "Get all tasks (tasks.task.list)",
      action: "Get all tasks",
    },
    {
      name: "Update",
      value: "update",
      description: "Update a task (tasks.task.update)",
      action: "Update a task",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a task (tasks.task.delete)",
      action: "Delete a task",
    },
    {
      name: "Add Comment",
      value: "addComment",
      description: "Add a comment to a task",
      action: "Add a comment to a task",
    },
    {
      name: "Complete",
      value: "complete",
      description: "Complete a task (tasks.task.complete)",
      action: "Complete a task",
    },
    {
      name: "Start",
      value: "start",
      description: "Start a task (tasks.task.start)",
      action: "Start a task",
    },
    {
      name: "Pause",
      value: "pause",
      description: "Pause a task (tasks.task.pause)",
      action: "Pause a task",
    },
  ],
};

// Task ID field
const taskIdField: INodeProperties = {
  displayName: "Task ID",
  name: "taskId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the task",
  displayOptions: {
    show: {
      resource: ["task"],
      operation: ["get", "update", "delete", "addComment"],
    },
  },
};

// Fields collection for create/update
const fieldsCollection: INodeProperties = {
  displayName: "Fields",
  name: "fields",
  type: "collection",
  placeholder: "Add Field",
  default: {},
  displayOptions: {
    show: {
      resource: ["task"],
      operation: ["create", "update"],
    },
  },
  options: [
    {
      displayName: "Title",
      name: "TITLE",
      type: "string",
      default: "",
      description: "Title of the task",
    },
    {
      displayName: "Description",
      name: "DESCRIPTION",
      type: "string",
      typeOptions: {
        rows: 4,
      },
      default: "",
      description: "Description of the task",
    },
    {
      displayName: "Responsible User ID",
      name: "RESPONSIBLE_ID",
      type: "string",
      default: "",
      description: "ID of the user responsible for the task",
    },
    {
      displayName: "Deadline",
      name: "DEADLINE",
      type: "dateTime",
      default: "",
      description: "Deadline for the task",
    },
    {
      displayName: "Priority",
      name: "PRIORITY",
      type: "options",
      options: [
        {
          name: "Low",
          value: "0",
        },
        {
          name: "Normal",
          value: "1",
        },
        {
          name: "High",
          value: "2",
        },
      ],
      default: "1",
      description: "Priority of the task",
    },
    {
      displayName: "Status",
      name: "STATUS",
      type: "options",
      options: [
        {
          name: "New",
          value: "1",
        },
        {
          name: "Pending",
          value: "2",
        },
        {
          name: "In Progress",
          value: "3",
        },
        {
          name: "Supposedly Completed",
          value: "4",
        },
        {
          name: "Completed",
          value: "5",
        },
        {
          name: "Deferred",
          value: "6",
        },
        {
          name: "Declined",
          value: "7",
        },
      ],
      default: "1",
      description: "Status of the task",
    },
    {
      displayName: "Group ID",
      name: "GROUP_ID",
      type: "string",
      default: "",
      description: "ID of the group for the task",
    },
    {
      displayName: "Created By",
      name: "CREATED_BY",
      type: "string",
      default: "",
      description: "ID of the user who created the task",
    },
    {
      displayName: "Start Date",
      name: "START_DATE_PLAN",
      type: "dateTime",
      default: "",
      description: "Planned start date for the task",
    },
    {
      displayName: "End Date",
      name: "END_DATE_PLAN",
      type: "dateTime",
      default: "",
      description: "Planned end date for the task",
    },
  ],
};

// Comment Text field for addComment
const commentTextField: INodeProperties = {
  displayName: "Comment Text",
  name: "commentText",
  type: "string",
  typeOptions: {
    rows: 3,
  },
  required: true,
  default: "",
  description: "Text of the comment to add",
  displayOptions: {
    show: {
      resource: ["task"],
      operation: ["addComment"],
    },
  },
};

// Return All field for getAll
const returnAllField: INodeProperties = {
  displayName: "Return All",
  name: "returnAll",
  type: "boolean",
  displayOptions: {
    show: {
      resource: ["task"],
      operation: ["getAll"],
    },
  },
  default: false,
  description: "Whether to return all results or only up to the limit",
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
      resource: ["task"],
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
      displayName: "Select",
      name: "select",
      type: "json",
      default: "[]",
      description: "Fields to select in JSON format",
    },
    {
      displayName: "Group",
      name: "group",
      type: "json",
      default: "{}",
      description: "Group criteria in JSON format",
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
export const taskOperations = [
  {
    name: "Create",
    value: "create",
    description: "Create a new task (tasks.task.add)",
    action: "Create a new task",
  },
  {
    name: "Get",
    value: "get",
    description: "Get task information (tasks.task.get)",
    action: "Get task information",
  },
  {
    name: "Get All",
    value: "getAll",
    description: "Get all tasks (tasks.task.list)",
    action: "Get all tasks",
  },
  {
    name: "Update",
    value: "update",
    description: "Update a task (tasks.task.update)",
    action: "Update a task",
  },
  {
    name: "Delete",
    value: "delete",
    description: "Delete a task (tasks.task.delete)",
    action: "Delete a task",
  },
  {
    name: "Add Comment",
    value: "addComment",
    description: "Add a comment to a task",
    action: "Add a comment to a task",
  },
  {
    name: "Complete",
    value: "complete",
    description: "Complete a task (tasks.task.complete)",
    action: "Complete a task",
  },
  {
    name: "Start",
    value: "start",
    description: "Start a task (tasks.task.start)",
    action: "Start a task",
  },
  {
    name: "Pause",
    value: "pause",
    description: "Pause a task (tasks.task.pause)",
    action: "Pause a task",
  },
];

// Export fields
export const taskFields: INodeProperties[] = [
  operationField,
  taskIdField,
  fieldsCollection,
  commentTextField,
  returnAllField,
  optionsCollection,
];

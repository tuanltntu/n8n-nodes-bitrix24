import { INodeProperties } from "n8n-workflow";

/**
 * Timeline Description - CLEAN VERSION without circular dependencies
 */

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["timeline"],
    },
  },
  options: [
    // Comment operations
    {
      name: "Get Comments",
      value: "getComments",
      description: "Get timeline comments (crm.timeline.comment.list)",
      action: "Get timeline comments",
    },
    {
      name: "Get Comment",
      value: "getComment",
      description: "Get a timeline comment (crm.timeline.comment.get)",
      action: "Get a timeline comment",
    },
    {
      name: "Add Comment",
      value: "addComment",
      description: "Add a timeline comment (crm.timeline.comment.add)",
      action: "Add a timeline comment",
    },
    {
      name: "Update Comment",
      value: "updateComment",
      description: "Update a timeline comment (crm.timeline.comment.update)",
      action: "Update a timeline comment",
    },
    {
      name: "Delete Comment",
      value: "deleteComment",
      description: "Delete a timeline comment (crm.timeline.comment.delete)",
      action: "Delete a timeline comment",
    },
    {
      name: "Get Comment Fields",
      value: "getCommentFields",
      description: "Get available comment fields",
      action: "Get comment fields",
    },

    // Note operations
    {
      name: "Get Note",
      value: "getNote",
      description: "Get a timeline note (crm.timeline.note.get)",
      action: "Get a timeline note",
    },
    {
      name: "Save Note",
      value: "saveNote",
      description: "Save a timeline note",
      action: "Save a timeline note",
    },
    {
      name: "Delete Note",
      value: "deleteNote",
      description: "Delete a timeline note (crm.timeline.note.delete)",
      action: "Delete a timeline note",
    },

    // Binding operations
    {
      name: "Bind",
      value: "bind",
      description: "Bind timeline to entity",
      action: "Bind timeline to entity",
    },
    {
      name: "Get Bindings",
      value: "getBindings",
      description: "Get timeline bindings (crm.timeline.bindings.list)",
      action: "Get timeline bindings",
    },
    {
      name: "Unbind",
      value: "unbind",
      description: "Unbind timeline from entity",
      action: "Unbind timeline from entity",
    },
    {
      name: "Get Bindings Fields",
      value: "getBindingsFields",
      description: "Get available binding fields",
      action: "Get binding fields",
    },

    // Layout blocks operations
    {
      name: "Set Layout Blocks",
      value: "setLayoutBlocks",
      description: "Set layout blocks for timeline",
      action: "Set layout blocks",
    },
    {
      name: "Get Layout Blocks",
      value: "getLayoutBlocks",
      description: "Get layout blocks for timeline",
      action: "Get layout blocks",
    },
    {
      name: "Delete Layout Blocks",
      value: "deleteLayoutBlocks",
      description: "Delete layout blocks for timeline",
      action: "Delete layout blocks",
    },

    // Log message operations
    {
      name: "Add Log Message",
      value: "addLogMessage",
      description: "Add a log message to timeline",
      action: "Add log message",
    },
    {
      name: "Get Log Message",
      value: "getLogMessage",
      description: "Get a log message from timeline",
      action: "Get log message",
    },
    {
      name: "Get Log Messages",
      value: "getLogMessages",
      description: "Get log messages from timeline",
      action: "Get log messages",
    },
    {
      name: "Delete Log Message",
      value: "deleteLogMessage",
      description: "Delete a log message from timeline",
      action: "Delete log message",
    },
  ],
  default: "getComments",
};

// Comment ID field
const commentIdField: INodeProperties = {
  displayName: "Comment ID",
  name: "commentId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the comment",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["getComment", "updateComment", "deleteComment"],
    },
  },
};

// Note ID field
const noteIdField: INodeProperties = {
  displayName: "Note ID",
  name: "noteId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the note",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["getNote", "deleteNote"],
    },
  },
};

// Log message ID field
const logMessageIdField: INodeProperties = {
  displayName: "Log Message ID",
  name: "logMessageId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the log message",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["getLogMessage", "deleteLogMessage"],
    },
  },
};

// Entity type field
const entityTypeField: INodeProperties = {
  displayName: "Entity Type",
  name: "entityType",
  type: "options",
  options: [
    { name: "Lead", value: "LEAD" },
    { name: "Deal", value: "DEAL" },
    { name: "Contact", value: "CONTACT" },
    { name: "Company", value: "COMPANY" },
  ],
  default: "DEAL",
  required: true,
  description: "Type of entity",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: [
        "getComments",
        "addComment",
        "bind",
        "getBindings",
        "unbind",
        "setLayoutBlocks",
        "getLayoutBlocks",
        "deleteLayoutBlocks",
        "addLogMessage",
        "getLogMessages",
      ],
    },
  },
};

// Entity ID field
const entityIdField: INodeProperties = {
  displayName: "Entity ID",
  name: "entityId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the entity",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: [
        "getComments",
        "addComment",
        "bind",
        "getBindings",
        "unbind",
        "setLayoutBlocks",
        "getLayoutBlocks",
        "deleteLayoutBlocks",
        "addLogMessage",
        "getLogMessages",
      ],
    },
  },
};

// Comment data field
const commentDataField: INodeProperties = {
  displayName: "Comment Data",
  name: "commentData",
  type: "json",
  required: true,
  default: "{}",
  description: "Comment data in JSON format",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["addComment", "updateComment"],
    },
  },
};

// Note data field
const noteDataField: INodeProperties = {
  displayName: "Note Data",
  name: "noteData",
  type: "json",
  required: true,
  default: "{}",
  description: "Note data in JSON format",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["saveNote"],
    },
  },
};

// Binding data field
const bindingDataField: INodeProperties = {
  displayName: "Binding Data",
  name: "bindingData",
  type: "json",
  required: true,
  default: "{}",
  description: "Binding data in JSON format",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["bind", "unbind"],
    },
  },
};

// Layout blocks data field
const layoutBlocksDataField: INodeProperties = {
  displayName: "Layout Blocks Data",
  name: "layoutBlocksData",
  type: "json",
  required: true,
  default: "{}",
  description: "Layout blocks configuration in JSON format",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["setLayoutBlocks"],
    },
  },
};

// Log message data field
const logMessageDataField: INodeProperties = {
  displayName: "Log Message Data",
  name: "logMessageData",
  type: "json",
  required: true,
  default: "{}",
  description: "Log message data in JSON format",
  displayOptions: {
    show: {
      resource: ["timeline"],
      operation: ["addLogMessage"],
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
      resource: ["timeline"],
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
      description: "Start position for pagination",
    },
    {
      displayName: "Limit",
      name: "limit",
      type: "number",
      default: 50,
      description: "Maximum number of items to return",
    },
  ],
};

// Export operations
export const timelineOperations = [
  // Comment operations
  {
    name: "Get Comments",
    value: "getComments",
    description: "Get timeline comments",
    action: "Get timeline comments",
  },
  {
    name: "Get Comment",
    value: "getComment",
    description: "Get a timeline comment",
    action: "Get a timeline comment",
  },
  {
    name: "Add Comment",
    value: "addComment",
    description: "Add a timeline comment",
    action: "Add a timeline comment",
  },
  {
    name: "Update Comment",
    value: "updateComment",
    description: "Update a timeline comment",
    action: "Update a timeline comment",
  },
  {
    name: "Delete Comment",
    value: "deleteComment",
    description: "Delete a timeline comment",
    action: "Delete a timeline comment",
  },
  {
    name: "Get Comment Fields",
    value: "getCommentFields",
    description: "Get available comment fields",
    action: "Get comment fields",
  },

  // Note operations
  {
    name: "Get Note",
    value: "getNote",
    description: "Get a timeline note",
    action: "Get a timeline note",
  },
  {
    name: "Save Note",
    value: "saveNote",
    description: "Save a timeline note",
    action: "Save a timeline note",
  },
  {
    name: "Delete Note",
    value: "deleteNote",
    description: "Delete a timeline note",
    action: "Delete a timeline note",
  },

  // Binding operations
  {
    name: "Bind",
    value: "bind",
    description: "Bind timeline to entity",
    action: "Bind timeline to entity",
  },
  {
    name: "Get Bindings",
    value: "getBindings",
    description: "Get timeline bindings",
    action: "Get timeline bindings",
  },
  {
    name: "Unbind",
    value: "unbind",
    description: "Unbind timeline from entity",
    action: "Unbind timeline from entity",
  },
  {
    name: "Get Bindings Fields",
    value: "getBindingsFields",
    description: "Get available binding fields",
    action: "Get binding fields",
  },

  // Layout blocks operations
  {
    name: "Set Layout Blocks",
    value: "setLayoutBlocks",
    description: "Set layout blocks for timeline",
    action: "Set layout blocks",
  },
  {
    name: "Get Layout Blocks",
    value: "getLayoutBlocks",
    description: "Get layout blocks for timeline",
    action: "Get layout blocks",
  },
  {
    name: "Delete Layout Blocks",
    value: "deleteLayoutBlocks",
    description: "Delete layout blocks for timeline",
    action: "Delete layout blocks",
  },

  // Log message operations
  {
    name: "Add Log Message",
    value: "addLogMessage",
    description: "Add a log message to timeline",
    action: "Add log message",
  },
  {
    name: "Get Log Message",
    value: "getLogMessage",
    description: "Get a log message from timeline",
    action: "Get log message",
  },
  {
    name: "Get Log Messages",
    value: "getLogMessages",
    description: "Get log messages from timeline",
    action: "Get log messages",
  },
  {
    name: "Delete Log Message",
    value: "deleteLogMessage",
    description: "Delete a log message from timeline",
    action: "Delete log message",
  },
];

export const timelineFields: INodeProperties[] = [
  operationField,
  commentIdField,
  noteIdField,
  logMessageIdField,
  entityTypeField,
  entityIdField,
  commentDataField,
  noteDataField,
  bindingDataField,
  layoutBlocksDataField,
  logMessageDataField,
  optionsCollection,
];

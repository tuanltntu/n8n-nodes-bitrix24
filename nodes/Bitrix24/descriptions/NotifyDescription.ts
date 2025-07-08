import { INodeProperties } from "n8n-workflow";

// Notify operations
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["notify"],
    },
  },
  options: [
    {
      name: "Send System Notification",
      value: "sendSystemNotification",
      description: "Send system notification to user (im.notify.system.add)",
      action: "Send system notification",
    },
    {
      name: "Send Personal Notification",
      value: "sendPersonalNotification",
      description:
        "Send personal notification to user (im.notify.personal.add)",
      action: "Send personal notification",
    },
    {
      name: "Send Public Notification",
      value: "sendPublicNotification",
      description: "Send public notification to chat (im.notify.public.add)",
      action: "Send public notification",
    },
    {
      name: "Delete Notification",
      value: "deleteNotification",
      description: "Delete notification (im.notify.delete)",
      action: "Delete notification",
    },
    {
      name: "Mark as Read",
      value: "markAsRead",
      description: "Mark notification as read (im.notify.read)",
      action: "Mark notification as read",
    },
    {
      name: "Mark as Unread",
      value: "markAsUnread",
      description: "Mark notification as unread (im.notify.unread)",
      action: "Mark notification as unread",
    },
    {
      name: "Get Notifications",
      value: "getNotifications",
      description: "Get list of notifications (im.notify.history.get)",
      action: "Get notifications",
    },
    {
      name: "Get Schema",
      value: "getSchema",
      description: "Get notification schema (im.notify.schema.get)",
      action: "Get notification schema",
    },
    {
      name: "Confirm Notification",
      value: "confirmNotification",
      description: "Confirm notification (im.notify.confirm)",
      action: "Confirm notification",
    },
    {
      name: "Answer Notification",
      value: "answerNotification",
      description: "Answer to notification (im.notify.answer)",
      action: "Answer to notification",
    },
  ],
  default: "sendSystemNotification",
};

// User ID field - for targeted notifications
const userIdField: INodeProperties = {
  displayName: "User ID",
  name: "userId",
  type: "number",
  required: true,
  default: 1,
  displayOptions: {
    show: {
      resource: ["notify"],
      operation: ["sendSystemNotification", "sendPersonalNotification"],
    },
  },
  description: "ID of the user to send notification to",
  typeOptions: {
    numberStepSize: 1,
    numberPrecision: 0,
    minValue: 1,
  },
};

// Chat ID field - for public notifications
const chatIdField: INodeProperties = {
  displayName: "Chat ID",
  name: "chatId",
  type: "number",
  required: true,
  default: 1,
  displayOptions: {
    show: {
      resource: ["notify"],
      operation: ["sendPublicNotification"],
    },
  },
  description: "ID of the chat to send notification to",
  typeOptions: {
    numberStepSize: 1,
    numberPrecision: 0,
    minValue: 1,
  },
};

// Message field
const messageField: INodeProperties = {
  displayName: "Message",
  name: "message",
  type: "string",
  required: true,
  default: "",
  typeOptions: {
    rows: 4,
  },
  displayOptions: {
    show: {
      resource: ["notify"],
      operation: [
        "sendSystemNotification",
        "sendPersonalNotification",
        "sendPublicNotification",
        "answerNotification",
      ],
    },
  },
  description: "Notification message text",
};

// Notification ID field - for operations on existing notifications
const notificationIdField: INodeProperties = {
  displayName: "Notification ID",
  name: "notificationId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["notify"],
      operation: [
        "deleteNotification",
        "markAsRead",
        "markAsUnread",
        "confirmNotification",
        "answerNotification",
      ],
    },
  },
  description: "ID of the notification",
};

// Tag field - for notification categorization
const tagField: INodeProperties = {
  displayName: "Tag",
  name: "tag",
  type: "string",
  default: "",
  displayOptions: {
    show: {
      resource: ["notify"],
      operation: [
        "sendSystemNotification",
        "sendPersonalNotification",
        "sendPublicNotification",
      ],
    },
  },
  description: "Tag for notification categorization",
};

// Sub Tag field - for notification sub-categorization
const subTagField: INodeProperties = {
  displayName: "Sub Tag",
  name: "subTag",
  type: "string",
  default: "",
  displayOptions: {
    show: {
      resource: ["notify"],
      operation: [
        "sendSystemNotification",
        "sendPersonalNotification",
        "sendPublicNotification",
      ],
    },
  },
  description: "Sub-tag for detailed notification categorization",
};

// Notify Type field - for system notifications
const notifyTypeField: INodeProperties = {
  displayName: "Notification Type",
  name: "notifyType",
  type: "options",
  options: [
    { name: "Simple", value: "simple" },
    { name: "Confirm", value: "confirm" },
    { name: "Buttons", value: "buttons" },
  ],
  default: "simple",
  displayOptions: {
    show: {
      resource: ["notify"],
      operation: ["sendSystemNotification"],
    },
  },
  description: "Type of system notification",
};

// Options collection for additional parameters
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["notify"],
    },
  },
  options: [
    {
      displayName: "Attachments",
      name: "attachments",
      type: "json",
      default: "[]",
      description: "Attachments in JSON format",
    },
    {
      displayName: "URL Preview",
      name: "urlPreview",
      type: "boolean",
      default: true,
      description: "Whether to show URL preview",
    },
    {
      displayName: "Sound",
      name: "sound",
      type: "boolean",
      default: true,
      description: "Whether to play notification sound",
    },
    {
      displayName: "Push",
      name: "push",
      type: "boolean",
      default: true,
      description: "Whether to send push notification",
    },
    {
      displayName: "Email",
      name: "email",
      type: "boolean",
      default: false,
      description: "Whether to send email notification",
    },
    {
      displayName: "Buttons",
      name: "buttons",
      type: "json",
      default: "[]",
      description: "Interactive buttons for notification (JSON format)",
    },
    {
      displayName: "Confirm Text",
      name: "confirmText",
      type: "string",
      default: "",
      description: "Text for confirm button",
    },
    {
      displayName: "Decline Text",
      name: "declineText",
      type: "string",
      default: "",
      description: "Text for decline button",
    },
    {
      displayName: "Limit",
      name: "limit",
      type: "number",
      default: 50,
      description: "Limit for getting notifications",
    },
    {
      displayName: "Offset",
      name: "offset",
      type: "number",
      default: 0,
      description: "Offset for getting notifications",
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
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      description: "Access token for authentication",
    },
  ],
};

export const notifyOperations = [
  {
    name: "Send System Notification",
    value: "sendSystemNotification",
    description: "Send system notification to user (im.notify.system.add)",
    action: "Send system notification",
  },
  {
    name: "Send Personal Notification",
    value: "sendPersonalNotification",
    description: "Send personal notification to user (im.notify.personal.add)",
    action: "Send personal notification",
  },
  {
    name: "Send Public Notification",
    value: "sendPublicNotification",
    description: "Send public notification to chat (im.notify.public.add)",
    action: "Send public notification",
  },
  {
    name: "Delete Notification",
    value: "deleteNotification",
    description: "Delete notification (im.notify.delete)",
    action: "Delete notification",
  },
  {
    name: "Mark as Read",
    value: "markAsRead",
    description: "Mark notification as read (im.notify.read)",
    action: "Mark notification as read",
  },
  {
    name: "Mark as Unread",
    value: "markAsUnread",
    description: "Mark notification as unread (im.notify.unread)",
    action: "Mark notification as unread",
  },
  {
    name: "Get Notifications",
    value: "getNotifications",
    description: "Get list of notifications (im.notify.history.get)",
    action: "Get notifications",
  },
  {
    name: "Get Schema",
    value: "getSchema",
    description: "Get notification schema (im.notify.schema.get)",
    action: "Get notification schema",
  },
  {
    name: "Confirm Notification",
    value: "confirmNotification",
    description: "Confirm notification (im.notify.confirm)",
    action: "Confirm notification",
  },
  {
    name: "Answer Notification",
    value: "answerNotification",
    description: "Answer to notification (im.notify.answer)",
    action: "Answer to notification",
  },
];

export const notifyFields: INodeProperties[] = [
  operationField,
  userIdField,
  chatIdField,
  messageField,
  notificationIdField,
  tagField,
  subTagField,
  notifyTypeField,
  optionsCollection,
];

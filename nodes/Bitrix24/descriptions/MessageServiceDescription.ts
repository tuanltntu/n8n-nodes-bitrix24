import { INodeProperties } from "n8n-workflow";

// Operation field - Fixed for proper display
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "sendMessage",
  displayOptions: {
    show: {
      resource: ["messageService"],
    },
  },
  options: [
    {
      name: "Send Message",
      value: "sendMessage",
      description: "Send SMS message (messageservice.message.send)",
      action: "Send SMS message",
    },
    {
      name: "Get Providers",
      value: "getProviders",
      description: "Get available SMS providers (messageservice.provider.list)",
      action: "Get available SMS providers",
    },
    {
      name: "Get Provider Limits",
      value: "getProviderLimits",
      description: "Get provider limits (messageservice.provider.limits.get)",
      action: "Get provider limits",
    },
    {
      name: "Get Message Status",
      value: "getMessageStatus",
      description: "Get message status (messageservice.message.status.get)",
      action: "Get message status",
    },
  ],
};

// Phone Number field
const phoneNumberField: INodeProperties = {
  displayName: "Phone Number",
  name: "phoneNumber",
  type: "string",
  required: true,
  default: "",
  placeholder: "+1234567890",
  description: "Phone number to send SMS to (with country code)",
  displayOptions: {
    show: {
      resource: ["messageService"],
      operation: ["sendMessage"],
    },
  },
};

// Message Text field
const messageField: INodeProperties = {
  displayName: "Message Text",
  name: "message",
  type: "string",
  required: true,
  default: "",
  typeOptions: {
    rows: 4,
  },
  description: "Text content of the SMS message",
  displayOptions: {
    show: {
      resource: ["messageService"],
      operation: ["sendMessage"],
    },
  },
};

// Message ID field
const messageIdField: INodeProperties = {
  displayName: "Message ID",
  name: "messageId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the sent message to check status for",
  displayOptions: {
    show: {
      resource: ["messageService"],
      operation: ["getMessageStatus"],
    },
  },
};

// Provider ID field
const providerIdField: INodeProperties = {
  displayName: "Provider ID",
  name: "providerId",
  type: "string",
  required: true,
  default: "",
  description: "SMS provider ID to get limits for",
  displayOptions: {
    show: {
      resource: ["messageService"],
      operation: ["getProviderLimits"],
    },
  },
};

// Additional Options collection
const optionsCollection: INodeProperties = {
  displayName: "Additional Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["messageService"],
    },
  },
  options: [
    {
      displayName: "Provider ID",
      name: "providerId",
      type: "string",
      default: "",
      description: "Specific SMS provider to use for sending",
    },
    {
      displayName: "From",
      name: "from",
      type: "string",
      default: "",
      description: "Sender name or number",
    },
  ],
};

// Export all Message Service fields
export const messageServiceFields: INodeProperties[] = [
  operationField,
  phoneNumberField,
  messageField,
  messageIdField,
  providerIdField,
  optionsCollection,
];

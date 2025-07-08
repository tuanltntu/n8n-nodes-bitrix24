import { INodeProperties } from "n8n-workflow";

// Operation field for telephony
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["telephony"],
    },
  },
  options: [
    // External Call Operations - Confirmed endpoints
    {
      name: "Register External Call",
      value: "externalCallRegister",
      description: "Register external call (telephony.externalcall.register)",
      action: "Register external call",
    },
    {
      name: "Finish External Call",
      value: "externalCallFinish",
      description: "Finish external call (telephony.externalcall.finish)",
      action: "Finish external call",
    },
    {
      name: "Hide External Call",
      value: "externalCallHide",
      description: "Hide external call (telephony.externalcall.hide)",
      action: "Hide external call",
    },
    {
      name: "Show External Call",
      value: "externalCallShow",
      description: "Show external call (telephony.externalcall.show)",
      action: "Show external call",
    },
    {
      name: "Search CRM Entities",
      value: "externalCallSearchCrm",
      description:
        "Search CRM entities by phone (telephony.externalcall.searchcrmentities)",
      action: "Search CRM entities",
    },
    {
      name: "Attach Call Record",
      value: "externalCallAttachRecord",
      description:
        "Attach record to call (telephony.externalcall.attachrecord)",
      action: "Attach call record",
    },
    // External Line Operations - Confirmed endpoints
    {
      name: "Get External Line",
      value: "externalLineGet",
      description: "Get external line info (telephony.externalline.get)",
      action: "Get external line",
    },
    {
      name: "Add External Line",
      value: "externalLineAdd",
      description: "Add external line (telephony.externalline.add)",
      action: "Add external line",
    },
    {
      name: "Update External Line",
      value: "externalLineUpdate",
      description: "Update external line (telephony.externalline.update)",
      action: "Update external line",
    },
    {
      name: "Delete External Line",
      value: "externalLineDelete",
      description: "Delete external line (telephony.externalline.delete)",
      action: "Delete external line",
    },
    // Voximplant Operations - Confirmed endpoints
    {
      name: "Get Voximplant Statistics",
      value: "voximplantStatistics",
      description: "Get Voximplant statistics (voximplant.statistic.get)",
      action: "Get Voximplant statistics",
    },
    {
      name: "Get Voximplant Line",
      value: "voximplantLineGet",
      description: "Get Voximplant line (voximplant.line.get)",
      action: "Get Voximplant line",
    },
    {
      name: "Get Voximplant SIP Connector",
      value: "voximplantSipConnectorGet",
      description: "Get SIP connector status (voximplant.sip.connector.status)",
      action: "Get SIP connector status",
    },
    {
      name: "Get Voximplant SIP Line",
      value: "voximplantSipLineGet",
      description: "Get SIP line info (voximplant.sip.line.get)",
      action: "Get SIP line",
    },
    {
      name: "Add Voximplant SIP Line",
      value: "voximplantSipLineAdd",
      description: "Add SIP line (voximplant.sip.line.add)",
      action: "Add SIP line",
    },
    {
      name: "Update Voximplant SIP Line",
      value: "voximplantSipLineUpdate",
      description: "Update SIP line (voximplant.sip.line.update)",
      action: "Update SIP line",
    },
    {
      name: "Delete Voximplant SIP Line",
      value: "voximplantSipLineDelete",
      description: "Delete SIP line (voximplant.sip.line.delete)",
      action: "Delete SIP line",
    },
  ],
  default: "externalCallRegister",
};

// Phone number field
const phoneNumberField: INodeProperties = {
  displayName: "Phone Number",
  name: "phoneNumber",
  type: "string",
  required: true,
  default: "",
  description: "The phone number",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["externalCallRegister", "externalCallSearchCrm"],
    },
  },
};

// Call ID field
const callIdField: INodeProperties = {
  displayName: "Call ID",
  name: "callId",
  type: "string",
  required: true,
  default: "",
  description: "The ID of the call",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: [
        "externalCallFinish",
        "externalCallHide",
        "externalCallShow",
        "externalCallAttachRecord",
      ],
    },
  },
};

// User ID field
const userIdField: INodeProperties = {
  displayName: "User ID",
  name: "userId",
  type: "string",
  default: "",
  description: "The ID of the user associated with the call",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["externalCallRegister"],
    },
  },
};

// Call type field
const callTypeField: INodeProperties = {
  displayName: "Call Type",
  name: "callType",
  type: "options",
  required: true,
  options: [
    { name: "Incoming", value: "1" },
    { name: "Outgoing", value: "2" },
    { name: "Outgoing with number substitution", value: "3" },
    { name: "Callback", value: "4" },
  ],
  default: "1",
  description: "The type of the call",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["externalCallRegister"],
    },
  },
};

// Line number field
const lineNumberField: INodeProperties = {
  displayName: "Line Number",
  name: "lineNumber",
  type: "string",
  default: "",
  description: "The external line number",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["externalCallRegister"],
    },
  },
};

// Line ID field
const lineIdField: INodeProperties = {
  displayName: "Line ID",
  name: "lineId",
  type: "string",
  required: true,
  default: "",
  description: "The ID of the line",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: [
        "externalLineGet",
        "externalLineUpdate",
        "externalLineDelete",
        "voximplantStatistics",
        "voximplantLineGet",
        "voximplantSipLineGet",
        "voximplantSipLineUpdate",
        "voximplantSipLineDelete",
      ],
    },
  },
};

// Line name field
const lineNameField: INodeProperties = {
  displayName: "Line Name",
  name: "lineName",
  type: "string",
  required: true,
  default: "",
  description: "The name of the line",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: [
        "externalLineAdd",
        "externalLineUpdate",
        "voximplantSipLineAdd",
        "voximplantSipLineUpdate",
      ],
    },
  },
};

// Line number for add/update
const lineNumberAddField: INodeProperties = {
  displayName: "Line Number",
  name: "lineNumberAdd",
  type: "string",
  required: true,
  default: "",
  description: "The line number",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: [
        "externalLineAdd",
        "externalLineUpdate",
        "voximplantSipLineAdd",
        "voximplantSipLineUpdate",
      ],
    },
  },
};

// Record URL field
const recordUrlField: INodeProperties = {
  displayName: "Record URL",
  name: "recordUrl",
  type: "string",
  required: true,
  default: "",
  description: "URL of the call recording",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["externalCallAttachRecord"],
    },
  },
};

// File name field
const fileNameField: INodeProperties = {
  displayName: "File Name",
  name: "fileName",
  type: "string",
  default: "",
  description: "Name of the recording file",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["externalCallAttachRecord"],
    },
  },
};

// Date from field
const dateFromField: INodeProperties = {
  displayName: "Date From",
  name: "dateFrom",
  type: "dateTime",
  default: "",
  description: "The start date for statistics",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["voximplantStatistics"],
    },
  },
};

// Date to field
const dateToField: INodeProperties = {
  displayName: "Date To",
  name: "dateTo",
  type: "dateTime",
  default: "",
  description: "The end date for statistics",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["voximplantStatistics"],
    },
  },
};

// SIP server field
const sipServerField: INodeProperties = {
  displayName: "SIP Server",
  name: "sipServer",
  type: "string",
  required: true,
  default: "",
  description: "SIP server address",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["voximplantSipLineAdd", "voximplantSipLineUpdate"],
    },
  },
};

// SIP login field
const sipLoginField: INodeProperties = {
  displayName: "SIP Login",
  name: "sipLogin",
  type: "string",
  required: true,
  default: "",
  description: "SIP login/username",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["voximplantSipLineAdd", "voximplantSipLineUpdate"],
    },
  },
};

// SIP password field
const sipPasswordField: INodeProperties = {
  displayName: "SIP Password",
  name: "sipPassword",
  type: "string",
  typeOptions: { password: true },
  required: true,
  default: "",
  description: "SIP password",
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["voximplantSipLineAdd", "voximplantSipLineUpdate"],
    },
  },
};

// Options collection
const optionsCollection: INodeProperties = {
  displayName: "Additional Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["telephony"],
      operation: ["voximplantStatistics"],
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
      displayName: "Sort",
      name: "sort",
      type: "json",
      default: "{}",
      description: "Sort order for results in JSON format",
    },
    {
      displayName: "Limit",
      name: "limit",
      type: "number",
      default: 50,
      description: "Maximum number of records to return",
    },
    {
      displayName: "Start",
      name: "start",
      type: "number",
      default: 0,
      description: "Starting position for pagination",
    },
  ],
};

// Export operations (not used in the current implementation but kept for reference)
export const telephonyOperations = [
  // External Call Operations - Confirmed endpoints
  {
    name: "Register External Call",
    value: "externalCallRegister",
    description: "Register external call",
    action: "Register external call",
  },
  {
    name: "Finish External Call",
    value: "externalCallFinish",
    description: "Finish external call",
    action: "Finish external call",
  },
  {
    name: "Hide External Call",
    value: "externalCallHide",
    description: "Hide external call",
    action: "Hide external call",
  },
  {
    name: "Show External Call",
    value: "externalCallShow",
    description: "Show external call",
    action: "Show external call",
  },
  {
    name: "Search CRM Entities",
    value: "externalCallSearchCrm",
    description: "Search CRM entities by phone",
    action: "Search CRM entities",
  },
  {
    name: "Attach Call Record",
    value: "externalCallAttachRecord",
    description: "Attach record to call",
    action: "Attach call record",
  },
  // External Line Operations - Confirmed endpoints
  {
    name: "Get External Line",
    value: "externalLineGet",
    description: "Get external line info",
    action: "Get external line",
  },
  {
    name: "Add External Line",
    value: "externalLineAdd",
    description: "Add external line",
    action: "Add external line",
  },
  {
    name: "Update External Line",
    value: "externalLineUpdate",
    description: "Update external line",
    action: "Update external line",
  },
  {
    name: "Delete External Line",
    value: "externalLineDelete",
    description: "Delete external line",
    action: "Delete external line",
  },
  // Voximplant Operations - Confirmed endpoints
  {
    name: "Get Voximplant Statistics",
    value: "voximplantStatistics",
    description: "Get Voximplant statistics",
    action: "Get Voximplant statistics",
  },
  {
    name: "Get Voximplant Line",
    value: "voximplantLineGet",
    description: "Get Voximplant line",
    action: "Get Voximplant line",
  },
  {
    name: "Get Voximplant SIP Connector",
    value: "voximplantSipConnectorGet",
    description: "Get SIP connector status",
    action: "Get SIP connector status",
  },
  {
    name: "Get Voximplant SIP Line",
    value: "voximplantSipLineGet",
    description: "Get SIP line info",
    action: "Get SIP line",
  },
  {
    name: "Add Voximplant SIP Line",
    value: "voximplantSipLineAdd",
    description: "Add SIP line",
    action: "Add SIP line",
  },
  {
    name: "Update Voximplant SIP Line",
    value: "voximplantSipLineUpdate",
    description: "Update SIP line",
    action: "Update SIP line",
  },
  {
    name: "Delete Voximplant SIP Line",
    value: "voximplantSipLineDelete",
    description: "Delete SIP line",
    action: "Delete SIP line",
  },
];

// Export fields
export const telephonyFields: INodeProperties[] = [
  operationField,
  phoneNumberField,
  callIdField,
  userIdField,
  callTypeField,
  lineNumberField,
  lineIdField,
  lineNameField,
  lineNumberAddField,
  recordUrlField,
  fileNameField,
  dateFromField,
  dateToField,
  sipServerField,
  sipLoginField,
  sipPasswordField,
  optionsCollection,
];

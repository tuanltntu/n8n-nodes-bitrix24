import { INodeProperties } from "n8n-workflow";

/**
 * Automation Description - Updated to match AutomationResourceHandler operations
 */

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "createRule",
  displayOptions: {
    show: {
      resource: ["automation"],
    },
  },
  options: [
    {
      name: "Create Rule",
      value: "createRule",
      description: "Create an automation rule (bizproc.automation.rule.add)",
      action: "Create an automation rule",
    },
    {
      name: "Update Rule",
      value: "updateRule",
      description: "Update an automation rule (bizproc.automation.rule.update)",
      action: "Update an automation rule",
    },
    {
      name: "Delete Rule",
      value: "deleteRule",
      description: "Delete an automation rule (bizproc.automation.rule.delete)",
      action: "Delete an automation rule",
    },
    {
      name: "Get Rule",
      value: "getRule",
      description:
        "Get automation rule information (bizproc.automation.rule.get)",
      action: "Get automation rule information",
    },
    {
      name: "Get All Rules",
      value: "getAllRules",
      description: "Get all automation rules (bizproc.automation.rule.list)",
      action: "Get all automation rules",
    },
  ],
};

export const basicFields: INodeProperties[] = [
  /* Common Fields */
  {
    displayName: "Code",
    name: "ruleId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["getRule", "deleteRule", "updateRule"],
      },
    },
    description: "ID of the automation rule",
  },

  /* Document Type Field - Required for all operations except delete */
  {
    displayName: "Document Type",
    name: "documentType",
    type: "options",
    typeOptions: {
      loadOptionsMethod: "getDynamicTypes",
    },
    required: false,
    default: "crm_deal",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule", "getAllRules", "getRule"],
      },
    },
    description: "Type of document to which the automation rule applies",
  },

  /* SPA Placement field - shown only when Document Type is SPA */
  {
    displayName: "Smart Process",
    name: "spaPlacement",
    type: "options",
    typeOptions: {
      loadOptionsMethod: "getSpaPlacementOptions",
    },
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule", "getAllRules", "getRule"],
        documentType: ["spa_placement"],
      },
    },
    description: "Select a Smart Process with automation enabled",
  },

  /* Create/Update Operation */
  {
    displayName: "Code",
    name: "code",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description:
      "Internal identifier of the Automation rule. Must be unique within the application.",
    placeholder: "my_rule_code",
    hint: "Allowed characters: a-z, A-Z, 0-9, dot, hyphen, and underscore",
  },
  {
    displayName: "Handler URL",
    name: "handler",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description:
      "URL to which the Automation rule will send data via the Bitrix24 queue server",
    placeholder: "https://yourdomain.com/webhook/handler",
    hint: "The link must have the same domain as where the application is installed",
  },
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description: "Name of the Automation rule",
    placeholder: "My Automation Rule",
  },
  {
    displayName: "Localized Names",
    name: "useLocalizedNames",
    type: "boolean",
    default: false,
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description: "Whether to use localized names for different languages",
  },
  {
    displayName: "Localized Names",
    name: "localizedNames",
    placeholder: "Add Localized Names",
    type: "fixedCollection",
    default: {},
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
        useLocalizedNames: [true],
      },
    },
    options: [
      {
        name: "names",
        displayName: "Names",
        values: [
          {
            displayName: "Language Code",
            name: "langCode",
            type: "string",
            default: "en",
            description: "Language code (e.g., en, de, fr, ru)",
          },
          {
            displayName: "Name",
            name: "name",
            type: "string",
            default: "",
            description: "Name in the specified language",
          },
        ],
      },
    ],
    description: "Localized names for different languages",
  },
  {
    displayName: "Description",
    name: "description",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description: "Description of the Automation rule",
    placeholder: "This rule handles...",
  },
  {
    displayName: "Localized Descriptions",
    name: "useLocalizedDescriptions",
    type: "boolean",
    default: false,
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description:
      "Whether to use localized descriptions for different languages",
  },
  {
    displayName: "Localized Descriptions",
    name: "localizedDescriptions",
    placeholder: "Add Localized Descriptions",
    type: "fixedCollection",
    default: {},
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
        useLocalizedDescriptions: [true],
      },
    },
    options: [
      {
        name: "descriptions",
        displayName: "Descriptions",
        values: [
          {
            displayName: "Language Code",
            name: "langCode",
            type: "string",
            default: "en",
            description: "Language code (e.g., en, de, fr, ru)",
          },
          {
            displayName: "Description",
            name: "description",
            type: "string",
            default: "",
            description: "Description in the specified language",
          },
        ],
      },
    ],
    description: "Localized descriptions for different languages",
  },
  {
    displayName: "Auth User ID",
    name: "authUserId",
    type: "number",
    default: 1,
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description:
      "Identifier of the user whose token will be passed to the application",
    placeholder: "1",
  },
  {
    displayName: "Sync Rule",
    name: "syncRule",
    type: "boolean",
    default: false,
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description:
      "Whether the Automation rule should wait for a response from the application",
  },

  /* Properties as Add Field format */
  {
    displayName: "Common Properties",
    name: "commonProperties",
    type: "collection",
    default: {},
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    options: [
      {
        displayName: "Placement",
        name: "PLACEMENT",
        type: "options",
        options: [
          { name: "Trigger List", value: "TRIGGER_LIST" },
          { name: "Details Card", value: "DETAIL_CARD" },
          { name: "Activity Panel", value: "ACTIVITY_PANEL" },
        ],
        default: "TRIGGER_LIST",
        description:
          "Where the automation rule should be displayed in the interface",
      },
      {
        displayName: "Status IDs",
        name: "STATUS_ID",
        type: "multiOptions",
        typeOptions: {
          multipleValues: true,
        },
        options: [
          { name: "New", value: "NEW" },
          { name: "In Progress", value: "IN_PROGRESS" },
          { name: "Completed", value: "COMPLETED" },
          { name: "Pending", value: "PENDING" },
          { name: "In Process", value: "PROCESS" },
          { name: "Failed", value: "FAILED" },
        ],
        default: [],
        description:
          "Status IDs that trigger the automation (used with ON_STATUS event type)",
      },
      {
        displayName: "Current Status",
        name: "DOCUMENT_STATUS",
        type: "options",
        options: [
          { name: "New", value: "NEW" },
          { name: "In Progress", value: "IN_PROGRESS" },
          { name: "Completed", value: "COMPLETED" },
          { name: "Pending", value: "PENDING" },
          { name: "In Process", value: "PROCESS" },
          { name: "Failed", value: "FAILED" },
        ],
        default: "NEW",
        description: "Current status of the document for status-based rules",
      },
      {
        displayName: "Trigger Order",
        name: "TRIGGER_ORDER",
        type: "number",
        default: 100,
        description:
          "Execution order of the trigger (lower numbers execute first)",
      },
      {
        displayName: "Icon Type",
        name: "ICON_TYPE",
        type: "options",
        options: [
          { name: "Standard", value: "STANDARD" },
          { name: "Custom", value: "CUSTOM" },
        ],
        default: "STANDARD",
        description: "Type of icon to use for the automation rule",
      },
      {
        displayName: "Icon File URL",
        name: "ICON_FILE",
        type: "string",
        displayOptions: {
          show: {
            ICON_TYPE: ["CUSTOM"],
          },
        },
        default: "",
        description: "URL to the custom icon file (used with ICON_TYPE=CUSTOM)",
      },
      {
        displayName: "Icon",
        name: "ICON",
        type: "options",
        options: [
          { name: "Default", value: "default" },
          { name: "Robot", value: "robot" },
          { name: "Code", value: "code" },
          { name: "Automation", value: "automation" },
          { name: "Integration", value: "integration" },
          { name: "Mail", value: "mail" },
          { name: "Calendar", value: "calendar" },
          { name: "Task", value: "task" },
        ],
        displayOptions: {
          show: {
            ICON_TYPE: ["STANDARD"],
          },
        },
        default: "default",
        description: "Predefined icon to use (used with ICON_TYPE=STANDARD)",
      },
      {
        displayName: "Sync",
        name: "SYNC",
        type: "boolean",
        default: false,
        description: "Whether the automation should sync with external systems",
      },
      {
        displayName: "Template ID",
        name: "TEMPLATE_ID",
        type: "string",
        default: "",
        description: "ID of the template to associate with this automation",
      },
    ],
    description: "Common properties for the automation rule",
  },

  /* Custom properties as Add Field format */
  {
    displayName: "Custom Properties",
    name: "propertiesCollection",
    type: "fixedCollection",
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    options: [
      {
        name: "properties",
        displayName: "Custom Property",
        values: [
          {
            displayName: "Property Name",
            name: "name",
            type: "string",
            required: true,
            default: "",
            description:
              "Name of the custom property (e.g., CUSTOM_FIELD, MY_PARAMETER)",
          },
          {
            displayName: "Property Type",
            name: "type",
            type: "options",
            options: [
              {
                name: "String",
                value: "string",
              },
              {
                name: "Number",
                value: "number",
              },
              {
                name: "Boolean",
                value: "boolean",
              },
              {
                name: "Array",
                value: "array",
              },
              {
                name: "Object",
                value: "object",
              },
            ],
            default: "string",
            description: "Type of the property value",
          },
          {
            displayName: "String Value",
            name: "stringValue",
            type: "string",
            displayOptions: {
              show: {
                type: ["string"],
              },
            },
            default: "",
            description: "String value of the property",
          },
          {
            displayName: "Number Value",
            name: "numberValue",
            type: "number",
            displayOptions: {
              show: {
                type: ["number"],
              },
            },
            default: 0,
            description: "Number value of the property",
          },
          {
            displayName: "Boolean Value",
            name: "booleanValue",
            type: "boolean",
            displayOptions: {
              show: {
                type: ["boolean"],
              },
            },
            default: false,
            description: "Boolean value of the property",
          },
          {
            displayName: "Array or Object Value",
            name: "complexValue",
            type: "json",
            displayOptions: {
              show: {
                type: ["array", "object"],
              },
            },
            default: "",
            description: "Array or object value as JSON",
          },
        ],
      },
    ],
    description: "Additional custom properties for the automation rule",
  },

  /* Keep the original properties field for backward compatibility */
  {
    displayName: "Use JSON for Properties",
    name: "useJsonProperties",
    type: "boolean",
    default: false,
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
      },
    },
    description:
      "Whether to set properties as a JSON object instead of individual fields",
  },
  {
    displayName: "Properties JSON",
    name: "properties",
    type: "json",
    default: "",
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["createRule", "updateRule"],
        useJsonProperties: [true],
      },
    },
    description: "Additional properties for the automation rule as JSON",
    placeholder:
      '{\n  "PLACEMENT": "TRIGGER_LIST",\n  "STATUS_ID": ["NEW", "IN_PROGRESS"]\n}',
  },

  /* Options for Get All Operation */
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["automation"],
        operation: ["getAllRules"],
      },
    },
    options: [
      {
        displayName: "Access Token",
        name: "accessToken",
        type: "string",
        default: "",
        placeholder: "Enter the access token to use instead of credentials.",
        description:
          "Access token to use for API requests. If provided, will take priority over token in credentials.",
      },
      {
        displayName: "Filter",
        name: "filter",
        type: "json",
        default: "",
        description: "Filter to apply to the query",
        placeholder: '{ "PROPERTY_VALUE": "yes" }',
      },
      {
        displayName: "Order",
        name: "order",
        type: "json",
        default: "",
        description: "Sort order for the results",
        placeholder: '{ "ID": "ASC" }',
      },
    ],
  },
];

// Export operations
export const automationOperations = [
  {
    name: "Create Rule",
    value: "createRule",
    description: "Create an automation rule (bizproc.automation.rule.add)",
    action: "Create an automation rule",
  },
  {
    name: "Update Rule",
    value: "updateRule",
    description: "Update an automation rule (bizproc.automation.rule.update)",
    action: "Update an automation rule",
  },
  {
    name: "Delete Rule",
    value: "deleteRule",
    description: "Delete an automation rule (bizproc.automation.rule.delete)",
    action: "Delete an automation rule",
  },
  {
    name: "Get Rule",
    value: "getRule",
    description:
      "Get automation rule information (bizproc.automation.rule.get)",
    action: "Get automation rule information",
  },
  {
    name: "Get All Rules",
    value: "getAllRules",
    description: "Get all automation rules (bizproc.automation.rule.list)",
    action: "Get all automation rules",
  },
];

export const automationFields: INodeProperties[] = [
  operationField,
  ...basicFields,
];

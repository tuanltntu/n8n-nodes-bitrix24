import { INodeProperties } from "n8n-workflow";

/**
 * User Field Config Description - Complete with operations and all fields
 */

export const userFieldConfigFields: INodeProperties[] = [
  // Operation field - MUST be first for n8n to show operations
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
      },
    },
    options: [
      {
        name: "Add",
        value: "add",
        description: "Create a new user field configuration",
        action: "Add a user field configuration",
      },
      {
        name: "Add Multiple",
        value: "addMultiple",
        description: "Create multiple user field configurations at once",
        action: "Add multiple user field configurations",
      },
      {
        name: "Delete",
        value: "delete",
        description: "Delete a user field configuration",
        action: "Delete a user field configuration",
      },
      {
        name: "Get",
        value: "get",
        description: "Retrieve a user field configuration",
        action: "Get a user field configuration",
      },
      {
        name: "Get List",
        value: "getList",
        description: "Get a list of user field configurations",
        action: "Get a list of user field configurations",
      },
      {
        name: "Update",
        value: "update",
        description: "Update a user field configuration",
        action: "Update a user field configuration",
      },
    ],
    default: "addMultiple",
  },

  // ID field for get, delete, update operations
  {
    displayName: "ID",
    name: "id",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the user field configuration",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["get", "update", "delete"],
      },
    },
  },

  // Add Entity ID field for delete operation
  {
    displayName: "Entity ID",
    name: "entityId",
    type: "string",
    required: true,
    default: "",
    description:
      "Entity ID (e.g., DEAL, LEAD, CONTACT, CRM_7 for Smart Process). For Smart Process use CRM_[ID] format.",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["delete"],
      },
    },
  },

  // Add Entity ID field for get operation
  {
    displayName: "Entity ID",
    name: "entityId",
    type: "string",
    required: false,
    default: "CRM",
    description:
      "Entity ID (e.g., DEAL, LEAD, CONTACT, CRM_7 for Smart Process). For Smart Process use CRM_[ID] format.",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["get"],
      },
    },
  },

  // Use Structure Builder Field
  {
    displayName: "Use Structure Builder",
    name: "useStructureBuilder",
    type: "boolean",
    default: true,
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add", "addMultiple"],
      },
    },
    description:
      "Use UI builder for field configuration or input JSON directly",
  },

  // Entity Type Field
  {
    displayName: "Entity Type",
    name: "entityType",
    type: "options",
    required: true,
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [true],
      },
    },
    options: [
      { name: "Deal", value: "DEAL" },
      { name: "Lead", value: "LEAD" },
      { name: "Contact", value: "CONTACT" },
      { name: "Company", value: "COMPANY" },
      { name: "Quote", value: "QUOTE" },
      { name: "Smart Process", value: "DYNAMIC_ENTITY" },
      { name: "Custom", value: "CUSTOM" },
    ],
    default: "DEAL",
    description: "Type of entity for which the user field is being configured",
  },

  // Custom Entity Type field (only shown when Custom is selected)
  {
    displayName: "Custom Entity Type",
    name: "customEntityType",
    type: "string",
    default: "",
    description: "Custom entity type if 'Custom' is selected as entity type",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [true],
        entityType: ["CUSTOM"],
      },
    },
  },

  // Smart Process Type field (only shown when Smart Process is selected)
  {
    displayName: "Smart Process Type",
    name: "smartProcessType",
    type: "options",
    typeOptions: {
      loadOptionsMethod: "getUserFieldSmartProcessTypes",
    },
    default: "",
    required: true,
    description:
      "Select the Smart Process type. The ID number shown will be used in the field name format (UF_CRM_[ID]_FIELDNAME)",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [true],
        entityType: ["DYNAMIC_ENTITY"],
      },
    },
  },

  // Field Name Field (keeping only this one)
  {
    displayName: "Field Name",
    name: "fieldName",
    type: "string",
    required: true,
    default: "",
    placeholder: "CUSTOM_FIELD",
    description: "Name of the field (prefix will be added automatically)",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [true],
      },
    },
  },

  // Field Type Field
  {
    displayName: "Field Type",
    name: "fieldType",
    type: "options",
    required: true,
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [true],
      },
    },
    options: [
      { name: "String", value: "string" },
      { name: "Integer", value: "integer" },
      { name: "Double", value: "double" },
      { name: "Date", value: "date" },
      { name: "DateTime", value: "datetime" },
      { name: "Boolean", value: "boolean" },
      { name: "Enumeration", value: "enumeration" },
      { name: "File", value: "file" },
      { name: "Employee", value: "employee" },
      { name: "CRM Status", value: "crm_status" },
    ],
    default: "string",
    description: "Type of the user field",
  },

  // Field Label Field
  {
    displayName: "Field Label",
    name: "fieldLabel",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [true],
      },
    },
  },

  // Field Settings for simplified configuration
  {
    displayName: "Field Settings",
    name: "fieldSettings",
    type: "collection",
    placeholder: "Add Setting",
    default: {},
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [true],
      },
    },
    options: [
      {
        displayName: "Required",
        name: "required",
        type: "boolean",
        default: false,
        description: "Whether the field is required",
      },
      {
        displayName: "Multiple",
        name: "multiple",
        type: "boolean",
        default: false,
        description: "Whether the field allows multiple values",
      },
      {
        displayName: "Show Filter",
        name: "showFilter",
        type: "options",
        options: [
          { name: "None", value: "N" },
          { name: "Exact Match", value: "E" },
          { name: "Pattern Search", value: "I" },
        ],
        default: "N",
        description: "Show filter options",
      },
      {
        displayName: "Show in List",
        name: "showInList",
        type: "boolean",
        default: false,
        description: "Show field in list view",
      },
      {
        displayName: "Edit in List",
        name: "editInList",
        type: "boolean",
        default: false,
        description: "Allow editing in list view",
      },
      {
        displayName: "List Items",
        name: "listItems",
        type: "json",
        default: "{}",
        description: "Items for enumeration fields in JSON format",
      },
    ],
  },

  // Direct JSON approach for advanced users
  {
    displayName: "Fields (JSON)",
    name: "fields",
    type: "json",
    default:
      '{\n  "ENTITY_ID": "CRM_LEAD",\n  "FIELD_NAME": "UF_CRM_CUSTOM_FIELD",\n  "USER_TYPE_ID": "string",\n  "EDIT_FORM_LABEL": "My Custom Field"\n}',
    required: true,
    description:
      "User field configuration in JSON format. Review the Bitrix24 API docs for all available fields.",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["add"],
        useStructureBuilder: [false],
      },
    },
  },

  /* -------------------------------------------------------------------------- */
  /*                         Add Multiple Operation                             */
  /* -------------------------------------------------------------------------- */
  {
    displayName: "Entity Type",
    name: "multipleEntityType",
    type: "options",
    options: [
      { name: "Deal", value: "DEAL" },
      { name: "Lead", value: "LEAD" },
      { name: "Contact", value: "CONTACT" },
      { name: "Company", value: "COMPANY" },
      { name: "Quote", value: "QUOTE" },
      { name: "Smart Process", value: "DYNAMIC_ENTITY" },
      { name: "Custom", value: "CUSTOM" },
    ],
    default: "DEAL",
    required: true,
    description: "Type of entity for which the fields will be configured",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["addMultiple"],
      },
    },
  },

  // Custom Entity Type field (only shown when Custom is selected)
  {
    displayName: "Custom Entity Type",
    name: "multipleCustomEntityType",
    type: "string",
    default: "",
    description: "Custom entity type if 'Custom' is selected as entity type",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["addMultiple"],
        multipleEntityType: ["CUSTOM"],
      },
    },
  },

  // Smart Process Type field for multiple operation
  {
    displayName: "Smart Process Type",
    name: "multipleSmartProcessType",
    type: "options",
    typeOptions: {
      loadOptionsMethod: "getUserFieldSmartProcessTypes",
    },
    default: "",
    required: true,
    description:
      "Select the Smart Process type. The ID number shown will be used in the field name format (UF_CRM_[ID]_FIELDNAME)",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["addMultiple"],
        multipleEntityType: ["DYNAMIC_ENTITY"],
      },
    },
  },

  // Multiple Field Definitions
  {
    displayName: "Field Definitions",
    name: "fieldDefinitions",
    type: "fixedCollection",
    typeOptions: {
      multipleValues: true,
      sortable: true,
    },
    default: {},
    placeholder: "Add Field Definition",
    description: "Define multiple fields to create",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["addMultiple"],
      },
    },
    options: [
      {
        name: "fields",
        displayName: "Fields",
        values: [
          {
            displayName: "Field Type",
            name: "USER_TYPE_ID",
            type: "options",
            options: [
              { name: "String", value: "string" },
              { name: "Integer", value: "integer" },
              { name: "Double", value: "double" },
              { name: "Boolean", value: "boolean" },
              { name: "Date", value: "date" },
              { name: "DateTime", value: "datetime" },
              { name: "Enumeration", value: "enumeration" },
              { name: "File", value: "file" },
              { name: "Employee", value: "employee" },
              { name: "Money", value: "money" },
              { name: "URL", value: "url" },
              { name: "Address", value: "address" },
              { name: "Resource Booking", value: "resourcebooking" },
              { name: "CRM Entity", value: "crm_entity" },
              { name: "CRM Status", value: "crm_status" },
              { name: "CRM Category", value: "crm_category" },
              { name: "HTML", value: "html" },
            ],
            default: "string",
            required: true,
            description: "Type of field to create",
          },
          {
            displayName: "Field Name",
            name: "FIELD_NAME",
            type: "string",
            default: "",
            required: true,
            placeholder: "CUSTOM_FIELD",
            description:
              "Name of the field (Latin letters, numbers, and underscores only). The appropriate prefix will be added automatically.",
          },
          {
            displayName: "Label",
            name: "EDIT_FORM_LABEL",
            type: "string",
            default: "",
            required: true,
            description: "User-friendly label for the field",
          },
          {
            displayName: "Multiple Values",
            name: "MULTIPLE",
            type: "boolean",
            default: false,
            description: "Whether the field can have multiple values",
          },
          {
            displayName: "Mandatory",
            name: "MANDATORY",
            type: "boolean",
            default: false,
            description: "Whether the field is required",
          },
          {
            displayName: "Filterable",
            name: "SHOW_FILTER",
            type: "boolean",
            default: false,
            description: "Whether the field can be used in filters",
          },
          {
            displayName: "Searchable",
            name: "IS_SEARCHABLE",
            type: "boolean",
            default: false,
            description: "Whether the field is searchable",
          },
          {
            displayName: "Default Value",
            name: "DEFAULT_VALUE",
            type: "string",
            default: "",
            description: "Default value for the field",
          },
          {
            displayName: "Additional Settings (JSON)",
            name: "additionalSettings",
            type: "json",
            default: "{}",
            description: "Additional settings for the field in JSON format",
          },
        ],
      },
    ],
  },

  // Get List operation fields
  {
    displayName: "Filter",
    name: "filter",
    type: "string",
    default: "{}",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["getList"],
      },
    },
    description: "Filter criteria in JSON format",
  },
  {
    displayName: "Order",
    name: "order",
    type: "string",
    default: "{}",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["getList"],
      },
    },
    description: "Sort order in JSON format",
  },
  {
    displayName: "Select",
    name: "select",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["getList"],
      },
    },
    description: "Fields to select (comma-separated)",
  },
  {
    displayName: "Start",
    name: "start",
    type: "number",
    default: 0,
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["getList"],
      },
    },
    description: "Offset for pagination",
  },

  // Update operation fields
  {
    displayName: "Update Fields",
    name: "updateFields",
    type: "collection",
    placeholder: "Add Field to Update",
    default: {},
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
        operation: ["update"],
      },
    },
    options: [
      {
        displayName: "Fields",
        name: "fields",
        type: "fixedCollection",
        default: {},
        options: [
          {
            name: "field",
            displayName: "Field",
            values: [
              {
                displayName: "Field Name",
                name: "name",
                type: "string",
                default: "",
                description: "Name of the field to update",
              },
              {
                displayName: "Value",
                name: "value",
                type: "string",
                default: "",
                description: "New value for the field",
              },
              {
                displayName: "Is Boolean",
                name: "isBoolean",
                type: "boolean",
                default: false,
                description: "Whether this field is a boolean value",
              },
              {
                displayName: "Boolean Value",
                name: "boolValue",
                type: "boolean",
                default: false,
                displayOptions: {
                  show: {
                    isBoolean: [true],
                  },
                },
                description: "Boolean value when field is boolean type",
              },
            ],
          },
        ],
      },
    ],
  },

  // Options collection
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["userFieldConfig"],
      },
    },
    options: [
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

import { INodeProperties } from "n8n-workflow";

/**
 * User Field Config Description - CLEAN VERSION without circular dependencies
 */

// Config ID Field
const configIdField: INodeProperties = {
  displayName: "Config ID",
  name: "configId",
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
};

// Use Structure Builder Field
const useStructureBuilderField: INodeProperties = {
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
  description: "Use UI builder for field configuration or input JSON directly",
};

// Entity Type Field
const entityTypeField: INodeProperties = {
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
    { name: "CRM Lead", value: "CRM_LEAD" },
    { name: "CRM Deal", value: "CRM_DEAL" },
    { name: "CRM Contact", value: "CRM_CONTACT" },
    { name: "CRM Company", value: "CRM_COMPANY" },
    { name: "Task", value: "TASKS_TASK" },
    { name: "User", value: "USER" },
    { name: "Calendar Event", value: "CALENDAR_EVENT" },
  ],
  default: "CRM_LEAD",
  description: "Type of entity for the configuration",
};

// Field Code Field
const fieldCodeField: INodeProperties = {
  displayName: "Field Code",
  name: "fieldCode",
  type: "string",
  required: true,
  default: "",
  description: "Code of the user field",
  displayOptions: {
    show: {
      resource: ["userFieldConfig"],
      operation: ["add"],
      useStructureBuilder: [true],
    },
  },
};

// Field Name Field
const fieldNameField: INodeProperties = {
  displayName: "Field Name",
  name: "fieldName",
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
};

// Field Type Field
const fieldTypeField: INodeProperties = {
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
};

// Field Label Field
const fieldLabelField: INodeProperties = {
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
};

// Add operation fields
const addFields: INodeProperties[] = [
  useStructureBuilderField,
  entityTypeField,
  fieldNameField,
  fieldTypeField,
  fieldLabelField,
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
];

// ID field for get, delete operations
const idField: INodeProperties = {
  displayName: "Field ID",
  name: "id",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["userFieldConfig"],
      operation: ["get", "delete", "update"],
    },
  },
  description: "ID of the user field configuration",
};

// Entity ID field for delete operation
const entityIdField: INodeProperties = {
  displayName: "Entity ID",
  name: "entityId",
  type: "string",
  required: true,
  default: "CRM",
  displayOptions: {
    show: {
      resource: ["userFieldConfig"],
      operation: ["delete", "get"],
    },
  },
  description: "Entity ID for the field configuration",
};

// Get List operation fields
const getListFields: INodeProperties[] = [
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
];

// Update operation fields
const updateFields: INodeProperties[] = [
  idField,
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
];

// Options collection
const optionsCollection: INodeProperties = {
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
};

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "add",
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
      action: "Create a user field configuration",
    },
    {
      name: "Add Multiple",
      value: "addMultiple",
      description: "Create multiple user field configurations",
      action: "Create multiple user field configurations",
    },
    {
      name: "Get",
      value: "get",
      description: "Get user field configuration",
      action: "Get user field configuration",
    },
    {
      name: "Get List",
      value: "getList",
      description: "Get all user field configurations",
      action: "Get all user field configurations",
    },
    {
      name: "Update",
      value: "update",
      description: "Update user field configuration",
      action: "Update user field configuration",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete user field configuration",
      action: "Delete user field configuration",
    },
  ],
};

export const userFieldConfigFields: INodeProperties[] = [
  operationField,
  ...addFields,
  idField,
  entityIdField,
  ...updateFields,
  ...getListFields,
  optionsCollection,
];

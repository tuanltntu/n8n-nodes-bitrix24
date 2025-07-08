import { INodeProperties } from "n8n-workflow";

/**
 * Lists Description - Updated to match ListsResourceHandler operations
 */

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "get",
  displayOptions: {
    show: {
      resource: ["lists"],
    },
  },
  options: [
    // List operations
    {
      name: "Add",
      value: "add",
      description: "Add a new list (lists.add)",
      action: "Add a new list",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a list (lists.delete)",
      action: "Delete a list",
    },
    {
      name: "Get",
      value: "get",
      description: "Get a list (lists.get)",
      action: "Get a list",
    },
    {
      name: "Update",
      value: "update",
      description: "Update a list (lists.update)",
      action: "Update a list",
    },
    {
      name: "Get Iblock Type ID",
      value: "getIblockTypeId",
      description: "Get iblock type ID (lists.iblock.type.get)",
      action: "Get iblock type ID",
    },
    // Field operations
    {
      name: "Add Field",
      value: "addField",
      description: "Add a field to list (lists.field.add)",
      action: "Add a field to list",
    },
    {
      name: "Delete Field",
      value: "deleteField",
      description: "Delete a field from list (lists.field.delete)",
      action: "Delete a field from list",
    },
    {
      name: "Get Fields",
      value: "getFields",
      description: "Get list fields (lists.field.get)",
      action: "Get list fields",
    },
    {
      name: "Get Field Types",
      value: "getFieldTypes",
      description: "Get available field types (lists.field.type.get)",
      action: "Get available field types",
    },
    {
      name: "Update Field",
      value: "updateField",
      description: "Update a list field (lists.field.update)",
      action: "Update a list field",
    },
    // Element operations
    {
      name: "Get Element Fields",
      value: "getElementFields",
      description: "Get element fields (lists.element.fields)",
      action: "Get element fields",
    },
    {
      name: "Get Elements",
      value: "getElements",
      description: "Get list elements (lists.element.get)",
      action: "Get list elements",
    },
    {
      name: "Get Element",
      value: "getElement",
      description: "Get a list element (lists.element.get)",
      action: "Get a list element",
    },
    {
      name: "Add Element",
      value: "addElement",
      description: "Add element to list (lists.element.add)",
      action: "Add element to list",
    },
    {
      name: "Update Element",
      value: "updateElement",
      description: "Update list element (lists.element.update)",
      action: "Update list element",
    },
    {
      name: "Delete Element",
      value: "deleteElement",
      description: "Delete list element (lists.element.delete)",
      action: "Delete list element",
    },
    {
      name: "Get Element File URL",
      value: "getElementFileUrl",
      description: "Get element file URL (lists.element.file.get)",
      action: "Get element file URL",
    },
    {
      name: "Get Section Element",
      value: "getSectionElement",
      description: "Get section element (lists.section.element.get)",
      action: "Get section element",
    },
    {
      name: "Get Element File",
      value: "getElementFile",
      description: "Get element file (lists.element.file.get)",
      action: "Get element file",
    },
    // Section operations
    {
      name: "Get Sections",
      value: "getSections",
      description: "Get list sections (lists.section.get)",
      action: "Get list sections",
    },
    {
      name: "Add Section",
      value: "addSection",
      description: "Add a section to list (lists.section.add)",
      action: "Add a section to list",
    },
    {
      name: "Get Section",
      value: "getSection",
      description: "Get a list section (lists.section.get)",
      action: "Get a list section",
    },
    {
      name: "Update Section",
      value: "updateSection",
      description: "Update list section (lists.section.update)",
      action: "Update list section",
    },
    {
      name: "Delete Section",
      value: "deleteSection",
      description: "Delete list section (lists.section.delete)",
      action: "Delete list section",
    },
  ],
};

// Required fields based on operations
const iblockTypeIdField: INodeProperties = {
  displayName: "Iblock Type ID",
  name: "IBLOCK_TYPE_ID",
  type: "string",
  required: true,
  default: "",
  description: "ID of the iblock type",
  displayOptions: {
    show: {
      resource: ["lists"],
      operation: ["add"],
    },
  },
};

const iblockCodeField: INodeProperties = {
  displayName: "Iblock Code",
  name: "IBLOCK_CODE",
  type: "string",
  required: true,
  default: "",
  description: "Code of the iblock",
  displayOptions: {
    show: {
      resource: ["lists"],
      operation: ["add"],
    },
  },
};

const listIdField: INodeProperties = {
  displayName: "List ID",
  name: "IBLOCK_ID",
  type: "string",
  required: true,
  default: "",
  description: "ID of the list",
  displayOptions: {
    show: {
      resource: ["lists"],
      operation: [
        "get",
        "update",
        "delete",
        "addField",
        "deleteField",
        "getFields",
        "updateField",
        "getElementFields",
        "getElements",
        "getElement",
        "addElement",
        "updateElement",
        "deleteElement",
        "getElementFileUrl",
        "getSectionElement",
        "getElementFile",
        "getSections",
        "addSection",
        "getSection",
        "updateSection",
        "deleteSection",
      ],
    },
  },
};

const elementIdField: INodeProperties = {
  displayName: "Element ID",
  name: "ELEMENT_ID",
  type: "string",
  required: true,
  default: "",
  description: "ID of the element",
  displayOptions: {
    show: {
      resource: ["lists"],
      operation: [
        "getElement",
        "updateElement",
        "deleteElement",
        "getElementFileUrl",
        "getElementFile",
      ],
    },
  },
};

const fieldIdField: INodeProperties = {
  displayName: "Field ID",
  name: "FIELD_ID",
  type: "string",
  required: true,
  default: "",
  description: "ID of the field",
  displayOptions: {
    show: {
      resource: ["lists"],
      operation: ["deleteField", "updateField"],
    },
  },
};

const sectionIdField: INodeProperties = {
  displayName: "Section ID",
  name: "SECTION_ID",
  type: "string",
  required: true,
  default: "",
  description: "ID of the section",
  displayOptions: {
    show: {
      resource: ["lists"],
      operation: [
        "getSection",
        "updateSection",
        "deleteSection",
        "getSectionElement",
      ],
    },
  },
};

const fieldsUiField: INodeProperties = {
  displayName: "Fields",
  name: "fieldsUi",
  type: "fixedCollection",
  default: { fieldsValues: [] },
  description: "Fields to set",
  displayOptions: {
    show: {
      resource: ["lists"],
      operation: [
        "add",
        "update",
        "addField",
        "updateField",
        "addElement",
        "updateElement",
        "addSection",
        "updateSection",
      ],
    },
  },
  typeOptions: {
    multipleValues: true,
  },
  options: [
    {
      name: "fieldsValues",
      displayName: "Field",
      values: [
        {
          displayName: "Field Name",
          name: "fieldName",
          type: "string",
          default: "",
          description: "Name of the field",
        },
        {
          displayName: "Field Value",
          name: "fieldValue",
          type: "string",
          default: "",
          description: "Value of the field",
        },
      ],
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
      resource: ["lists"],
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
      displayName: "Select",
      name: "select",
      type: "string",
      default: "",
      description: "Comma-separated list of fields to select",
    },
  ],
};

// Export operations
export const listsOperations = [
  // List Operations
  {
    name: "Add",
    value: "add",
    description: "Create a new list (lists.add)",
    action: "Create a new list",
  },
  {
    name: "Delete",
    value: "delete",
    description: "Delete a list (lists.delete)",
    action: "Delete a list",
  },
  {
    name: "Get",
    value: "get",
    description: "Get list information (lists.get)",
    action: "Get list information",
  },
  {
    name: "Update",
    value: "update",
    description: "Update a list (lists.update)",
    action: "Update a list",
  },
  {
    name: "Get Iblock Type ID",
    value: "getIblockTypeId",
    description: "Get information block type ID (lists.iblock.type.get)",
    action: "Get information block type ID",
  },

  // Field Operations
  {
    name: "Add Field",
    value: "addField",
    description: "Add field to list (lists.field.add)",
    action: "Add field to list",
  },
  {
    name: "Delete Field",
    value: "deleteField",
    description: "Delete field from list (lists.field.delete)",
    action: "Delete field from list",
  },
  {
    name: "Get Fields",
    value: "getFields",
    description: "Get list fields (lists.field.get)",
    action: "Get list fields",
  },
  {
    name: "Get Field Types",
    value: "getFieldTypes",
    description: "Get field types (lists.field.type.get)",
    action: "Get field types",
  },
  {
    name: "Update Field",
    value: "updateField",
    description: "Update list field (lists.field.update)",
    action: "Update list field",
  },

  // Element Operations
  {
    name: "Get Element Fields",
    value: "getElementFields",
    description: "Get element fields (lists.element.fields)",
    action: "Get element fields",
  },
  {
    name: "Get Elements",
    value: "getElements",
    description: "Get list elements (lists.element.get)",
    action: "Get list elements",
  },
  {
    name: "Get Element",
    value: "getElement",
    description: "Get element information (lists.element.get)",
    action: "Get element information",
  },
  {
    name: "Add Element",
    value: "addElement",
    description: "Add element to list (lists.element.add)",
    action: "Add element to list",
  },
  {
    name: "Update Element",
    value: "updateElement",
    description: "Update list element (lists.element.update)",
    action: "Update list element",
  },
  {
    name: "Delete Element",
    value: "deleteElement",
    description: "Delete list element (lists.element.delete)",
    action: "Delete list element",
  },
  {
    name: "Get Element File URL",
    value: "getElementFileUrl",
    description: "Get element file URL (lists.element.file.get)",
    action: "Get element file URL",
  },
  {
    name: "Get Section Element",
    value: "getSectionElement",
    description: "Get section element (lists.section.element.get)",
    action: "Get section element",
  },
  {
    name: "Get Element File",
    value: "getElementFile",
    description: "Get element file (lists.element.file.get)",
    action: "Get element file",
  },

  // Section Operations
  {
    name: "Get Sections",
    value: "getSections",
    description: "Get list sections (lists.section.get)",
    action: "Get list sections",
  },
  {
    name: "Add Section",
    value: "addSection",
    description: "Add section to list (lists.section.add)",
    action: "Add section to list",
  },
  {
    name: "Get Section",
    value: "getSection",
    description: "Get section information (lists.section.get)",
    action: "Get section information",
  },
  {
    name: "Update Section",
    value: "updateSection",
    description: "Update list section (lists.section.update)",
    action: "Update list section",
  },
  {
    name: "Delete Section",
    value: "deleteSection",
    description: "Delete list section (lists.section.delete)",
    action: "Delete list section",
  },
];

export const listsFields: INodeProperties[] = [
  operationField,
  iblockTypeIdField,
  iblockCodeField,
  listIdField,
  elementIdField,
  fieldIdField,
  sectionIdField,
  fieldsUiField,
  optionsCollection,
];

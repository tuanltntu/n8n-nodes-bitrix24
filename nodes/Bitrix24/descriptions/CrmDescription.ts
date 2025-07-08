import { INodeProperties } from "n8n-workflow";

// CRM Entity types - Main CRM entities with full CRUD support
const CRM_ENTITIES = [
  { key: "contact", name: "Contact", plural: "Contacts" },
  { key: "deal", name: "Deal", plural: "Deals" },
  { key: "lead", name: "Lead", plural: "Leads" },
  { key: "company", name: "Company", plural: "Companies" },
  { key: "quote", name: "Quote", plural: "Quotes" },
  { key: "invoice", name: "Invoice", plural: "Invoices" },
  { key: "product", name: "Product", plural: "Products" },
  { key: "activity", name: "Activity", plural: "Activities" },
];

// Base operations for each entity
const BASE_OPERATIONS = [
  {
    key: "create",
    name: "Create",
    description: "Create a new {entity}",
    action: "Create a {entity}",
  },
  {
    key: "get",
    name: "Get",
    description: "Get a {entity} by ID",
    action: "Get a {entity}",
  },
  {
    key: "list",
    name: "Get All",
    description: "Get all {plural}",
    action: "Get all {plural}",
  },
  {
    key: "update",
    name: "Update",
    description: "Update a {entity}",
    action: "Update a {entity}",
  },
  {
    key: "delete",
    name: "Delete",
    description: "Delete a {entity}",
    action: "Delete a {entity}",
  },
  {
    key: "getFields",
    name: "Get Fields",
    description: "Get available fields for {entity}",
    action: "Get fields for {entity}",
  },
];

// CRM Entity Type field
const entityTypeField: INodeProperties = {
  displayName: "Entity",
  name: "entityType",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "contact",
  displayOptions: {
    show: {
      resource: ["crm"],
    },
  },
  options: CRM_ENTITIES.map((entity) => ({
    name: entity.name,
    value: entity.key,
    description: `Work with ${entity.plural.toLowerCase()}`,
  })),
};

// CRM Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "get",
  displayOptions: {
    show: {
      resource: ["crm"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create a CRM entity (crm.{entity}.add)",
      action: "Create a CRM entity",
    },
    {
      name: "Update",
      value: "update",
      description: "Update a CRM entity (crm.{entity}.update)",
      action: "Update a CRM entity",
    },
    {
      name: "Get",
      value: "get",
      description: "Get a CRM entity (crm.{entity}.get)",
      action: "Get a CRM entity",
    },
    {
      name: "Get All",
      value: "getAll",
      description: "Get all CRM entities (crm.{entity}.list)",
      action: "Get all CRM entities",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a CRM entity (crm.{entity}.delete)",
      action: "Delete a CRM entity",
    },
    {
      name: "Get Fields",
      value: "getFields",
      description: "Get available fields for CRM entity (crm.{entity}.fields)",
      action: "Get available fields for CRM entity",
    },
  ],
};

// Record ID field
const recordIdField: INodeProperties = {
  displayName: "Record ID",
  name: "recordId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the record to operate on",
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["get", "update", "delete"],
    },
  },
};

// Company ID field for contact operations
const companyIdField: INodeProperties = {
  displayName: "Company ID",
  name: "companyId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the company",
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["addToCompany", "removeFromCompany"],
    },
  },
};

// Products field for deal operations
const productsField: INodeProperties = {
  displayName: "Products",
  name: "products",
  type: "json",
  default: "[]",
  description: "Products data in JSON format for deal",
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["setProducts"],
    },
  },
};

// Dynamic Fields Collection for Create/Update operations
const dynamicFieldsCollection: INodeProperties = {
  displayName: "Fields",
  name: "fields",
  type: "fixedCollection",
  placeholder: "Add Field",
  default: { fieldItems: [] },
  description:
    "Fields to create/update. Available fields will be loaded based on the selected entity type.",
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["create", "update"],
    },
  },
  typeOptions: {
    multipleValues: true,
  },
  options: [
    {
      name: "fieldItems",
      displayName: "Field",
      values: [
        {
          displayName: "Field Name",
          name: "fieldName",
          type: "options",
          default: "",
          description: "Select the field to set",
          typeOptions: {
            loadOptionsMethod: "getCrmEntityFields",
            loadOptionsDependsOn: ["entityType"],
          },
        },
        {
          displayName: "Field Value",
          name: "fieldValue",
          type: "string",
          default: "",
          description: "Value to set for the field",
        },
      ],
    },
  ],
};

// Deal Category field for deal create operations
const dealCategoryField: INodeProperties = {
  displayName: "Deal Category",
  name: "categoryId",
  type: "options",
  default: "",
  description: "Select the deal category",
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["create"],
      entityType: ["deal"],
    },
  },
  typeOptions: {
    loadOptionsMethod: "getDealCategories",
  },
};

// Options Collection for List operations
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "crmOptions",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["getAll"],
    },
  },
  options: [
    {
      displayName: "Select",
      name: "select",
      type: "string",
      default: "",
      description:
        'Fields to return (JSON array or comma-separated). Example: ["ID","TITLE","NAME"] or ID,TITLE,NAME',
    },
    {
      displayName: "Filter",
      name: "filter",
      type: "string",
      default: "",
      description:
        'Filter criteria in JSON format. Example: {"TITLE": "Test", ">DATE_CREATE": "2023-01-01"}',
    },
    {
      displayName: "Order",
      name: "order",
      type: "string",
      default: "",
      description:
        'Sort order in JSON format. Example: {"DATE_CREATE": "DESC", "ID": "ASC"}',
    },
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      placeholder: "Enter the access token to use instead of credentials.",
      description:
        "Access token to use for API requests. If provided, will take priority over token in credentials.",
    },
  ],
};

// Special Phone Field Handler
const phoneFieldsCollection: INodeProperties = {
  displayName: "Phone Numbers",
  name: "phoneFields",
  type: "fixedCollection",
  placeholder: "Add Phone Number",
  default: { phoneItems: [] },
  description: "Phone numbers for the contact/lead/company",
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["create", "update"],
      entityType: ["contact", "lead", "company"],
    },
  },
  typeOptions: {
    multipleValues: true,
  },
  options: [
    {
      name: "phoneItems",
      displayName: "Phone Number",
      values: [
        {
          displayName: "Type",
          name: "VALUE_TYPE",
          type: "options",
          default: "WORK",
          options: [
            { name: "Work", value: "WORK" },
            { name: "Mobile", value: "MOBILE" },
            { name: "Home", value: "HOME" },
            { name: "Fax", value: "FAX" },
            { name: "Pager", value: "PAGER" },
            { name: "Other", value: "OTHER" },
          ],
          description: "Type of phone number",
        },
        {
          displayName: "Phone Number",
          name: "VALUE",
          type: "string",
          default: "",
          description: "The phone number",
          placeholder: "+1234567890",
        },
      ],
    },
  ],
};

// Special Email Field Handler
const emailFieldsCollection: INodeProperties = {
  displayName: "Email Addresses",
  name: "emailFields",
  type: "fixedCollection",
  placeholder: "Add Email Address",
  default: { emailItems: [] },
  description: "Email addresses for the contact/lead/company",
  displayOptions: {
    show: {
      resource: ["crm"],
      operation: ["create", "update"],
      entityType: ["contact", "lead", "company"],
    },
  },
  typeOptions: {
    multipleValues: true,
  },
  options: [
    {
      name: "emailItems",
      displayName: "Email Address",
      values: [
        {
          displayName: "Type",
          name: "VALUE_TYPE",
          type: "options",
          default: "WORK",
          options: [
            { name: "Work", value: "WORK" },
            { name: "Home", value: "HOME" },
            { name: "Other", value: "OTHER" },
          ],
          description: "Type of email address",
        },
        {
          displayName: "Email Address",
          name: "VALUE",
          type: "string",
          default: "",
          description: "The email address",
          placeholder: "email@example.com",
        },
      ],
    },
  ],
};

// Export fields
export const crmFields = [
  entityTypeField,
  operationField,
  recordIdField,
  dealCategoryField,
  dynamicFieldsCollection,
  optionsCollection,
  phoneFieldsCollection,
  emailFieldsCollection,
];

// Export entity mapping for use in handlers
export const CRM_ENTITY_MAPPING = CRM_ENTITIES.reduce((acc, entity) => {
  acc[entity.key] = entity;
  return acc;
}, {} as Record<string, (typeof CRM_ENTITIES)[0]>);

export const CRM_OPERATION_MAPPING = [
  "create",
  "update",
  "get",
  "getAll",
  "delete",
  "getFields",
].reduce((acc, operation) => {
  acc[operation] = operation;
  return acc;
}, {} as Record<string, string>);

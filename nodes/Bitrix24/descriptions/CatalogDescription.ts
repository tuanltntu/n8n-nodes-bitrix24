import { INodeProperties } from "n8n-workflow";

/**
 * Catalog Description - CLEAN VERSION without circular dependencies
 */

// Catalog ID Field
const catalogIdField: INodeProperties = {
  displayName: "Catalog ID",
  name: "catalogId",
  type: "string",
  required: true,
  default: "",
  description: "The ID of the catalog",
  displayOptions: {
    show: {
      resource: ["catalog"],
      operation: ["get", "update", "delete"],
    },
  },
};

// Catalog Name Field
const catalogNameField: INodeProperties = {
  displayName: "Catalog Name",
  name: "name",
  type: "string",
  required: true,
  default: "",
  description: "Name of the catalog",
  displayOptions: {
    show: {
      resource: ["catalog"],
      operation: ["create", "update"],
    },
  },
};

// Create operation fields
const createFields: INodeProperties[] = [
  catalogNameField,
  {
    displayName: "Is Default",
    name: "isDefault",
    type: "boolean",
    default: false,
    description: "Whether this is the default catalog",
    displayOptions: {
      show: {
        resource: ["catalog"],
        operation: ["create", "update"],
      },
    },
  },
  {
    displayName: "Is SKU",
    name: "isSku",
    type: "boolean",
    default: false,
    description: "Whether this is a SKU catalog",
    displayOptions: {
      show: {
        resource: ["catalog"],
        operation: ["create", "update"],
      },
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["catalog"],
        operation: ["create"],
      },
    },
    options: [
      {
        displayName: "Currency ID",
        name: "currencyId",
        type: "string",
        default: "",
        description: "Currency ID for the catalog",
      },
      {
        displayName: "Person Type ID",
        name: "personTypeId",
        type: "string",
        default: "",
        description: "Person type ID",
      },
      {
        displayName: "VAT ID",
        name: "vatId",
        type: "string",
        default: "",
        description: "VAT ID",
      },
      {
        displayName: "Source ID",
        name: "sourceId",
        type: "string",
        default: "",
        description: "Source ID",
      },
    ],
  },
];

// Update operation fields
const updateFields: INodeProperties[] = [
  catalogIdField,
  {
    displayName: "Fields to Update",
    name: "fieldsToUpdate",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["catalog"],
        operation: ["update"],
      },
    },
    options: [
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        description: "New catalog name",
      },
      {
        displayName: "Is Default",
        name: "isDefault",
        type: "boolean",
        default: false,
        description: "Whether this is the default catalog",
      },
      {
        displayName: "Is SKU",
        name: "isSku",
        type: "boolean",
        default: false,
        description: "Whether this is a SKU catalog",
      },
      {
        displayName: "Currency ID",
        name: "currencyId",
        type: "string",
        default: "",
        description: "New currency ID",
      },
    ],
  },
];

// Get All operation fields
const getAllFields: INodeProperties[] = [
  {
    displayName: "Filter",
    name: "filter",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: {
      show: {
        resource: ["catalog"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        description: "Filter by catalog name",
      },
      {
        displayName: "Is Default",
        name: "isDefault",
        type: "boolean",
        default: false,
        description: "Filter by default status",
      },
      {
        displayName: "Is SKU",
        name: "isSku",
        type: "boolean",
        default: false,
        description: "Filter by SKU status",
      },
      {
        displayName: "Currency ID",
        name: "currencyId",
        type: "string",
        default: "",
        description: "Filter by currency ID",
      },
    ],
  },
  {
    displayName: "Order",
    name: "order",
    type: "collection",
    placeholder: "Add Order",
    default: {},
    displayOptions: {
      show: {
        resource: ["catalog"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "Field",
        name: "field",
        type: "options",
        options: [
          { name: "ID", value: "ID" },
          { name: "Name", value: "NAME" },
          { name: "Date Created", value: "DATE_CREATE" },
          { name: "Date Modified", value: "DATE_MODIFY" },
        ],
        default: "ID",
        description: "Field to order by",
      },
      {
        displayName: "Direction",
        name: "direction",
        type: "options",
        options: [
          { name: "Ascending", value: "ASC" },
          { name: "Descending", value: "DESC" },
        ],
        default: "ASC",
        description: "Order direction",
      },
    ],
  },
];

// Simple operation fields (get, delete, getFields)
const simpleFields: INodeProperties[] = [catalogIdField];

// Options collection
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["catalog"],
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

// Export all Catalog operations and fields
export const catalogOperations = [
  {
    name: "Get Catalogs",
    value: "getCatalogs",
    description: "Get list of catalogs (catalog.catalog.list)",
    action: "Get list of catalogs",
  },
  {
    name: "Get Catalog",
    value: "getCatalog",
    description: "Get catalog information (catalog.catalog.get)",
    action: "Get catalog information",
  },
  {
    name: "Add Catalog",
    value: "addCatalog",
    description: "Add new catalog (catalog.catalog.add)",
    action: "Add new catalog",
  },
  {
    name: "Update Catalog",
    value: "updateCatalog",
    description: "Update catalog (catalog.catalog.update)",
    action: "Update catalog",
  },
  {
    name: "Delete Catalog",
    value: "deleteCatalog",
    description: "Delete catalog (catalog.catalog.delete)",
    action: "Delete catalog",
  },
  {
    name: "Get Sections",
    value: "getSections",
    description: "Get catalog sections (catalog.section.list)",
    action: "Get catalog sections",
  },
  {
    name: "Get Section",
    value: "getSection",
    description: "Get section information (catalog.section.get)",
    action: "Get section information",
  },
  {
    name: "Add Section",
    value: "addSection",
    description: "Add catalog section (catalog.section.add)",
    action: "Add catalog section",
  },
  {
    name: "Update Section",
    value: "updateSection",
    description: "Update catalog section (catalog.section.update)",
    action: "Update catalog section",
  },
  {
    name: "Delete Section",
    value: "deleteSection",
    description: "Delete catalog section (catalog.section.delete)",
    action: "Delete catalog section",
  },
  {
    name: "Get Products",
    value: "getProducts",
    description: "Get catalog products (catalog.product.list)",
    action: "Get catalog products",
  },
  {
    name: "Get Product",
    value: "getProduct",
    description: "Get product information (catalog.product.get)",
    action: "Get product information",
  },
  {
    name: "Add Product",
    value: "addProduct",
    description: "Add catalog product (catalog.product.add)",
    action: "Add catalog product",
  },
  {
    name: "Update Product",
    value: "updateProduct",
    description: "Update catalog product (catalog.product.update)",
    action: "Update catalog product",
  },
  {
    name: "Delete Product",
    value: "deleteProduct",
    description: "Delete catalog product (catalog.product.delete)",
    action: "Delete catalog product",
  },
];

export const catalogFields: INodeProperties[] = [
  ...createFields,
  ...updateFields,
  ...getAllFields,
  ...simpleFields,
  optionsCollection,
];

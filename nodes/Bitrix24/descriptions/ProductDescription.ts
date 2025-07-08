import { INodeProperties } from "n8n-workflow";

/**
 * Product Description - CLEAN VERSION without circular dependencies
 */

// Product ID Field
const productIdField: INodeProperties = {
  displayName: "Product ID",
  name: "productId",
  type: "string",
  required: true,
  default: "",
  description: "The ID of the product",
  displayOptions: {
    show: {
      resource: ["product"],
      operation: ["get", "update", "delete"],
    },
  },
};

// Product Name Field
const productNameField: INodeProperties = {
  displayName: "Product Name",
  name: "productName",
  type: "string",
  required: true,
  default: "",
  description: "Name of the product",
  displayOptions: {
    show: {
      resource: ["product"],
      operation: ["create"],
    },
  },
};

// Price Field
const priceField: INodeProperties = {
  displayName: "Price",
  name: "price",
  type: "number",
  required: true,
  default: 0,
  description: "Price of the product",
  displayOptions: {
    show: {
      resource: ["product"],
      operation: ["create"],
    },
  },
};

// Currency Field
const currencyField: INodeProperties = {
  displayName: "Currency",
  name: "currency",
  type: "string",
  default: "USD",
  description: "Currency code (e.g., USD, EUR, RUB)",
  displayOptions: {
    show: {
      resource: ["product"],
      operation: ["create"],
    },
  },
};

// Create operation fields
const createFields: INodeProperties[] = [
  productNameField,
  priceField,
  currencyField,
  {
    displayName: "Options",
    name: "additionalOptions",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["product"],
        operation: ["create"],
      },
    },
    options: [
      {
        displayName: "Description",
        name: "description",
        type: "string",
        typeOptions: {
          rows: 3,
        },
        default: "",
        description: "Product description",
      },
      {
        displayName: "Section ID",
        name: "sectionId",
        type: "string",
        default: "",
        description: "ID of the product section/category",
      },
      {
        displayName: "Active",
        name: "active",
        type: "boolean",
        default: true,
        description: "Whether the product is active",
      },
      {
        displayName: "Sort",
        name: "sort",
        type: "number",
        default: 100,
        description: "Sort order",
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
        resource: ["product"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "Section ID",
        name: "sectionId",
        type: "string",
        default: "",
        description: "Filter by section ID",
      },
      {
        displayName: "Active",
        name: "active",
        type: "boolean",
        default: true,
        description: "Filter by active status",
      },
      {
        displayName: "Name Contains",
        name: "nameContains",
        type: "string",
        default: "",
        description: "Filter by products containing this text in name",
      },
    ],
  },
];

// Update operation fields
const updateFields: INodeProperties[] = [
  productIdField,
  {
    displayName: "Fields to Update",
    name: "fieldsToUpdate",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["product"],
        operation: ["update"],
      },
    },
    options: [
      {
        displayName: "Product Name",
        name: "productName",
        type: "string",
        default: "",
        description: "New product name",
      },
      {
        displayName: "Price",
        name: "price",
        type: "number",
        default: 0,
        description: "New product price",
      },
      {
        displayName: "Currency",
        name: "currency",
        type: "string",
        default: "",
        description: "New currency code",
      },
      {
        displayName: "Active",
        name: "active",
        type: "boolean",
        default: true,
        description: "New active status",
      },
    ],
  },
];

// Simple operation fields
const simpleFields: INodeProperties[] = [productIdField];

// Options collection
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["product"],
    },
  },
  options: [
    {
      name: "Get Products",
      value: "getProducts",
      description: "Get list of products (crm.product.list)",
      action: "Get list of products",
    },
    {
      name: "Get Product",
      value: "getProduct",
      description: "Get product information (crm.product.get)",
      action: "Get product information",
    },
    {
      name: "Add Product",
      value: "addProduct",
      description: "Add new product (crm.product.add)",
      action: "Add new product",
    },
    {
      name: "Update Product",
      value: "updateProduct",
      description: "Update product (crm.product.update)",
      action: "Update product",
    },
    {
      name: "Delete Product",
      value: "deleteProduct",
      description: "Delete product (crm.product.delete)",
      action: "Delete product",
    },
    {
      name: "Get Product Fields",
      value: "getProductFields",
      description: "Get product fields (crm.product.fields)",
      action: "Get product fields",
    },
    {
      name: "Get Product Properties",
      value: "getProductProperties",
      description: "Get product properties (crm.product.property.list)",
      action: "Get product properties",
    },
    {
      name: "Add Product Property",
      value: "addProductProperty",
      description: "Add product property (crm.product.property.add)",
      action: "Add product property",
    },
    {
      name: "Update Product Property",
      value: "updateProductProperty",
      description: "Update product property (crm.product.property.update)",
      action: "Update product property",
    },
    {
      name: "Delete Product Property",
      value: "deleteProductProperty",
      description: "Delete product property (crm.product.property.delete)",
      action: "Delete product property",
    },
  ],
};

// Export all Product operations and fields
export const productOperations = [
  {
    name: "Create",
    value: "create",
    description: "Create a product",
    action: "Create a product",
  },
  {
    name: "Get",
    value: "get",
    description: "Get a product",
    action: "Get a product",
  },
  {
    name: "Get All",
    value: "getAll",
    description: "Get all products",
    action: "Get all products",
  },
  {
    name: "Update",
    value: "update",
    description: "Update a product",
    action: "Update a product",
  },
  {
    name: "Delete",
    value: "delete",
    description: "Delete a product",
    action: "Delete a product",
  },
];

export const productFields: INodeProperties[] = [
  ...createFields,
  ...updateFields,
  ...getAllFields,
  ...simpleFields,
  optionsCollection,
];

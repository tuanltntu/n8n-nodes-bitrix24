import { INodeProperties } from "n8n-workflow";

/**
 * Entity operations
 */
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["entity"],
    },
  },
  options: [
    {
      name: "Get",
      value: "get",
      description: "Get entity by ID (crm.entity.get)",
      action: "Get entity by ID",
    },
    {
      name: "List",
      value: "list",
      description: "Get all entities",
      action: "Get all entities",
    },
    {
      name: "Add",
      value: "add",
      description: "Add new entity (crm.entity.add)",
      action: "Add new entity",
    },
    {
      name: "Update",
      value: "update",
      description: "Update entity (crm.entity.update)",
      action: "Update entity",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete entity (crm.entity.delete)",
      action: "Delete entity",
    },
    {
      name: "Count",
      value: "count",
      description: "Count entities",
      action: "Count entities",
    },
    {
      name: "Get Types",
      value: "getTypes",
      description: "Get entity types",
      action: "Get entity types",
    },
    {
      name: "Get Fields",
      value: "getFields",
      description: "Get entity fields",
      action: "Get entity fields",
    },
    {
      name: "Add Section",
      value: "addSection",
      description: "Add entity section (entity.section.add)",
      action: "Add entity section",
    },
    {
      name: "Update Section",
      value: "updateSection",
      description: "Update entity section (entity.section.update)",
      action: "Update entity section",
    },
    {
      name: "Delete Section",
      value: "deleteSection",
      description: "Delete entity section (entity.section.delete)",
      action: "Delete entity section",
    },
    {
      name: "Get Sections",
      value: "getSections",
      description: "Get entity sections (entity.section.get)",
      action: "Get entity sections",
    },
    {
      name: "Add Item",
      value: "addItem",
      description: "Add entity item (entity.item.add)",
      action: "Add entity item",
    },
    {
      name: "Get Item",
      value: "getItem",
      description: "Get entity item (entity.item.get)",
      action: "Get entity item",
    },
    {
      name: "Update Item",
      value: "updateItem",
      description: "Update entity item (entity.item.update)",
      action: "Update entity item",
    },
    {
      name: "Delete Item",
      value: "deleteItem",
      description: "Delete entity item (entity.item.delete)",
      action: "Delete entity item",
    },
    {
      name: "Get Items",
      value: "getItems",
      description: "Get entity items",
      action: "Get entity items",
    },
    {
      name: "Import",
      value: "import",
      description: "Import entities",
      action: "Import entities",
    },
    {
      name: "Export",
      value: "export",
      description: "Export entities",
      action: "Export entities",
    },
  ],
  default: "list",
};

/**
 * Entity type field
 */
const entityTypeField: INodeProperties = {
  displayName: "Entity Type",
  name: "entityType",
  type: "string",
  required: true,
  default: "",
  placeholder: "e.g., CRM_LEAD, CRM_DEAL, CRM_CONTACT",
  description: "The type of entity to work with",
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: [
        "add",
        "update",
        "delete",
        "addSection",
        "updateSection",
        "deleteSection",
        "getSections",
        "addItem",
        "getItem",
        "updateItem",
        "deleteItem",
      ],
    },
  },
};

/**
 * Entity ID field
 */
const entityIdField: INodeProperties = {
  displayName: "Entity ID",
  name: "entityId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the entity",
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: ["update", "delete"],
    },
  },
};

/**
 * Section ID field
 */
const sectionIdField: INodeProperties = {
  displayName: "Section ID",
  name: "sectionId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the section",
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: ["updateSection", "deleteSection"],
    },
  },
};

/**
 * Item ID field
 */
const itemIdField: INodeProperties = {
  displayName: "Item ID",
  name: "itemId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the item",
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: ["getItem", "updateItem", "deleteItem"],
    },
  },
};

/**
 * Entity data field for create/update
 */
const entityDataField: INodeProperties = {
  displayName: "Entity Data",
  name: "entityData",
  type: "json",
  default: "{}",
  description: "Entity data to create or update",
  placeholder: '{"NAME": "Entity Name", "ACTIVE": "Y"}',
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: ["add", "update"],
    },
  },
};

/**
 * Section data field
 */
const sectionDataField: INodeProperties = {
  displayName: "Section Data",
  name: "sectionData",
  type: "json",
  default: "{}",
  description: "Section data to create or update",
  placeholder: '{"NAME": "Section Name", "CODE": "section_code"}',
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: ["addSection", "updateSection"],
    },
  },
};

/**
 * Item data field
 */
const itemDataField: INodeProperties = {
  displayName: "Item Data",
  name: "itemData",
  type: "json",
  default: "{}",
  description: "Item data to create or update",
  placeholder: '{"NAME": "Item Name", "PROPERTY_VALUES": {}}',
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: ["addItem", "updateItem"],
    },
  },
};

/**
 * Return All field
 */
const returnAllField: INodeProperties = {
  displayName: "Return All",
  name: "returnAll",
  type: "boolean",
  default: false,
  description: "Whether to return all results or only up to a given limit",
  displayOptions: {
    show: {
      resource: ["entity"],
      operation: ["list", "getSections", "getItems"],
    },
  },
};

/**
 * Options collection
 */
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["entity"],
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
    {
      displayName: "Filter",
      name: "filter",
      type: "json",
      default: "{}",
      description: "Filter criteria",
    },
    {
      displayName: "Select",
      name: "select",
      type: "string",
      default: "",
      description: "Comma-separated list of fields to select",
    },
    {
      displayName: "Order",
      name: "order",
      type: "json",
      default: "{}",
      description: "Order criteria",
    },
    {
      displayName: "Start",
      name: "start",
      type: "number",
      default: 0,
      description: "Start position for pagination",
    },
  ],
};

export const entityOperations = [
  {
    name: "Get",
    value: "get",
    description: "Get entity by ID (crm.entity.get)",
    action: "Get entity by ID",
  },
  {
    name: "List",
    value: "list",
    description: "Get all entities",
    action: "Get all entities",
  },
  {
    name: "Add",
    value: "add",
    description: "Add new entity (crm.entity.add)",
    action: "Add new entity",
  },
  {
    name: "Update",
    value: "update",
    description: "Update entity (crm.entity.update)",
    action: "Update entity",
  },
  {
    name: "Delete",
    value: "delete",
    description: "Delete entity (crm.entity.delete)",
    action: "Delete entity",
  },
  {
    name: "Count",
    value: "count",
    description: "Count entities",
    action: "Count entities",
  },
  {
    name: "Get Types",
    value: "getTypes",
    description: "Get entity types",
    action: "Get entity types",
  },
  {
    name: "Get Fields",
    value: "getFields",
    description: "Get entity fields",
    action: "Get entity fields",
  },
  {
    name: "Add Section",
    value: "addSection",
    description: "Add entity section (entity.section.add)",
    action: "Add entity section",
  },
  {
    name: "Update Section",
    value: "updateSection",
    description: "Update entity section (entity.section.update)",
    action: "Update entity section",
  },
  {
    name: "Delete Section",
    value: "deleteSection",
    description: "Delete entity section (entity.section.delete)",
    action: "Delete entity section",
  },
  {
    name: "Get Sections",
    value: "getSections",
    description: "Get entity sections (entity.section.get)",
    action: "Get entity sections",
  },
  {
    name: "Add Item",
    value: "addItem",
    description: "Add entity item (entity.item.add)",
    action: "Add entity item",
  },
  {
    name: "Get Item",
    value: "getItem",
    description: "Get entity item (entity.item.get)",
    action: "Get entity item",
  },
  {
    name: "Update Item",
    value: "updateItem",
    description: "Update entity item (entity.item.update)",
    action: "Update entity item",
  },
  {
    name: "Delete Item",
    value: "deleteItem",
    description: "Delete entity item (entity.item.delete)",
    action: "Delete entity item",
  },
  {
    name: "Get Items",
    value: "getItems",
    description: "Get entity items",
    action: "Get entity items",
  },
  {
    name: "Import",
    value: "import",
    description: "Import entities",
    action: "Import entities",
  },
  {
    name: "Export",
    value: "export",
    description: "Export entities",
    action: "Export entities",
  },
];

export const entityFields = [
  operationField,
  entityTypeField,
  entityIdField,
  sectionIdField,
  itemIdField,
  entityDataField,
  sectionDataField,
  itemDataField,
  returnAllField,
  optionsCollection,
];

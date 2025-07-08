import { INodeProperties } from "n8n-workflow";

// SPA Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "getTypes",
  displayOptions: {
    show: {
      resource: ["spa"],
    },
  },
  options: [
    // Type operations
    {
      name: "Get Types",
      value: "getTypes",
      description: "Get all smart process types (crm.type.list)",
      action: "Get all smart process types",
    },
    {
      name: "Get Type",
      value: "getType",
      description: "Get a smart process type by ID (crm.type.get)",
      action: "Get a smart process type",
    },
    {
      name: "Add Type",
      value: "addType",
      description: "Create a new smart process type (crm.type.add)",
      action: "Create a smart process type",
    },
    {
      name: "Update Type",
      value: "updateType",
      description: "Update a smart process type (crm.type.update)",
      action: "Update a smart process type",
    },
    {
      name: "Delete Type",
      value: "deleteType",
      description: "Delete a smart process type (crm.type.delete)",
      action: "Delete a smart process type",
    },
    {
      name: "Get Fields",
      value: "getFields",
      description: "Get available fields for smart process (crm.item.fields)",
      action: "Get smart process fields",
    },
    // Item operations
    {
      name: "Get Items",
      value: "getItems",
      description: "Get all items from smart process (crm.item.list)",
      action: "Get all smart process items",
    },
    {
      name: "Get Item",
      value: "getItem",
      description: "Get a smart process item by ID (crm.item.get)",
      action: "Get a smart process item",
    },
    {
      name: "Create Item",
      value: "createItem",
      description: "Create a new smart process item (crm.item.add)",
      action: "Create a smart process item",
    },
    {
      name: "Update Item",
      value: "updateItem",
      description: "Update a smart process item (crm.item.update)",
      action: "Update a smart process item",
    },
    {
      name: "Delete Item",
      value: "deleteItem",
      description: "Delete a smart process item (crm.item.delete)",
      action: "Delete a smart process item",
    },
    {
      name: "Get SPA Config",
      value: "getSpaConfig",
      description: "Get SPA configuration (spa.config.get)",
      action: "Get SPA configuration",
    },
    {
      name: "Set SPA Config",
      value: "setSpaConfig",
      description: "Set SPA configuration (spa.config.set)",
      action: "Set SPA configuration",
    },
    {
      name: "Get SPA List",
      value: "getSpaList",
      description: "Get list of SPA applications (spa.list)",
      action: "Get list of SPA applications",
    },
    {
      name: "Get SPA Info",
      value: "getSpaInfo",
      description: "Get SPA application information (spa.get)",
      action: "Get SPA application information",
    },
    {
      name: "Install SPA",
      value: "installSpa",
      description: "Install SPA application (spa.install)",
      action: "Install SPA application",
    },
    {
      name: "Uninstall SPA",
      value: "uninstallSpa",
      description: "Uninstall SPA application (spa.uninstall)",
      action: "Uninstall SPA application",
    },
    {
      name: "Update SPA",
      value: "updateSpa",
      description: "Update SPA application (spa.update)",
      action: "Update SPA application",
    },
    {
      name: "Get SPA Status",
      value: "getSpaStatus",
      description: "Get SPA application status (spa.status.get)",
      action: "Get SPA application status",
    },
    {
      name: "Get SPA Settings",
      value: "getSpaSettings",
      description: "Get SPA application settings (spa.settings.get)",
      action: "Get SPA application settings",
    },
    {
      name: "Set SPA Permissions",
      value: "setSpaPermissions",
      description: "Set SPA application permissions (spa.permissions.set)",
      action: "Set SPA application permissions",
    },
  ],
};

const basicFields: INodeProperties[] = [
  /* -------------------------------------------------------------------------- */
  /*                                 spa:getTypes                                */
  /* -------------------------------------------------------------------------- */
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["getTypes", "getItems"],
      },
    },
    default: false,
    description: "Whether to return all results or only up to a given limit",
  },

  /* -------------------------------------------------------------------------- */
  /*                            spa:addType/updateType                           */
  /* -------------------------------------------------------------------------- */
  {
    displayName: "Type Name",
    name: "title",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    description: "The name of the Smart Process type",
  },
  {
    displayName: "Type ID",
    name: "id",
    type: "options",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["getType", "updateType", "deleteType"],
      },
    },
    description: "Select the Smart Process type",
    typeOptions: {
      loadOptionsMethod: "getSpaTypeIds",
    },
  },

  /* -------------------------------------------------------------------------- */
  /*                        spa:createItem/updateItem/deleteItem                  */
  /* -------------------------------------------------------------------------- */
  {
    displayName: "Type ID",
    name: "entityTypeId",
    type: "options",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: [
          "createItem",
          "updateItem",
          "deleteItem",
          "getItems",
          "getItem",
          "getFields",
        ],
      },
    },
    description: "Select the Smart Process type",
    typeOptions: {
      loadOptionsMethod: "getSpaTypes",
    },
  },
  {
    displayName: "Item ID",
    name: "itemId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["updateItem", "deleteItem", "getItem"],
      },
    },
    description: "The ID of the Smart Process item",
  },

  /* -------------------------------------------------------------------------- */
  /*                            Type Configuration Options                       */
  /* -------------------------------------------------------------------------- */
  {
    displayName: "Enable Client Field",
    name: "isClientEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description:
      "Whether to enable Client field with bindings to Contacts and Companies",
  },
  {
    displayName: "Enable Document Printing",
    name: "isDocumentsEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable document printing",
  },
  {
    displayName: "Enable Use in User Field",
    name: "isUseInUserfieldEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the use of the SPA in user fields",
  },
  {
    displayName: "Enable Product Binding",
    name: "isLinkWithProductsEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable binding of catalog products",
  },
  {
    displayName: "Enable Company Details Field",
    name: "isMycompanyEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the Your Company Details field",
  },
  {
    displayName: "Enable Observers Field",
    name: "isObserversEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the Observers field",
  },
  {
    displayName: "Enable Recycle Bin",
    name: "isRecyclebinEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the recycle bin functionality",
  },
  {
    displayName: "Enable Automation Rules & Triggers",
    name: "isAutomationEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable automation rules and triggers",
  },
  {
    displayName: "Enable Start Date & End Date Fields",
    name: "isBeginCloseDatesEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the Start Date and End Date fields",
  },
  {
    displayName: "Enable Business Process Designer",
    name: "isBizProcEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the use of the business process designer",
  },
  {
    displayName: "Enable Custom Sales Funnels",
    name: "isCategoriesEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable custom sales funnels and tunnels",
  },
  {
    displayName: "Enable Source Field",
    name: "isSourceEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the Source field",
  },
  {
    displayName: "Enable Set Open Permissions for New Elements",
    name: "isSetOpenPermissions",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable setting open permissions for new elements",
  },
  {
    displayName: "Enable Payment Stage Field",
    name: "isPayStagesEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: false,
    description: "Whether to enable the Payment Stage field",
  },
  {
    displayName: "Enable REST API",
    name: "isRestEnabled",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: true,
    description: "Whether to enable external access via REST",
  },

  // Dynamic Fields Collection for Create/Update Item operations
  {
    displayName: "Fields",
    name: "fields",
    type: "fixedCollection",
    placeholder: "Add Field",
    default: { fieldItems: [] },
    description:
      "Fields to create/update. Available fields will be loaded based on the selected type ID.",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["createItem", "updateItem"],
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
              loadOptionsMethod: "getSpaItemFields",
              loadOptionsDependsOn: ["entityTypeId"],
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
  },

  // Renamed from Type Data to Options
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["addType", "updateType"],
      },
    },
    default: {},
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
        displayName: "Entity Type ID",
        name: "entityTypeId",
        type: "number",
        default: 0,
        description:
          "Identifier of the created SPA (must be ≥ 1030 or in range 128-192)",
      },
      {
        displayName: "Entity Type Code",
        name: "code",
        type: "string",
        default: "",
        description:
          "Code identifier for the entity type (no spaces, lowercase)",
      },
      {
        displayName: "Description",
        name: "description",
        type: "string",
        typeOptions: { rows: 3 },
        default: "",
        description: "Description of the Smart Process type",
      },
      {
        displayName: "Relations",
        name: "relations",
        type: "json",
        default: "{}",
        description:
          "An object containing links to other CRM entities (JSON format)",
        placeholder:
          '{ "parent": [{"entityTypeId": 3, "isChildrenListEnabled": "true"}], "child": [{"entityTypeId": 4}] }',
      },
      {
        displayName: "Linked User Fields",
        name: "linkedUserFields",
        type: "json",
        default: "{}",
        description:
          "User fields in which this SPA should be displayed (when isUseInUserfieldEnabled=Y)",
        placeholder:
          '{ "CALENDAR_EVENT|UF_CRM_CAL_EVENT": "true", "TASKS_TASK|UF_CRM_TASK": "true" }',
      },
    ],
  },
  // JSON fields option
  {
    displayName: "Use JSON Format for Fields",
    name: "jsonFields",
    type: "boolean",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["createItem", "updateItem"],
      },
    },
    default: false,
    description: "Whether to use JSON format for fields",
  },
  {
    displayName: "Fields (JSON)",
    name: "fieldsJson",
    type: "json",
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["createItem", "updateItem"],
        jsonFields: [true],
      },
    },
    default: "{}",
    description: "Fields in JSON format",
  },
  // Options
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["spa"],
        operation: ["getTypes", "getItems"],
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
        default: "{}",
        description:
          "Filter to apply when retrieving items. Follow Bitrix24 filter syntax.",
        placeholder: '{ "STAGE_ID": "NEW", ">CREATED_DATE": "2023-01-01" }',
      },
      {
        displayName: "Order",
        name: "order",
        type: "json",
        default: "{}",
        description: "Order specification for the results",
        placeholder: '{ "ID": "ASC", "CREATED_DATE": "DESC" }',
      },
      {
        displayName: "Select",
        name: "select",
        type: "string",
        default: "",
        description:
          "Comma-separated list of fields to return. Leave empty for all fields.",
        placeholder: "ID,TITLE,CREATED_BY,DATE_CREATE",
      },
    ],
  },
];

// Export operations
export const spaOperations = [
  {
    name: "Get Types",
    value: "getTypes",
    description: "Get all smart process types",
    action: "Get all smart process types",
  },
  {
    name: "Get Type",
    value: "getType",
    description: "Get a smart process type by ID",
    action: "Get a smart process type",
  },
  {
    name: "Add Type",
    value: "addType",
    description: "Create a new smart process type",
    action: "Create a smart process type",
  },
  {
    name: "Update Type",
    value: "updateType",
    description: "Update a smart process type",
    action: "Update a smart process type",
  },
  {
    name: "Delete Type",
    value: "deleteType",
    description: "Delete a smart process type",
    action: "Delete a smart process type",
  },
  {
    name: "Get Fields",
    value: "getFields",
    description: "Get available fields for smart process",
    action: "Get smart process fields",
  },
  {
    name: "Get Items",
    value: "getItems",
    description: "Get all items from smart process",
    action: "Get all smart process items",
  },
  {
    name: "Get Item",
    value: "getItem",
    description: "Get a smart process item by ID",
    action: "Get a smart process item",
  },
  {
    name: "Create Item",
    value: "createItem",
    description: "Create a new smart process item",
    action: "Create a smart process item",
  },
  {
    name: "Update Item",
    value: "updateItem",
    description: "Update a smart process item",
    action: "Update a smart process item",
  },
  {
    name: "Delete Item",
    value: "deleteItem",
    description: "Delete a smart process item",
    action: "Delete a smart process item",
  },
];

// Export fields
export const spaFields: INodeProperties[] = [operationField, ...basicFields];

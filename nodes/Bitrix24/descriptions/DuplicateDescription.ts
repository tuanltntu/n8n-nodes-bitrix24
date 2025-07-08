import { INodeProperties } from "n8n-workflow";

/**
 * Duplicate Description - CLEAN VERSION without circular dependencies
 */

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "findDuplicates",
  displayOptions: {
    show: {
      resource: ["duplicate"],
    },
  },
  options: [
    {
      name: "Find Duplicates",
      value: "findDuplicates",
      description:
        "Find duplicate entities by communication (crm.duplicate.findbycomm)",
      action: "Find duplicate entities",
    },
    {
      name: "Find By Communication",
      value: "findByCommunication",
      description:
        "Find entities by communication value (crm.duplicate.findbycomm)",
      action: "Find entities by communication",
    },
    {
      name: "Get Duplicate Criteria",
      value: "getDuplicateCriteria",
      description: "Get duplicate search criteria (crm.duplicate.list)",
      action: "Get duplicate search criteria",
    },
    {
      name: "Enable Duplicate Control",
      value: "enableDuplicateControl",
      description:
        "Enable automatic duplicate control (crm.duplicate.enableautomerge)",
      action: "Enable duplicate control",
    },
    {
      name: "Disable Duplicate Control",
      value: "disableDuplicateControl",
      description:
        "Disable automatic duplicate control (crm.duplicate.disableautomerge)",
      action: "Disable duplicate control",
    },
    {
      name: "Merge Duplicates",
      value: "mergeDuplicates",
      description: "Merge duplicate entities (crm.duplicate.merge)",
      action: "Merge duplicate entities",
    },
  ],
};

// Entity Type Field
const entityTypeField: INodeProperties = {
  displayName: "Entity Type",
  name: "entityType",
  type: "options",
  options: [
    { name: "Lead", value: "LEAD" },
    { name: "Deal", value: "DEAL" },
    { name: "Contact", value: "CONTACT" },
    { name: "Company", value: "COMPANY" },
  ],
  default: "LEAD",
  required: true,
  description: "Type of entity to search for duplicates",
  displayOptions: {
    show: {
      resource: ["duplicate"],
      operation: ["findDuplicates", "mergeDuplicates"],
    },
  },
};

// Entity ID Field
const entityIdField: INodeProperties = {
  displayName: "Entity ID",
  name: "entityId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the entity",
  displayOptions: {
    show: {
      resource: ["duplicate"],
      operation: ["findDuplicates", "mergeDuplicates"],
    },
  },
};

// Target Entity ID Field
const targetEntityIdField: INodeProperties = {
  displayName: "Target Entity ID",
  name: "targetEntityId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the target entity to merge into",
  displayOptions: {
    show: {
      resource: ["duplicate"],
      operation: ["mergeDuplicates"],
    },
  },
};

// Find Duplicates operation fields
const findDuplicatesFields: INodeProperties[] = [
  entityTypeField,
  entityIdField,
  {
    displayName: "Options",
    name: "searchOptions",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["duplicate"],
        operation: ["findDuplicates"],
      },
    },
    options: [
      {
        displayName: "Match Type",
        name: "matchType",
        type: "options",
        options: [
          { name: "Exact", value: "EXACT" },
          { name: "Similar", value: "SIMILAR" },
          { name: "Fuzzy", value: "FUZZY" },
        ],
        default: "SIMILAR",
        description: "Type of duplicate matching",
      },
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

// Find By Communication operation fields
const findByCommunicationFields: INodeProperties[] = [
  entityTypeField,
  {
    displayName: "Communication Type",
    name: "commType",
    type: "options",
    options: [
      { name: "Phone", value: "PHONE" },
      { name: "Email", value: "EMAIL" },
    ],
    default: "EMAIL",
    required: true,
    description: "Type of communication to search by",
    displayOptions: {
      show: {
        resource: ["duplicate"],
        operation: ["findByCommunication"],
      },
    },
  },
  {
    displayName: "Communication Value",
    name: "commValue",
    type: "string",
    required: true,
    default: "",
    description: "Value to search for (phone number or email)",
    displayOptions: {
      show: {
        resource: ["duplicate"],
        operation: ["findByCommunication"],
      },
    },
  },
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["duplicate"],
        operation: ["findByCommunication"],
      },
    },
    options: [
      {
        displayName: "Entity ID",
        name: "entityId",
        type: "string",
        default: "",
        description: "Specific entity ID to exclude from search",
      },
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

// Export all Duplicate operations and fields
export const duplicateOperations = [
  {
    name: "Find Duplicates",
    value: "findDuplicates",
    description:
      "Find duplicate entities by communication (crm.duplicate.findbycomm)",
    action: "Find duplicate entities",
  },
  {
    name: "Get Duplicate Criteria",
    value: "getDuplicateCriteria",
    description: "Get duplicate search criteria (crm.duplicate.list)",
    action: "Get duplicate search criteria",
  },
  {
    name: "Enable Duplicate Control",
    value: "enableDuplicateControl",
    description:
      "Enable automatic duplicate control (crm.duplicate.enableautomerge)",
    action: "Enable duplicate control",
  },
  {
    name: "Disable Duplicate Control",
    value: "disableDuplicateControl",
    description:
      "Disable automatic duplicate control (crm.duplicate.disableautomerge)",
    action: "Disable duplicate control",
  },
  {
    name: "Merge Duplicates",
    value: "mergeDuplicates",
    description: "Merge duplicate entities (crm.duplicate.merge)",
    action: "Merge duplicate entities",
  },
  {
    name: "Get Merge Status",
    value: "getMergeStatus",
    description: "Get duplicate merge status (crm.duplicate.getstatus)",
    action: "Get merge status",
  },
];

export const duplicateFields: INodeProperties[] = [
  operationField,
  ...findDuplicatesFields,
  ...findByCommunicationFields,
];

import { INodeProperties } from "n8n-workflow";

/**
 * Document Generator Description - CLEAN VERSION without circular dependencies
 */

// Update the operation field to include all operations
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
    },
  },
  options: [
    {
      name: "Generate Document",
      value: "generateDocument",
      description: "Generate document (documentgenerator.document.add)",
      action: "Generate document",
    },
    {
      name: "Get Document",
      value: "getDocument",
      description: "Get document (documentgenerator.document.get)",
      action: "Get document",
    },
    {
      name: "Get Documents",
      value: "getDocuments",
      description: "Get documents (documentgenerator.document.list)",
      action: "Get documents",
    },
    {
      name: "Update Document",
      value: "updateDocument",
      description: "Update document (documentgenerator.document.update)",
      action: "Update document",
    },
    {
      name: "Delete Document",
      value: "deleteDocument",
      description: "Delete document (documentgenerator.document.delete)",
      action: "Delete document",
    },
    {
      name: "Download Document",
      value: "downloadDocument",
      description: "Download document (documentgenerator.document.download)",
      action: "Download document",
    },
    {
      name: "Get Template",
      value: "getTemplate",
      description: "Get template (documentgenerator.template.get)",
      action: "Get template",
    },
    {
      name: "Get Templates",
      value: "getTemplates",
      description: "Get templates (documentgenerator.template.list)",
      action: "Get templates",
    },
    {
      name: "Create Template",
      value: "createTemplate",
      description: "Create template (documentgenerator.template.add)",
      action: "Create template",
    },
    {
      name: "Update Template",
      value: "updateTemplate",
      description: "Update template (documentgenerator.template.update)",
      action: "Update template",
    },
    {
      name: "Delete Template",
      value: "deleteTemplate",
      description: "Delete template (documentgenerator.template.delete)",
      action: "Delete template",
    },
    {
      name: "Get Template Fields",
      value: "getTemplateFields",
      description: "Get template fields (documentgenerator.template.getfields)",
      action: "Get template fields",
    },
    {
      name: "Get Providers",
      value: "getProviders",
      description: "Get providers (documentgenerator.provider.list)",
      action: "Get providers",
    },
    {
      name: "Get Provider",
      value: "getProvider",
      description: "Get provider (documentgenerator.provider.get)",
      action: "Get provider",
    },
    {
      name: "Get Regions",
      value: "getRegions",
      description: "Get regions (documentgenerator.region.list)",
      action: "Get regions",
    },
  ],
  default: "getTemplates",
};

// Template ID field
const templateIdField: INodeProperties = {
  displayName: "Template ID",
  name: "templateId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the document template",
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
      operation: [
        "getTemplate",
        "updateTemplate",
        "deleteTemplate",
        "generateDocument",
      ],
    },
  },
};

// Document ID field
const documentIdField: INodeProperties = {
  displayName: "Document ID",
  name: "documentId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the generated document",
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
      operation: ["getDocument", "deleteDocument", "downloadDocument"],
    },
  },
};

// Template data field
const templateDataField: INodeProperties = {
  displayName: "Template Data",
  name: "templateData",
  type: "json",
  required: true,
  default: "{}",
  description: "Template configuration in JSON format",
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
      operation: ["addTemplate", "updateTemplate"],
    },
  },
};

// Generate data field
const generateDataField: INodeProperties = {
  displayName: "Generate Data",
  name: "generateData",
  type: "json",
  required: true,
  default: "{}",
  description: "Data for document generation in JSON format",
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
      operation: ["generateDocument"],
    },
  },
};

// Entity type field
const entityTypeField: INodeProperties = {
  displayName: "Entity Type",
  name: "entityType",
  type: "string",
  default: "",
  description: "Type of entity for field retrieval",
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
      operation: ["getFields"],
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
  description: "ID of the entity to generate document for",
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
      operation: ["generate"],
    },
  },
};

// Values Field
const valuesField: INodeProperties = {
  displayName: "Values",
  name: "values",
  type: "json",
  default: "{}",
  description: "Additional values for document generation in JSON format",
  displayOptions: {
    show: {
      resource: ["documentGenerator"],
      operation: ["generate"],
    },
  },
};

// Generate Document operation fields
const generateFields: INodeProperties[] = [
  templateIdField,
  entityTypeField,
  entityIdField,
  valuesField,
  {
    displayName: "Options",
    name: "additionalOptions",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["documentGenerator"],
        operation: ["generateDocument"],
      },
    },
    options: [
      {
        displayName: "File Name",
        name: "fileName",
        type: "string",
        default: "",
        description: "Custom file name for the generated document",
      },
      {
        displayName: "Format",
        name: "format",
        type: "options",
        options: [
          { name: "PDF", value: "pdf" },
          { name: "DOCX", value: "docx" },
          { name: "HTML", value: "html" },
        ],
        default: "pdf",
        description: "Output format of the document",
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

// Get All Templates operation fields
const getAllFields: INodeProperties[] = [
  {
    displayName: "Filter",
    name: "filter",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: {
      show: {
        resource: ["documentGenerator"],
        operation: ["getTemplates"],
      },
    },
    options: [
      {
        displayName: "Entity Type",
        name: "entityType",
        type: "options",
        options: [
          { name: "All", value: "" },
          { name: "Lead", value: "LEAD" },
          { name: "Deal", value: "DEAL" },
          { name: "Contact", value: "CONTACT" },
          { name: "Company", value: "COMPANY" },
          { name: "Invoice", value: "INVOICE" },
        ],
        default: "",
        description: "Filter by entity type",
      },
      {
        displayName: "Active",
        name: "active",
        type: "boolean",
        default: true,
        description: "Filter by active status",
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
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["documentGenerator"],
        operation: ["getTemplate", "getDocument", "downloadDocument"],
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

// Simple operation fields (get single items)
const simpleFields: INodeProperties[] = [templateIdField, documentIdField];

// Export all Document Generator operations and fields
export const documentGeneratorOperations = [
  {
    name: "Get Templates",
    value: "getTemplates",
    description: "Get document templates",
    action: "Get document templates",
  },
  {
    name: "Get Template",
    value: "getTemplate",
    description: "Get a document template",
    action: "Get a document template",
  },
  {
    name: "Add Template",
    value: "addTemplate",
    description: "Add a new document template",
    action: "Add a document template",
  },
  {
    name: "Update Template",
    value: "updateTemplate",
    description: "Update a document template",
    action: "Update a document template",
  },
  {
    name: "Delete Template",
    value: "deleteTemplate",
    description: "Delete a document template",
    action: "Delete a document template",
  },
  {
    name: "Generate Document",
    value: "generateDocument",
    description: "Generate a document from template",
    action: "Generate a document from template",
  },
  {
    name: "Get Document",
    value: "getDocument",
    description: "Get generated document",
    action: "Get generated document",
  },
  {
    name: "Delete Document",
    value: "deleteDocument",
    description: "Delete a generated document",
    action: "Delete a generated document",
  },
  {
    name: "Download Document",
    value: "downloadDocument",
    description: "Download a generated document",
    action: "Download a generated document",
  },
  {
    name: "Get Fields",
    value: "getFields",
    description: "Get available fields for templates",
    action: "Get available fields for templates",
  },
];

export const documentGeneratorFields: INodeProperties[] = [
  operationField,
  templateIdField,
  documentIdField,
  templateDataField,
  generateDataField,
  entityTypeField,
  ...generateFields,
  ...getAllFields,
  ...simpleFields,
];

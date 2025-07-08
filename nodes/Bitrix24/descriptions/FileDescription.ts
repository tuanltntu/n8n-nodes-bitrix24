import { INodeProperties } from "n8n-workflow";

/**
 * File Description - CLEAN VERSION without circular dependencies
 */

// File ID Field
const fileIdField: INodeProperties = {
  displayName: "File ID",
  name: "fileId",
  type: "string",
  required: true,
  default: "",
  description: "The ID of the file",
  displayOptions: {
    show: {
      resource: ["file"],
      operation: ["get", "download", "delete", "move", "copy"],
    },
  },
};

// Folder ID Field
const folderIdField: INodeProperties = {
  displayName: "Folder ID",
  name: "folderId",
  type: "string",
  default: "",
  description: "ID of the folder (leave empty for root)",
  displayOptions: {
    show: {
      resource: ["file"],
      operation: ["upload", "getAll", "move", "copy"],
    },
  },
};

// File Name Field
const fileNameField: INodeProperties = {
  displayName: "File Name",
  name: "fileName",
  type: "string",
  required: true,
  default: "",
  description: "Name of the file",
  displayOptions: {
    show: {
      resource: ["file"],
      operation: ["upload"],
    },
  },
};

// File Content Field
const fileContentField: INodeProperties = {
  displayName: "File Content",
  name: "fileContent",
  type: "string",
  typeOptions: {
    rows: 4,
  },
  default: "",
  description: "Content of the file (base64 encoded for binary files)",
  displayOptions: {
    show: {
      resource: ["file"],
      operation: ["upload"],
    },
  },
};

// Upload operation fields
const uploadFields: INodeProperties[] = [
  {
    displayName: "Options",
    name: "uploadOptions",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["upload"],
      },
    },
    options: [
      {
        displayName: "Generate Unique Name",
        name: "generateUniqueName",
        type: "boolean",
        default: false,
        description: "Generate unique name if file already exists",
      },
      {
        displayName: "Rights",
        name: "rights",
        type: "json",
        default: "{}",
        description: "File access rights in JSON format",
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

// Get All operation fields
const getAllFields: INodeProperties[] = [
  folderIdField,
  fileIdField,
  fileNameField,
  fileContentField,
  {
    displayName: "Filter",
    name: "filter",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "File Type",
        name: "type",
        type: "options",
        options: [
          { name: "All", value: "" },
          { name: "File", value: "file" },
          { name: "Folder", value: "folder" },
        ],
        default: "",
        description: "Filter by file type",
      },
      {
        displayName: "Name Contains",
        name: "nameContains",
        type: "string",
        default: "",
        description: "Filter by files containing this text in name",
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
        resource: ["file"],
        operation: ["get", "delete", "move", "copy"],
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

// Move/Copy operation fields
const moveFields: INodeProperties[] = [
  {
    displayName: "Target Folder ID",
    name: "targetFolderId",
    type: "string",
    required: true,
    default: "",
    description: "ID of the target folder",
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["move", "copy"],
      },
    },
  },
  {
    displayName: "New Name",
    name: "newName",
    type: "string",
    default: "",
    description: "New name for the file (optional)",
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["move", "copy"],
      },
    },
  },
];

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  required: true,
  default: "upload",
  displayOptions: {
    show: {
      resource: ["file"],
    },
  },
  options: [
    {
      name: "Upload File",
      value: "upload",
      description: "Upload a file (disk.file.upload)",
      action: "Upload a file",
    },
    {
      name: "Get File",
      value: "get",
      description: "Get file information (disk.file.get)",
      action: "Get file information",
    },
    {
      name: "Get All Files",
      value: "getAll",
      description: "Get all files (disk.file.list)",
      action: "Get all files",
    },
    {
      name: "Download File",
      value: "download",
      description: "Download a file (disk.file.download)",
      action: "Download a file",
    },
    {
      name: "Delete File",
      value: "delete",
      description: "Delete a file (disk.file.delete)",
      action: "Delete a file",
    },
    {
      name: "Move File",
      value: "move",
      description: "Move a file (disk.file.move)",
      action: "Move a file",
    },
    {
      name: "Copy File",
      value: "copy",
      description: "Copy a file (disk.file.copy)",
      action: "Copy a file",
    },
  ],
};

// Export all File fields - cleaned up without duplicates
export const fileFields: INodeProperties[] = [
  operationField,
  ...moveFields,
  ...getAllFields,
  ...uploadFields,
];

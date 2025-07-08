import { INodeProperties } from "n8n-workflow";

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["disk"],
    },
  },
  options: [
    // Basic file operations
    {
      name: "Upload File",
      value: "uploadFile",
      description: "Upload file (disk.file.uploadfile)",
      action: "Upload file",
    },
    {
      name: "Download File",
      value: "downloadFile",
      description: "Download file (disk.file.get)",
      action: "Download file",
    },
    {
      name: "Delete File",
      value: "deleteFile",
      description: "Delete file (disk.file.delete)",
      action: "Delete file",
    },
    {
      name: "Get File Info",
      value: "getFileInfo",
      description: "Get file info (disk.file.get)",
      action: "Get file info",
    },
    {
      name: "List Files",
      value: "listFiles",
      description: "List files (disk.folder.getchildren)",
      action: "List files",
    },

    // Basic folder operations
    {
      name: "Create Folder",
      value: "createFolder",
      description: "Create folder (disk.folder.addfolder)",
      action: "Create folder",
    },
    {
      name: "Delete Folder",
      value: "deleteFolder",
      description: "Delete folder (disk.folder.delete)",
      action: "Delete folder",
    },

    // Storage operations
    {
      name: "Get Storage Info",
      value: "getStorageInfo",
      description: "Get storage info (disk.storage.get)",
      action: "Get storage info",
    },
    {
      name: "Get Storages",
      value: "getStorages",
      description: "Get storages (disk.storage.getlist)",
      action: "Get storages",
    },
    {
      name: "Get Storage",
      value: "getStorage",
      description: "Get storage (disk.storage.get)",
      action: "Get storage",
    },

    // Advanced folder operations
    {
      name: "Get Folders",
      value: "getFolders",
      description: "Get folders (disk.folder.getchildren)",
      action: "Get folders",
    },
    {
      name: "Get Folder",
      value: "getFolder",
      description: "Get folder (disk.folder.get)",
      action: "Get folder",
    },
    {
      name: "Add Folder",
      value: "addFolder",
      description: "Add folder (disk.folder.addfolder)",
      action: "Add folder",
    },
    {
      name: "Update Folder",
      value: "updateFolder",
      description: "Update folder (disk.folder.update)",
      action: "Update folder",
    },
    {
      name: "Copy Folder",
      value: "copyFolder",
      description: "Copy folder (disk.folder.copyfolder)",
      action: "Copy folder",
    },
    {
      name: "Move Folder",
      value: "moveFolder",
      description: "Move folder (disk.folder.movefolder)",
      action: "Move folder",
    },
    {
      name: "Rename Folder",
      value: "renameFolder",
      description: "Rename folder (disk.folder.rename)",
      action: "Rename folder",
    },

    // Advanced file operations
    {
      name: "Get Files",
      value: "getFiles",
      description: "Get files (disk.folder.getchildren)",
      action: "Get files",
    },
    {
      name: "Get File",
      value: "getFile",
      description: "Get file (disk.file.get)",
      action: "Get file",
    },
    {
      name: "Copy File",
      value: "copyFile",
      description: "Copy file (disk.file.copyfile)",
      action: "Copy file",
    },
    {
      name: "Move File",
      value: "moveFile",
      description: "Move file (disk.file.movefile)",
      action: "Move file",
    },
    {
      name: "Rename File",
      value: "renameFile",
      description: "Rename file (disk.file.rename)",
      action: "Rename file",
    },

    // Sharing operations
    {
      name: "Share Item",
      value: "shareItem",
      description: "Share item (disk.file.share)",
      action: "Share item",
    },
    {
      name: "Get Shared Items",
      value: "getSharedItems",
      description: "Get shared items (disk.file.getsharedfiles)",
      action: "Get shared items",
    },
    {
      name: "Get Sharing Rights",
      value: "getSharingRights",
      description: "Get sharing rights (disk.file.getsharingrights)",
      action: "Get sharing rights",
    },
    {
      name: "Update Sharing Rights",
      value: "updateSharingRights",
      description: "Update sharing rights (disk.file.updatesharingrights)",
      action: "Update sharing rights",
    },
  ],
  default: "listFiles",
};

// Storage ID field
const storageIdField: INodeProperties = {
  displayName: "Storage ID",
  name: "storageId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the storage",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["getStorage", "uploadFile"],
    },
  },
};

// Folder ID field
const folderIdField: INodeProperties = {
  displayName: "Folder ID",
  name: "folderId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the folder",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: [
        "getFolders",
        "getFolder",
        "updateFolder",
        "deleteFolder",
        "copyFolder",
        "moveFolder",
        "renameFolder",
        "getFiles",
        "listFiles",
        "uploadFile",
      ],
    },
  },
};

// Parent Folder ID field
const parentFolderIdField: INodeProperties = {
  displayName: "Parent Folder ID",
  name: "parentFolderId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the parent folder",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["createFolder", "addFolder"],
    },
  },
};

// File ID field
const fileIdField: INodeProperties = {
  displayName: "File ID",
  name: "fileId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the file",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: [
        "downloadFile",
        "deleteFile",
        "getFileInfo",
        "getFile",
        "copyFile",
        "moveFile",
        "renameFile",
      ],
    },
  },
};

// Item ID field for sharing
const itemIdField: INodeProperties = {
  displayName: "Item ID",
  name: "itemId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the file or folder to share",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["shareItem", "getSharingRights", "updateSharingRights"],
    },
  },
};

// Folder name field
const folderNameField: INodeProperties = {
  displayName: "Folder Name",
  name: "folderName",
  type: "string",
  required: true,
  default: "",
  description: "Name of the folder",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["createFolder", "addFolder"],
    },
  },
};

// New name field
const newNameField: INodeProperties = {
  displayName: "New Name",
  name: "newName",
  type: "string",
  required: true,
  default: "",
  description: "New name for the file or folder",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["renameFile", "renameFolder"],
    },
  },
};

// Destination folder ID field
const destinationFolderIdField: INodeProperties = {
  displayName: "Destination Folder ID",
  name: "destinationFolderId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the destination folder",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["copyFile", "moveFile", "copyFolder", "moveFolder"],
    },
  },
};

// Binary property field
const binaryPropertyField: INodeProperties = {
  displayName: "Binary Property",
  name: "binaryPropertyName",
  type: "string",
  default: "data",
  required: true,
  placeholder: "e.g. data",
  description: "Name of the binary property which contains the file to upload",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["uploadFile"],
    },
  },
};

// File name field
const fileNameField: INodeProperties = {
  displayName: "File Name",
  name: "fileName",
  type: "string",
  default: "",
  description:
    "Name of the file to upload (optional, will use original name if not specified)",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["uploadFile"],
    },
  },
};

// Sharing data field
const sharingDataField: INodeProperties = {
  displayName: "Sharing Data",
  name: "sharingData",
  type: "json",
  required: true,
  default: "{}",
  description: "Sharing configuration in JSON format",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["shareItem", "updateSharingRights"],
    },
  },
};

// Update data field
const updateDataField: INodeProperties = {
  displayName: "Update Data",
  name: "updateData",
  type: "json",
  required: true,
  default: "{}",
  description: "Update data in JSON format",
  displayOptions: {
    show: {
      resource: ["disk"],
      operation: ["updateFolder"],
    },
  },
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
      resource: ["disk"],
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
      displayName: "Start",
      name: "start",
      type: "number",
      default: 0,
      description: "Start position for pagination",
    },
    {
      displayName: "Limit",
      name: "limit",
      type: "number",
      default: 50,
      description: "Maximum number of items to return",
    },
  ],
};

// Export operations
export const diskOperations = [
  // Basic file operations
  {
    name: "Upload File",
    value: "uploadFile",
    description: "Upload file (disk.file.uploadfile)",
    action: "Upload file",
  },
  {
    name: "Download File",
    value: "downloadFile",
    description: "Download file (disk.file.get)",
    action: "Download file",
  },
  {
    name: "Delete File",
    value: "deleteFile",
    description: "Delete file (disk.file.delete)",
    action: "Delete file",
  },
  {
    name: "Get File Info",
    value: "getFileInfo",
    description: "Get file info (disk.file.get)",
    action: "Get file info",
  },
  {
    name: "List Files",
    value: "listFiles",
    description: "List files (disk.folder.getchildren)",
    action: "List files",
  },

  // Basic folder operations
  {
    name: "Create Folder",
    value: "createFolder",
    description: "Create folder (disk.folder.addfolder)",
    action: "Create folder",
  },
  {
    name: "Delete Folder",
    value: "deleteFolder",
    description: "Delete folder (disk.folder.delete)",
    action: "Delete folder",
  },

  // Storage operations
  {
    name: "Get Storage Info",
    value: "getStorageInfo",
    description: "Get storage info (disk.storage.get)",
    action: "Get storage info",
  },
  {
    name: "Get Storages",
    value: "getStorages",
    description: "Get storages (disk.storage.getlist)",
    action: "Get storages",
  },
  {
    name: "Get Storage",
    value: "getStorage",
    description: "Get storage (disk.storage.get)",
    action: "Get storage",
  },

  // Advanced folder operations
  {
    name: "Get Folders",
    value: "getFolders",
    description: "Get folders (disk.folder.getchildren)",
    action: "Get folders",
  },
  {
    name: "Get Folder",
    value: "getFolder",
    description: "Get folder (disk.folder.get)",
    action: "Get folder",
  },
  {
    name: "Add Folder",
    value: "addFolder",
    description: "Add folder (disk.folder.addfolder)",
    action: "Add folder",
  },
  {
    name: "Update Folder",
    value: "updateFolder",
    description: "Update folder (disk.folder.update)",
    action: "Update folder",
  },
  {
    name: "Copy Folder",
    value: "copyFolder",
    description: "Copy folder (disk.folder.copyfolder)",
    action: "Copy folder",
  },
  {
    name: "Move Folder",
    value: "moveFolder",
    description: "Move folder (disk.folder.movefolder)",
    action: "Move folder",
  },
  {
    name: "Rename Folder",
    value: "renameFolder",
    description: "Rename folder (disk.folder.rename)",
    action: "Rename folder",
  },

  // Advanced file operations
  {
    name: "Get Files",
    value: "getFiles",
    description: "Get files (disk.folder.getchildren)",
    action: "Get files",
  },
  {
    name: "Get File",
    value: "getFile",
    description: "Get file (disk.file.get)",
    action: "Get file",
  },
  {
    name: "Copy File",
    value: "copyFile",
    description: "Copy file (disk.file.copyfile)",
    action: "Copy file",
  },
  {
    name: "Move File",
    value: "moveFile",
    description: "Move file (disk.file.movefile)",
    action: "Move file",
  },
  {
    name: "Rename File",
    value: "renameFile",
    description: "Rename file (disk.file.rename)",
    action: "Rename file",
  },

  // Sharing operations
  {
    name: "Share Item",
    value: "shareItem",
    description: "Share item (disk.file.share)",
    action: "Share item",
  },
  {
    name: "Get Shared Items",
    value: "getSharedItems",
    description: "Get shared items (disk.file.getsharedfiles)",
    action: "Get shared items",
  },
  {
    name: "Get Sharing Rights",
    value: "getSharingRights",
    description: "Get sharing rights (disk.file.getsharingrights)",
    action: "Get sharing rights",
  },
  {
    name: "Update Sharing Rights",
    value: "updateSharingRights",
    description: "Update sharing rights (disk.file.updatesharingrights)",
    action: "Update sharing rights",
  },
];

export const diskFields: INodeProperties[] = [
  operationField,
  storageIdField,
  folderIdField,
  parentFolderIdField,
  fileIdField,
  itemIdField,
  folderNameField,
  newNameField,
  destinationFolderIdField,
  binaryPropertyField,
  fileNameField,
  sharingDataField,
  updateDataField,
  optionsCollection,
];

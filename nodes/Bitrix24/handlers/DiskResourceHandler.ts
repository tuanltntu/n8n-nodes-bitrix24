import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
  IBinaryData,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handles Disk operations in Bitrix24
 */
export class DiskResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    storage: {
      list: "disk.storage.getlist",
      get: "disk.storage.get",
    },
    folder: {
      list: "disk.folder.getchildren",
      get: "disk.folder.get",
      add: "disk.folder.addsubfolder",
      update: "disk.folder.update",
      delete: "disk.folder.deletefolder",
      copy: "disk.folder.copyto",
      move: "disk.folder.moveto",
      rename: "disk.folder.rename",
    },
    file: {
      list: "disk.folder.getfiles",
      get: "disk.file.get",
      add: "disk.file.uploadfile",
      download: "disk.file.download",
      delete: "disk.file.delete",
      copy: "disk.file.copyto",
      move: "disk.file.moveto",
      rename: "disk.file.rename",
    },
    sharing: {
      share: "disk.sharing.add",
      list: "disk.sharing.getlist",
      get: "disk.sharing.get",
      update: "disk.sharing.update",
    },
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process all items with disk operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
      try {
        const operation = this.getNodeParameter(
          "operation",
          itemIndex
        ) as string;

        switch (operation) {
          // New operations matching DiskDescription
          case "uploadFile":
            await this.handleUploadFile(itemIndex);
            break;
          case "downloadFile":
            await this.handleDownloadFile(itemIndex);
            break;
          case "deleteFile":
            await this.handleDeleteFile(itemIndex);
            break;
          case "getFileInfo":
            await this.handleGetFile(itemIndex);
            break;
          case "listFiles":
            await this.handleGetFiles(itemIndex);
            break;
          case "createFolder":
            await this.handleAddFolder(itemIndex);
            break;
          case "deleteFolder":
            await this.handleDeleteFolder(itemIndex);
            break;
          case "getStorageInfo":
            await this.handleGetStorage(itemIndex);
            break;

          // Legacy operations for backward compatibility
          case "getStorages":
            await this.handleGetStorages(itemIndex);
            break;
          case "getStorage":
            await this.handleGetStorage(itemIndex);
            break;
          case "getFolders":
            await this.handleGetFolders(itemIndex);
            break;
          case "getFolder":
            await this.handleGetFolder(itemIndex);
            break;
          case "addFolder":
            await this.handleAddFolder(itemIndex);
            break;
          case "updateFolder":
            await this.handleUpdateFolder(itemIndex);
            break;
          case "copyFolder":
            await this.handleCopyFolder(itemIndex);
            break;
          case "moveFolder":
            await this.handleMoveFolder(itemIndex);
            break;
          case "renameFolder":
            await this.handleRenameFolder(itemIndex);
            break;
          case "getFiles":
            await this.handleGetFiles(itemIndex);
            break;
          case "getFile":
            await this.handleGetFile(itemIndex);
            break;
          case "copyFile":
            await this.handleCopyFile(itemIndex);
            break;
          case "moveFile":
            await this.handleMoveFile(itemIndex);
            break;
          case "renameFile":
            await this.handleRenameFile(itemIndex);
            break;
          case "shareItem":
            await this.handleShareItem(itemIndex);
            break;
          case "getSharedItems":
            await this.handleGetSharedItems(itemIndex);
            break;
          case "getSharingRights":
            await this.handleGetSharingRights(itemIndex);
            break;
          case "updateSharingRights":
            await this.handleUpdateSharingRights(itemIndex);
            break;

          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Operation ${operation} is not supported for resource disk`
            );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          this.addErrorToReturnData(error, itemIndex);
        } else {
          throw error;
        }
      }
    }

    return this.returnData;
  }

  /**
   * Handle 'getStorages' operation
   */
  private async handleGetStorages(itemIndex: number): Promise<void> {
    const endpoint = this.resourceEndpoints.storage.list;
    const responseData = await this.makeApiCall(endpoint, {}, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getStorage' operation
   */
  private async handleGetStorage(itemIndex: number): Promise<void> {
    const storageId = this.getNodeParameter("storageId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: storageId,
    };

    const endpoint = this.resourceEndpoints.storage.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getFolders' operation
   */
  private async handleGetFolders(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: folderId,
      filter: { TYPE: "folder" },
    };

    const endpoint = this.resourceEndpoints.folder.list;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getFolder' operation
   */
  private async handleGetFolder(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: folderId,
    };

    const endpoint = this.resourceEndpoints.folder.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'addFolder' operation
   */
  private async handleAddFolder(itemIndex: number): Promise<void> {
    const parentFolderId = this.getNodeParameter(
      "parentFolderId",
      itemIndex
    ) as string;
    const folderName = this.getNodeParameter("folderName", itemIndex) as string;

    const requestParams: IDataObject = {
      id: parentFolderId,
      data: {
        NAME: folderName,
      },
    };

    const endpoint = this.resourceEndpoints.folder.add;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'updateFolder' operation
   */
  private async handleUpdateFolder(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;
    const updateFieldsJson = this.getNodeParameter(
      "updateFields",
      itemIndex
    ) as string;

    if (!updateFieldsJson || updateFieldsJson.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Update fields must not be empty",
        { itemIndex }
      );
    }

    const fields = this.parseJsonParameter(
      updateFieldsJson,
      "updateFields",
      itemIndex
    );

    const requestParams: IDataObject = {
      id: folderId,
      fields,
    };

    const endpoint = this.resourceEndpoints.folder.update;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'deleteFolder' operation
   */
  private async handleDeleteFolder(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: folderId,
    };

    const endpoint = this.resourceEndpoints.folder.delete;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'copyFolder' operation
   */
  private async handleCopyFolder(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;
    const targetFolderId = this.getNodeParameter(
      "targetFolderId",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      id: folderId,
      targetFolderId,
    };

    const endpoint = this.resourceEndpoints.folder.copy;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'moveFolder' operation
   */
  private async handleMoveFolder(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;
    const targetFolderId = this.getNodeParameter(
      "targetFolderId",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      id: folderId,
      targetFolderId,
    };

    const endpoint = this.resourceEndpoints.folder.move;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'renameFolder' operation
   */
  private async handleRenameFolder(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;
    const folderName = this.getNodeParameter("folderName", itemIndex) as string;

    const requestParams: IDataObject = {
      id: folderId,
      newName: folderName,
    };

    const endpoint = this.resourceEndpoints.folder.rename;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getFiles' operation
   */
  private async handleGetFiles(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: folderId,
    };

    const endpoint = this.resourceEndpoints.file.list;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getFile' operation
   */
  private async handleGetFile(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: fileId,
    };

    const endpoint = this.resourceEndpoints.file.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'uploadFile' operation
   */
  private async handleUploadFile(itemIndex: number): Promise<void> {
    const folderId = this.getNodeParameter("folderId", itemIndex) as string;
    const binaryPropertyName = this.getNodeParameter(
      "binaryPropertyName",
      itemIndex
    ) as string;

    // Ensure binary data exists
    if (
      !this.items[itemIndex].binary ||
      !this.items[itemIndex].binary[binaryPropertyName]
    ) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `No binary data property "${binaryPropertyName}" exists on item!`,
        { itemIndex }
      );
    }

    const binaryData = this.items[itemIndex].binary[binaryPropertyName];
    const fileName = binaryData.fileName || "file";

    const requestParams: IDataObject = {
      id: folderId,
      fileContent: {
        name: fileName,
        data: binaryData.data,
        contentType: binaryData.mimeType,
      },
    };

    const endpoint = this.resourceEndpoints.file.add;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      { uploadFile: true },
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'downloadFile' operation
   */
  private async handleDownloadFile(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;
    const binaryPropertyName = this.getNodeParameter(
      "binaryPropertyName",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      id: fileId,
    };

    // Make API call to download the file
    const endpoint = this.resourceEndpoints.file.download;
    const response = await this.makeApiCall(
      endpoint,
      requestParams,
      { returnBinary: true },
      itemIndex
    );

    // Add the binary data to the return data
    const newItem: INodeExecutionData = {
      json: { ...this.items[itemIndex].json },
      binary: {
        ...(this.items[itemIndex].binary || {}),
      },
    };

    if (response.fileName && response.fileContent) {
      newItem.binary![binaryPropertyName] = {
        data: response.fileContent,
        mimeType: response.mimeType || "application/octet-stream",
        fileName: response.fileName,
      } as IBinaryData;
    }

    // Replace the item at the given index with the new item
    this.returnData[itemIndex] = newItem;
  }

  /**
   * Handle 'deleteFile' operation
   */
  private async handleDeleteFile(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: fileId,
    };

    const endpoint = this.resourceEndpoints.file.delete;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'copyFile' operation
   */
  private async handleCopyFile(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;
    const targetFolderId = this.getNodeParameter(
      "targetFolderId",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      id: fileId,
      targetFolderId,
    };

    const endpoint = this.resourceEndpoints.file.copy;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'moveFile' operation
   */
  private async handleMoveFile(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;
    const targetFolderId = this.getNodeParameter(
      "targetFolderId",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      id: fileId,
      targetFolderId,
    };

    const endpoint = this.resourceEndpoints.file.move;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'renameFile' operation
   */
  private async handleRenameFile(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;
    const newFileName = this.getNodeParameter(
      "newFileName",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      id: fileId,
      newName: newFileName,
    };

    const endpoint = this.resourceEndpoints.file.rename;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'shareItem' operation
   */
  private async handleShareItem(itemIndex: number): Promise<void> {
    const itemType = this.getNodeParameter("itemType", itemIndex) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;
    const shareWithJson = this.getNodeParameter(
      "shareWith",
      itemIndex
    ) as string;
    const rights = this.getNodeParameter("rights", itemIndex) as string;

    if (!shareWithJson || shareWithJson.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Share with must not be empty",
        { itemIndex }
      );
    }

    const shareWith = this.parseJsonParameter(
      shareWithJson,
      "shareWith",
      itemIndex
    );

    const requestParams: IDataObject = {
      type: itemType,
      id: itemId,
      users: shareWith,
      rights,
    };

    const endpoint = this.resourceEndpoints.sharing.share;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getSharedItems' operation
   */
  private async handleGetSharedItems(itemIndex: number): Promise<void> {
    const endpoint = this.resourceEndpoints.sharing.list;
    const responseData = await this.makeApiCall(endpoint, {}, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getSharingRights' operation
   */
  private async handleGetSharingRights(itemIndex: number): Promise<void> {
    const itemType = this.getNodeParameter("itemType", itemIndex) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;

    const requestParams: IDataObject = {
      type: itemType,
      id: itemId,
    };

    const endpoint = this.resourceEndpoints.sharing.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'updateSharingRights' operation
   */
  private async handleUpdateSharingRights(itemIndex: number): Promise<void> {
    const itemType = this.getNodeParameter("itemType", itemIndex) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;
    const shareWithJson = this.getNodeParameter(
      "shareWith",
      itemIndex
    ) as string;
    const rights = this.getNodeParameter("rights", itemIndex) as string;

    if (!shareWithJson || shareWithJson.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Share with must not be empty",
        { itemIndex }
      );
    }

    const shareWith = this.parseJsonParameter(
      shareWithJson,
      "shareWith",
      itemIndex
    );

    const requestParams: IDataObject = {
      type: itemType,
      id: itemId,
      users: shareWith,
      rights,
    };

    const endpoint = this.resourceEndpoints.sharing.update;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

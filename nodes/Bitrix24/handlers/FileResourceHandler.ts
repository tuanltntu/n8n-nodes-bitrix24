import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
  IBinaryKeyData,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";
import {
  validateBinaryDataExists,
  bitrix24DownloadFile,
} from "../GenericFunctions";

/**
 * Xử lý các tác vụ File của Bitrix24
 */
export class FileResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    upload: "disk.storage.uploadfile",
    uploadToEntity: {
      contact: "crm.contact.update.file",
      company: "crm.company.update.file",
      deal: "crm.deal.update.file",
      lead: "crm.lead.update.file",
      task: "tasks.task.update.file",
      chat: "im.disk.file.upload",
    },
    get: "disk.file.get",
    list: "disk.file.list",
    delete: "disk.file.delete",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Xử lý tác vụ File
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "upload":
            await this.handleUpload(i);
            break;
          case "get":
            await this.handleGet(i);
            break;
          case "getAll":
            await this.handleGetAll(i);
            break;
          case "delete":
            await this.handleDelete(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Không hỗ trợ tác vụ "${operation}" cho File`,
              { itemIndex: i }
            );
        }
      } catch (error) {
        if (this.executeFunctions.continueOnFail()) {
          this.returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return this.returnData;
  }

  /**
   * Xử lý tham số tùy chỉnh
   */
  private processCustomParameters(
    options: IDataObject,
    params: IDataObject,
    itemIndex: number
  ): void {
    if (!options.customParameters) return;

    try {
      const customParams =
        typeof options.customParameters === "string"
          ? this.parseJsonParameter(
              options.customParameters as string,
              "Custom parameters phải là JSON hợp lệ",
              itemIndex
            )
          : options.customParameters;

      Object.assign(params, customParams);
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Custom parameters phải là JSON hợp lệ",
        { itemIndex }
      );
    }
  }

  /**
   * Xử lý 'upload'
   */
  private async handleUpload(itemIndex: number): Promise<void> {
    const binaryPropertyName = this.getNodeParameter(
      "binaryPropertyName",
      itemIndex
    ) as string;
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;

    // Kiểm tra tồn tại dữ liệu nhị phân
    validateBinaryDataExists(
      this.executeFunctions.helpers,
      this.items[itemIndex],
      binaryPropertyName
    );

    // Lấy nội dung file
    const binaryData = this.items[itemIndex].binary as IBinaryKeyData;
    const binaryContent =
      await this.executeFunctions.helpers.getBinaryDataBuffer(
        itemIndex,
        binaryPropertyName
      );

    // Xác định endpoint dựa trên loại entity
    let endpoint = "";
    let formData: IDataObject = {};

    // Lấy options nếu có
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    if (entityType === "disk") {
      // Upload lên disk storage
      const folderId = this.getNodeParameter("folderId", itemIndex) as string;
      endpoint = this.resourceEndpoints.upload;
      formData = {
        id: folderId,
      };
    } else {
      // Upload cho một entity cụ thể
      const entityId = this.getNodeParameter("entityId", itemIndex) as string;

      if (!this.resourceEndpoints.uploadToEntity[entityType]) {
        throw new Error(`Không hỗ trợ loại entity: ${entityType}`);
      }

      endpoint = this.resourceEndpoints.uploadToEntity[entityType];
      formData = {
        ID: entityId,
        ELEMENT_ID: entityId,
      };
    }

    // Thiết lập form data cho upload file
    formData.NAME = binaryData[binaryPropertyName].fileName || "file";
    formData.CONTENT = binaryContent;

    // Thêm custom parameters nếu có
    this.processCustomParameters(options, formData, itemIndex);

    // Gọi API
    const responseData = await this.makeApiCall(
      endpoint,
      {},
      formData,
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'get'
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;
    const download = this.getNodeParameter(
      "download",
      itemIndex,
      false
    ) as boolean;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const queryParams: IDataObject = { id: fileId };
    this.processCustomParameters(options, queryParams, itemIndex);

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.get,
      {},
      queryParams,
      itemIndex
    );

    // Nếu có yêu cầu download và có URL download trong phản hồi
    if (download && responseData?.result?.DOWNLOAD_URL) {
      const binaryPropertyName = this.getNodeParameter(
        "binaryPropertyName",
        itemIndex
      ) as string;
      const downloadUrl = responseData.result.DOWNLOAD_URL as string;
      const fileName = responseData.result.NAME as string;

      // Tải file
      const fileData = await bitrix24DownloadFile.call(
        this.executeFunctions,
        downloadUrl
      );
      const binaryData = await this.executeFunctions.helpers.prepareBinaryData(
        fileData as Buffer,
        fileName
      );

      // Tạo bản sao của item với dữ liệu nhị phân
      const newItem: INodeExecutionData = {
        json: responseData.result as IDataObject,
        binary: {
          [binaryPropertyName]: binaryData,
        },
      };

      this.addResponseToReturnData([newItem], itemIndex);
    } else {
      // Chỉ trả về thông tin file mà không download
      this.addResponseToReturnData(
        this.executeFunctions.helpers.returnJsonArray(
          responseData.result as IDataObject
        ),
        itemIndex
      );
    }
  }

  /**
   * Xử lý 'getAll'
   */
  private async handleGetAll(itemIndex: number): Promise<void> {
    const returnAll = this.getNodeParameter("returnAll", itemIndex) as boolean;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    // Xây dựng tham số lọc
    const queryParams: IDataObject = {};

    if (options.entityType && options.entityId) {
      const entityId = options.entityId;

      switch (options.entityType as string) {
        case "contact":
          queryParams.filter = { CONTACT_ID: entityId };
          break;
        case "company":
          queryParams.filter = { COMPANY_ID: entityId };
          break;
        case "deal":
          queryParams.filter = { DEAL_ID: entityId };
          break;
        case "lead":
          queryParams.filter = { LEAD_ID: entityId };
          break;
        case "task":
          queryParams.filter = { TASK_ID: entityId };
          break;
        case "disk":
          queryParams.filter = { FOLDER_ID: entityId };
          break;
      }
    }

    if (options.order) {
      queryParams.order = { DATE_CREATE: options.order };
    }

    // Thêm custom parameters nếu có
    this.processCustomParameters(options, queryParams, itemIndex);

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.list,
      {},
      queryParams,
      itemIndex,
      returnAll
    );

    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Xử lý 'delete'
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const queryParams: IDataObject = { id: fileId };
    this.processCustomParameters(options, queryParams, itemIndex);

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.delete,
      {},
      queryParams,
      itemIndex
    );

    this.addResponseToReturnData(
      this.executeFunctions.helpers.returnJsonArray({
        success: responseData.result,
      } as IDataObject),
      itemIndex
    );
  }
}

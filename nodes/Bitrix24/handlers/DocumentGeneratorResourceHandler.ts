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
 * Handles Document Generator operations in Bitrix24
 */
export class DocumentGeneratorResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    template: {
      list: "documentgenerator.template.list",
      get: "documentgenerator.template.get",
      add: "documentgenerator.template.add",
      update: "documentgenerator.template.update",
      delete: "documentgenerator.template.delete",
    },
    document: {
      get: "documentgenerator.document.get",
      add: "documentgenerator.document.add",
      delete: "documentgenerator.document.delete",
      download: "documentgenerator.document.download",
    },
    fields: {
      get: "documentgenerator.template.getFields",
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
   * Process all items with document generator operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
      try {
        const operation = this.getNodeParameter(
          "operation",
          itemIndex
        ) as string;

        switch (operation) {
          // Template operations
          case "getTemplates":
            await this.handleGetTemplates(itemIndex);
            break;
          case "getTemplate":
            await this.handleGetTemplate(itemIndex);
            break;
          case "addTemplate":
            await this.handleAddTemplate(itemIndex);
            break;
          case "updateTemplate":
            await this.handleUpdateTemplate(itemIndex);
            break;
          case "deleteTemplate":
            await this.handleDeleteTemplate(itemIndex);
            break;

          // Document operations
          case "generateDocument":
            await this.handleGenerateDocument(itemIndex);
            break;
          case "getDocument":
            await this.handleGetDocument(itemIndex);
            break;
          case "deleteDocument":
            await this.handleDeleteDocument(itemIndex);
            break;
          case "downloadDocument":
            await this.handleDownloadDocument(itemIndex);
            break;

          // Field operations
          case "getFields":
            await this.handleGetFields(itemIndex);
            break;

          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Operation ${operation} is not supported for resource documentgenerator`
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
   * Handle 'getTemplates' operation
   */
  private async handleGetTemplates(itemIndex: number): Promise<void> {
    const filter = this.getNodeParameter(
      "filter",
      itemIndex,
      {}
    ) as IDataObject;
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const requestParams: IDataObject = {};

    if (Object.keys(filter).length) {
      requestParams.filter = filter;
    }

    if (options.select) {
      requestParams.select = options.select;
    }

    if (options.order) {
      if (typeof options.order === "string" && options.order.trim() !== "") {
        requestParams.order = this.parseJsonParameter(
          options.order as string,
          "order",
          itemIndex
        );
      } else if (typeof options.order === "object") {
        requestParams.order = options.order;
      }
    }

    const endpoint = this.resourceEndpoints.template.list;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getTemplate' operation
   */
  private async handleGetTemplate(itemIndex: number): Promise<void> {
    const templateId = this.getNodeParameter("templateId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: templateId,
    };

    const endpoint = this.resourceEndpoints.template.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'addTemplate' operation
   */
  private async handleAddTemplate(itemIndex: number): Promise<void> {
    const templateData = this.getNodeParameter(
      "templateData",
      itemIndex
    ) as string;

    if (!templateData || templateData.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Template data must not be empty",
        { itemIndex }
      );
    }

    const fields = this.parseJsonParameter(
      templateData,
      "templateData",
      itemIndex
    );

    const requestParams: IDataObject = {
      fields,
    };

    const endpoint = this.resourceEndpoints.template.add;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'updateTemplate' operation
   */
  private async handleUpdateTemplate(itemIndex: number): Promise<void> {
    const templateId = this.getNodeParameter("templateId", itemIndex) as string;
    const templateData = this.getNodeParameter(
      "templateData",
      itemIndex
    ) as string;

    if (!templateData || templateData.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Template data must not be empty",
        { itemIndex }
      );
    }

    const fields = this.parseJsonParameter(
      templateData,
      "templateData",
      itemIndex
    );

    const requestParams: IDataObject = {
      id: templateId,
      fields,
    };

    const endpoint = this.resourceEndpoints.template.update;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'deleteTemplate' operation
   */
  private async handleDeleteTemplate(itemIndex: number): Promise<void> {
    const templateId = this.getNodeParameter("templateId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: templateId,
    };

    const endpoint = this.resourceEndpoints.template.delete;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'generateDocument' operation
   */
  private async handleGenerateDocument(itemIndex: number): Promise<void> {
    const templateId = this.getNodeParameter("templateId", itemIndex) as string;
    const valuesJson = this.getNodeParameter("values", itemIndex) as string;
    const format = this.getNodeParameter("format", itemIndex) as string;

    if (!valuesJson || valuesJson.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Values must not be empty",
        { itemIndex }
      );
    }

    const values = this.parseJsonParameter(valuesJson, "values", itemIndex);

    const requestParams: IDataObject = {
      templateId,
      values,
      format,
    };

    const endpoint = this.resourceEndpoints.document.add;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getDocument' operation
   */
  private async handleGetDocument(itemIndex: number): Promise<void> {
    const documentId = this.getNodeParameter("documentId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: documentId,
    };

    const endpoint = this.resourceEndpoints.document.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'deleteDocument' operation
   */
  private async handleDeleteDocument(itemIndex: number): Promise<void> {
    const documentId = this.getNodeParameter("documentId", itemIndex) as string;

    const requestParams: IDataObject = {
      id: documentId,
    };

    const endpoint = this.resourceEndpoints.document.delete;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'downloadDocument' operation
   */
  private async handleDownloadDocument(itemIndex: number): Promise<void> {
    const documentId = this.getNodeParameter("documentId", itemIndex) as string;
    const binaryPropertyName = this.getNodeParameter(
      "binaryPropertyName",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      id: documentId,
    };

    // Make API call to download the document
    const endpoint = this.resourceEndpoints.document.download;
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
   * Handle 'getFields' operation
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const moduleId = this.getNodeParameter("moduleId", itemIndex) as string;
    const entityTypeName = this.getNodeParameter(
      "entityTypeName",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      moduleId,
      entityTypeName,
    };

    const endpoint = this.resourceEndpoints.fields.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

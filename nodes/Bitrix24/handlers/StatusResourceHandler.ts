import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";
import { makeStandardBitrix24Call } from "../GenericFunctions";

/**
 * Handler for Status resource operations in Bitrix24
 */
export class StatusResourceHandler extends ResourceHandlerBase {
  private resourceEndpoints = {
    create: "crm.status.add",
    update: "crm.status.update",
    delete: "crm.status.delete",
    get: "crm.status.get",
    getAll: "crm.status.list",
    getFields: "crm.status.fields",
  };

  /**
   * Process all operations related to Status
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "create":
            await this.handleCreate(i);
            break;
          case "update":
            await this.handleUpdate(i);
            break;
          case "delete":
            await this.handleDelete(i);
            break;
          case "get":
            await this.handleGet(i);
            break;
          case "getAll":
            await this.handleGetAll(i);
            break;
          case "getFields":
            await this.handleGetFields(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Operation '${operation}' is not supported for Status resource`,
              { itemIndex: i }
            );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          this.addErrorToReturnData(error, i);
          continue;
        }
        throw error;
      }
    }

    return this.returnData;
  }

  /**
   * Handles the creation of a new status
   */
  private async handleCreate(itemIndex: number): Promise<void> {
    const fields = this.getNodeParameter(
      "fields",
      itemIndex,
      {}
    ) as IDataObject;

    // Validate required fields
    if (!fields.ENTITY_ID || fields.ENTITY_ID === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity ID is required for creating a status",
        { itemIndex }
      );
    }

    if (!fields.STATUS_ID || fields.STATUS_ID === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Status ID is required for creating a status",
        { itemIndex }
      );
    }

    if (!fields.NAME || fields.NAME === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Name is required for creating a status",
        { itemIndex }
      );
    }

    // Build the request body according to Bitrix24 API
    const parameters: IDataObject = {
      fields: {
        ENTITY_ID: fields.ENTITY_ID,
        STATUS_ID: fields.STATUS_ID,
        NAME: fields.NAME,
        SORT: fields.SORT || 100,
      },
    };

    // Add extra parameters if provided
    if (fields.EXTRA) {
      try {
        const extra =
          typeof fields.EXTRA === "string"
            ? JSON.parse(fields.EXTRA as string)
            : fields.EXTRA;
        (parameters.fields as IDataObject).EXTRA = extra;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "EXTRA field must be valid JSON",
          { itemIndex }
        );
      }
    }

    const endpoint = this.resourceEndpoints.create;
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      parameters,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles updating a status
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const statusId = this.getNodeParameter("statusId", itemIndex) as string;
    const fields = this.getNodeParameter(
      "fields",
      itemIndex,
      {}
    ) as IDataObject;

    // Build the request body according to Bitrix24 API
    const parameters: IDataObject = {
      id: statusId,
      fields: {},
    };

    const paramFields = parameters.fields as IDataObject;

    // Add only the fields that are provided
    if (fields.NAME) paramFields.NAME = fields.NAME;
    if (fields.SORT !== undefined) paramFields.SORT = fields.SORT;

    if (fields.EXTRA) {
      try {
        const extra =
          typeof fields.EXTRA === "string"
            ? JSON.parse(fields.EXTRA as string)
            : fields.EXTRA;
        paramFields.EXTRA = extra;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "EXTRA field must be valid JSON",
          { itemIndex }
        );
      }
    }

    const endpoint = this.resourceEndpoints.update;
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      parameters,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles the deletion of a status
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const statusId = this.getNodeParameter("statusId", itemIndex) as string;

    const parameters: IDataObject = {
      id: statusId,
    };

    const endpoint = this.resourceEndpoints.delete;
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      parameters,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles retrieving a single status
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const statusId = this.getNodeParameter("statusId", itemIndex) as string;

    const parameters: IDataObject = {
      id: statusId,
    };

    const endpoint = this.resourceEndpoints.get;
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      parameters,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles retrieving all statuses
   */
  private async handleGetAll(itemIndex: number): Promise<void> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const parameters: IDataObject = {};

    // Add entity ID filter if specified
    if (options.entityId) {
      parameters.filter = {
        ENTITY_ID: options.entityId,
      };
    }

    // Add filter if specified
    if (options.filter) {
      try {
        const filterJson =
          typeof options.filter === "string"
            ? JSON.parse(options.filter)
            : options.filter;
        if (parameters.filter) {
          Object.assign(parameters.filter, filterJson as IDataObject);
        } else {
          parameters.filter = filterJson as IDataObject;
        }
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Filter must be valid JSON",
          { itemIndex }
        );
      }
    }

    // Add order if specified
    if (options.order) {
      try {
        const orderJson =
          typeof options.order === "string"
            ? JSON.parse(options.order)
            : options.order;
        parameters.order = orderJson;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Order must be valid JSON",
          { itemIndex }
        );
      }
    }

    // Add select fields if specified
    if (options.select) {
      parameters.select = (options.select as string)
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field.length > 0);
    }

    // Add language if specified
    if (options.lang) {
      parameters.lang = options.lang;
    }

    // Add custom parameters if specified
    if (options.customParameters) {
      try {
        const customParams =
          typeof options.customParameters === "string"
            ? JSON.parse(options.customParameters)
            : options.customParameters;
        Object.assign(parameters, customParams);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Custom parameters must be valid JSON",
          { itemIndex }
        );
      }
    }

    const endpoint = this.resourceEndpoints.getAll;
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      parameters,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles getting status fields
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const endpoint = this.resourceEndpoints.getFields;
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      {},
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

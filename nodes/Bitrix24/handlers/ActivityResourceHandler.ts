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
 * Handle Bitrix24 CRM Activity operations
 */
export class ActivityResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    add: "crm.activity.add",
    update: "crm.activity.update",
    delete: "crm.activity.delete",
    get: "crm.activity.get",
    list: "crm.activity.list",
    fields: "crm.activity.fields",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process activity operations
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
              `Unsupported operation "${operation}" for Activity resource`,
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
   * Get endpoint for the specified operation
   */
  private getEndpoint(operation: string): string {
    const endpointMap = {
      create: "add",
      update: "update",
      delete: "delete",
      get: "get",
      getAll: "list",
      getFields: "fields",
    };

    const endpoint = this.resourceEndpoints[endpointMap[operation]];
    if (!endpoint) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Unsupported operation "${operation}" for Activity resource`
      );
    }

    return endpoint;
  }

  /**
   * Format communications array for Bitrix24 API
   */
  private formatCommunications(communications: IDataObject[]): IDataObject[] {
    if (!Array.isArray(communications) || communications.length === 0) {
      return [];
    }

    return communications.map((comm) => {
      const { type, value } = comm.communicationValues as IDataObject;
      return {
        TYPE: type,
        VALUE: value,
      };
    });
  }

  /**
   * Handle getting activity fields
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const endpoint = this.getEndpoint("getFields");

    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      {},
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle creating an activity
   */
  private async handleCreate(itemIndex: number): Promise<void> {
    const fields: IDataObject = {};

    // Get main fields
    fields.SUBJECT = this.getNodeParameter("subject", itemIndex) as string;
    fields.OWNER_TYPE_ID = this.getNodeParameter(
      "ownerType",
      itemIndex
    ) as string;
    fields.OWNER_ID = this.getNodeParameter("ownerId", itemIndex) as string;
    fields.TYPE_ID = this.getNodeParameter("type", itemIndex) as string;

    // Get optional fields
    const direction = this.getNodeParameter(
      "direction",
      itemIndex,
      null
    ) as string;
    if (direction) {
      fields.DIRECTION = direction;
    }

    const startTime = this.getNodeParameter("startTime", itemIndex, null);
    if (startTime) {
      fields.START_TIME = startTime;
    }

    const endTime = this.getNodeParameter("endTime", itemIndex, null);
    if (endTime) {
      fields.END_TIME = endTime;
    }

    const completed = this.getNodeParameter(
      "completed",
      itemIndex,
      false
    ) as boolean;
    fields.COMPLETED = completed ? "Y" : "N";

    const description = this.getNodeParameter(
      "description",
      itemIndex,
      null
    ) as string;
    if (description) {
      fields.DESCRIPTION = description;
    }

    const responsibleId = this.getNodeParameter(
      "responsibleId",
      itemIndex,
      null
    ) as string;
    if (responsibleId) {
      fields.RESPONSIBLE_ID = responsibleId;
    }

    const priority = this.getNodeParameter(
      "priority",
      itemIndex,
      null
    ) as string;
    if (priority) {
      fields.PRIORITY = priority;
    }

    const status = this.getNodeParameter("status", itemIndex, null) as string;
    if (status) {
      fields.STATUS = status;
    }

    // Handle additional fields
    const additionalFields = this.getNodeParameter(
      "additionalFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Process communications
    if (
      additionalFields.communications &&
      typeof additionalFields.communications === "object" &&
      (additionalFields.communications as IDataObject).communicationValues
    ) {
      const communications = (additionalFields.communications as IDataObject)
        .communicationValues as IDataObject[];

      if (Array.isArray(communications) && communications.length > 0) {
        fields.COMMUNICATIONS = this.formatCommunications(communications);
      }
    }

    // Set notify
    if (additionalFields.notify !== undefined) {
      fields.NOTIFY_TYPE = additionalFields.notify ? 1 : 0;
    }

    // Make API call
    const endpoint = this.getEndpoint("create");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      { fields },
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle updating an activity
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const activityId = this.getNodeParameter("activityId", itemIndex) as string;
    const fields: IDataObject = {};

    // Get main fields
    const subject = this.getNodeParameter("subject", itemIndex, null) as string;
    if (subject) {
      fields.SUBJECT = subject;
    }

    const type = this.getNodeParameter("type", itemIndex, null) as string;
    if (type) {
      fields.TYPE_ID = type;
    }

    // Get optional fields
    const direction = this.getNodeParameter(
      "direction",
      itemIndex,
      null
    ) as string;
    if (direction) {
      fields.DIRECTION = direction;
    }

    const startTime = this.getNodeParameter("startTime", itemIndex, null);
    if (startTime) {
      fields.START_TIME = startTime;
    }

    const endTime = this.getNodeParameter("endTime", itemIndex, null);
    if (endTime) {
      fields.END_TIME = endTime;
    }

    const completed = this.getNodeParameter("completed", itemIndex, null) as
      | boolean
      | null;
    if (completed !== null) {
      fields.COMPLETED = completed ? "Y" : "N";
    }

    const description = this.getNodeParameter(
      "description",
      itemIndex,
      null
    ) as string;
    if (description) {
      fields.DESCRIPTION = description;
    }

    const responsibleId = this.getNodeParameter(
      "responsibleId",
      itemIndex,
      null
    ) as string;
    if (responsibleId) {
      fields.RESPONSIBLE_ID = responsibleId;
    }

    const priority = this.getNodeParameter(
      "priority",
      itemIndex,
      null
    ) as string;
    if (priority) {
      fields.PRIORITY = priority;
    }

    const status = this.getNodeParameter("status", itemIndex, null) as string;
    if (status) {
      fields.STATUS = status;
    }

    // Handle additional fields
    const additionalFields = this.getNodeParameter(
      "additionalFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Process communications
    if (
      additionalFields.communications &&
      typeof additionalFields.communications === "object" &&
      (additionalFields.communications as IDataObject).communicationValues
    ) {
      const communications = (additionalFields.communications as IDataObject)
        .communicationValues as IDataObject[];

      if (Array.isArray(communications) && communications.length > 0) {
        fields.COMMUNICATIONS = this.formatCommunications(communications);
      }
    }

    // Set notify
    if (additionalFields.notify !== undefined) {
      fields.NOTIFY_TYPE = additionalFields.notify ? 1 : 0;
    }

    // Make API call
    const endpoint = this.getEndpoint("update");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      {
        id: activityId,
        fields,
      },
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle deleting an activity
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const activityId = this.getNodeParameter("activityId", itemIndex) as string;

    const endpoint = this.getEndpoint("delete");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      { id: activityId },
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }

  /**
   * Handle getting an activity
   */
  private async handleGet(itemIndex: number): Promise<void> {
    const activityId = this.getNodeParameter("activityId", itemIndex) as string;

    // Get options
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const params: IDataObject = { id: activityId };

    // Add select fields if specified
    if (options.select) {
      params.select = options.select;
    }

    const endpoint = this.getEndpoint("get");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle getting all activities
   */
  private async handleGetAll(itemIndex: number): Promise<void> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;
    const params: IDataObject = {};

    // Add filter if provided
    if (options.filter) {
      try {
        params.filter =
          typeof options.filter === "string"
            ? JSON.parse(options.filter as string)
            : options.filter;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Filter must be a valid JSON",
          { itemIndex }
        );
      }
    }

    // Add order if provided
    if (options.order) {
      try {
        params.order =
          typeof options.order === "string"
            ? JSON.parse(options.order as string)
            : options.order;
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Order must be a valid JSON",
          { itemIndex }
        );
      }
    }

    // Add select fields if specified
    if (options.select) {
      params.select = options.select;
    }

    const endpoint = this.getEndpoint("getAll");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({
      json: responseData,
    });
  }
}

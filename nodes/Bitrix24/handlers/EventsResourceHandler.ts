import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";
import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handles Events operations in Bitrix24
 */
export class EventsResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    handler: {
      register: "event.bind",
      unregister: "event.unbind",
      list: "event.get",
    },
    event: {
      send: "event.send",
      types: "event.types",
    },
    offline: {
      get: "event.offline.get",
      process: "event.offline.process",
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
   * Process all items with events operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
      try {
        const operation = this.getNodeParameter(
          "operation",
          itemIndex
        ) as string;

        switch (operation) {
          // Event handler operations
          case "registerHandler":
            await this.handleRegisterHandler(itemIndex);
            break;
          case "unregisterHandler":
            await this.handleUnregisterHandler(itemIndex);
            break;
          case "getHandlers":
            await this.handleGetHandlers(itemIndex);
            break;

          // Event sending operations
          case "sendEvent":
            await this.handleSendEvent(itemIndex);
            break;
          case "getEventTypes":
            await this.handleGetEventTypes(itemIndex);
            break;

          // Offline event operations
          case "getOfflineEvents":
            await this.handleGetOfflineEvents(itemIndex);
            break;
          case "processOfflineEvents":
            await this.handleProcessOfflineEvents(itemIndex);
            break;

          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Operation ${operation} is not supported for resource events`
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
   * Handle 'registerHandler' operation
   */
  private async handleRegisterHandler(itemIndex: number): Promise<void> {
    const eventName = this.getNodeParameter("eventName", itemIndex) as string;
    const handlerUrl = this.getNodeParameter("handlerUrl", itemIndex) as string;
    const authType = this.getNodeParameter("authType", itemIndex) as string;

    const requestParams: IDataObject = {
      event: eventName,
      handler: handlerUrl,
    };

    // Add authentication details if needed
    if (authType === "basic") {
      const username = this.getNodeParameter("username", itemIndex) as string;
      const password = this.getNodeParameter("password", itemIndex) as string;

      requestParams.auth = {
        type: "basic",
        username,
        password,
      };
    } else if (authType === "bearer") {
      const token = this.getNodeParameter("token", itemIndex) as string;

      requestParams.auth = {
        type: "bearer",
        token,
      };
    }

    const endpoint = this.resourceEndpoints.handler.register;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'unregisterHandler' operation
   */
  private async handleUnregisterHandler(itemIndex: number): Promise<void> {
    const eventName = this.getNodeParameter("eventName", itemIndex) as string;
    const handlerId = this.getNodeParameter("handlerId", itemIndex) as string;

    const requestParams: IDataObject = {
      event: eventName,
      handler_id: handlerId,
    };

    const endpoint = this.resourceEndpoints.handler.unregister;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getHandlers' operation
   */
  private async handleGetHandlers(itemIndex: number): Promise<void> {
    const filter = this.getNodeParameter(
      "filter",
      itemIndex,
      {}
    ) as IDataObject;

    const requestParams: IDataObject = {};

    if (Object.keys(filter).length) {
      requestParams.filter = filter;
    }

    const endpoint = this.resourceEndpoints.handler.list;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'sendEvent' operation
   */
  private async handleSendEvent(itemIndex: number): Promise<void> {
    const eventName = this.getNodeParameter("eventName", itemIndex) as string;
    const eventDataJson = this.getNodeParameter(
      "eventData",
      itemIndex
    ) as string;

    const eventData = this.parseJsonParameter(
      eventDataJson,
      "eventData",
      itemIndex
    );

    const requestParams: IDataObject = {
      event: eventName,
      data: eventData,
    };

    const endpoint = this.resourceEndpoints.event.send;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getEventTypes' operation
   */
  private async handleGetEventTypes(itemIndex: number): Promise<void> {
    const moduleId = this.getNodeParameter("moduleId", itemIndex, "") as string;

    const requestParams: IDataObject = {};

    if (moduleId) {
      requestParams.module_id = moduleId;
    }

    const endpoint = this.resourceEndpoints.event.types;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getOfflineEvents' operation
   */
  private async handleGetOfflineEvents(itemIndex: number): Promise<void> {
    const filter = this.getNodeParameter(
      "filter",
      itemIndex,
      {}
    ) as IDataObject;

    const requestParams: IDataObject = {};

    if (Object.keys(filter).length) {
      requestParams.filter = filter;
    }

    const endpoint = this.resourceEndpoints.offline.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'processOfflineEvents' operation
   */
  private async handleProcessOfflineEvents(itemIndex: number): Promise<void> {
    const eventIds = this.getNodeParameter("eventIds", itemIndex) as string;

    // Convert comma-separated string to array
    const ids = eventIds.split(",").map((id) => id.trim());

    const requestParams: IDataObject = {
      id: ids,
    };

    const endpoint = this.resourceEndpoints.offline.process;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

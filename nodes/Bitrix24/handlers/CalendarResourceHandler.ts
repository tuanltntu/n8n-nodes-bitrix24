import {
  IExecuteFunctions,
  INodeExecutionData,
  IDataObject,
  NodeOperationError,
} from "n8n-workflow";
import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Class handling Calendar-related resources in Bitrix24
 */
export class CalendarResourceHandler extends ResourceHandlerBase {
  private resourceEndpoints = {
    // Regular calendar operations
    getEvents: "calendar.event.get",
    getEvent: "calendar.event.get",
    addEvent: "calendar.event.add",
    updateEvent: "calendar.event.update",
    deleteEvent: "calendar.event.delete",
    getMeetingStatus: "calendar.meeting.status.get",
    setMeetingStatus: "calendar.meeting.status.set",
    getAccessibility: "calendar.accessibility.get",
    getSections: "calendar.section.get",
    addSection: "calendar.section.add",
    updateSection: "calendar.section.update",
    deleteSection: "calendar.section.delete",
    // Full event sync operation
    syncEvents: "calendar.event.get.sync",
  };

  /**
   * Constructor for CalendarResourceHandler
   */
  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Processes Calendar operations
   */
  async process(): Promise<INodeExecutionData[]> {
    const items = this.executeFunctions.getInputData();

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const operation = this.executeFunctions.getNodeParameter(
        "operation",
        itemIndex
      ) as string;
      const resourceEndpoint = this.resourceEndpoints[operation];

      if (!resourceEndpoint) {
        throw new Error(
          `The operation ${operation} is not supported for resource Calendar!`
        );
      }

      switch (operation) {
        case "getEvents":
          await this.getEvents(itemIndex);
          break;
        case "getEvent":
          await this.getEvent(itemIndex);
          break;
        case "addEvent":
          await this.addEvent(itemIndex);
          break;
        case "updateEvent":
          await this.updateEvent(itemIndex);
          break;
        case "deleteEvent":
          await this.deleteEvent(itemIndex);
          break;
        case "getMeetingStatus":
          await this.getMeetingStatus(itemIndex);
          break;
        case "setMeetingStatus":
          await this.setMeetingStatus(itemIndex);
          break;
        case "getAccessibility":
          await this.getAccessibility(itemIndex);
          break;
        case "getSections":
          await this.getSections(itemIndex);
          break;
        case "addSection":
          await this.addSection(itemIndex);
          break;
        case "updateSection":
          await this.updateSection(itemIndex);
          break;
        case "deleteSection":
          await this.deleteSection(itemIndex);
          break;
        case "syncEvents":
          await this.syncEvents(itemIndex);
          break;
        default:
          throw new Error(
            `The operation "${operation}" is not supported for resource Calendar!`
          );
      }
    }

    return this.returnData;
  }

  /**
   * Get a list of calendar events
   */
  private async getEvents(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const from = this.executeFunctions.getNodeParameter(
      "from",
      itemIndex,
      ""
    ) as string;
    const to = this.executeFunctions.getNodeParameter(
      "to",
      itemIndex,
      ""
    ) as string;
    const sectionId = this.executeFunctions.getNodeParameter(
      "sectionId",
      itemIndex,
      ""
    ) as string;

    const params: IDataObject = {
      type,
      ownerId,
    };

    if (from) params.from = from;
    if (to) params.to = to;
    if (sectionId) params.section = sectionId;

    const response = await this.makeApiCall(
      "calendar.event.get",
      params,
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Get a specific calendar event by ID
   */
  private async getEvent(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const eventId = this.executeFunctions.getNodeParameter(
      "eventId",
      itemIndex
    ) as string;

    const response = await this.makeApiCall(
      "calendar.event.get",
      {
        type,
        ownerId,
        id: eventId,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Add a new calendar event
   */
  private async addEvent(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const eventDataStr = this.executeFunctions.getNodeParameter(
      "eventData",
      itemIndex
    ) as string;
    const sectionId = this.executeFunctions.getNodeParameter(
      "sectionId",
      itemIndex,
      ""
    ) as string;

    if (!eventDataStr || eventDataStr.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Event data must not be empty",
        { itemIndex }
      );
    }

    const eventData = this.parseJsonParameter(
      eventDataStr,
      "Failed to parse event data JSON",
      itemIndex
    );

    const params: IDataObject = {
      type,
      ownerId,
      ...eventData,
    };

    if (sectionId) params.section = sectionId;

    const response = await this.makeApiCall(
      "calendar.event.add",
      params,
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Update an existing calendar event
   */
  private async updateEvent(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const eventId = this.executeFunctions.getNodeParameter(
      "eventId",
      itemIndex
    ) as string;
    const eventDataStr = this.executeFunctions.getNodeParameter(
      "eventData",
      itemIndex
    ) as string;

    if (!eventDataStr || eventDataStr.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Event data must not be empty",
        { itemIndex }
      );
    }

    const eventData = this.parseJsonParameter(
      eventDataStr,
      "Failed to parse event data JSON",
      itemIndex
    );

    const params: IDataObject = {
      type,
      ownerId,
      id: eventId,
      ...eventData,
    };

    const response = await this.makeApiCall(
      "calendar.event.update",
      params,
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Delete a calendar event
   */
  private async deleteEvent(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const eventId = this.executeFunctions.getNodeParameter(
      "eventId",
      itemIndex
    ) as string;

    const response = await this.makeApiCall(
      "calendar.event.delete",
      {
        type,
        ownerId,
        id: eventId,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Get meeting status
   */
  private async getMeetingStatus(itemIndex: number) {
    const eventId = this.executeFunctions.getNodeParameter(
      "eventId",
      itemIndex
    ) as string;

    const response = await this.makeApiCall(
      "calendar.meeting.status.get",
      {
        id: eventId,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Set meeting status
   */
  private async setMeetingStatus(itemIndex: number) {
    const eventId = this.executeFunctions.getNodeParameter(
      "eventId",
      itemIndex
    ) as string;
    const status = this.executeFunctions.getNodeParameter(
      "status",
      itemIndex
    ) as string;

    const response = await this.makeApiCall(
      "calendar.meeting.status.set",
      {
        id: eventId,
        status,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Get users accessibility (free/busy) info
   */
  private async getAccessibility(itemIndex: number) {
    const userIds = this.executeFunctions.getNodeParameter(
      "userIds",
      itemIndex
    ) as string;
    const from = this.executeFunctions.getNodeParameter(
      "from",
      itemIndex,
      ""
    ) as string;
    const to = this.executeFunctions.getNodeParameter(
      "to",
      itemIndex,
      ""
    ) as string;

    const params: IDataObject = {
      users: userIds.split(",").map((id) => id.trim()),
    };

    if (from) params.from = from;
    if (to) params.to = to;

    const response = await this.makeApiCall(
      "calendar.accessibility.get",
      params,
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Get calendar sections
   */
  private async getSections(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;

    const response = await this.makeApiCall(
      "calendar.section.get",
      {
        type,
        ownerId,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Add calendar section
   */
  private async addSection(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const name = this.executeFunctions.getNodeParameter(
      "name",
      itemIndex
    ) as string;
    const sectionDataStr = this.executeFunctions.getNodeParameter(
      "sectionData",
      itemIndex,
      "{}"
    ) as string;

    if (!sectionDataStr || sectionDataStr.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Section data must not be empty",
        { itemIndex }
      );
    }

    const sectionData = this.parseJsonParameter(
      sectionDataStr,
      "Failed to parse section data JSON",
      itemIndex
    );

    const params: IDataObject = {
      type,
      ownerId,
      ...sectionData,
    };

    const response = await this.makeApiCall(
      "calendar.section.add",
      params,
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Update calendar section
   */
  private async updateSection(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const id = this.executeFunctions.getNodeParameter(
      "id",
      itemIndex
    ) as string;
    const sectionDataStr = this.executeFunctions.getNodeParameter(
      "sectionData",
      itemIndex
    ) as string;

    if (!sectionDataStr || sectionDataStr.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Section data must not be empty",
        { itemIndex }
      );
    }

    const sectionData = this.parseJsonParameter(
      sectionDataStr,
      "Failed to parse section data JSON",
      itemIndex
    );

    const params: IDataObject = {
      type,
      ownerId,
      id: id,
      ...sectionData,
    };

    const response = await this.makeApiCall(
      "calendar.section.update",
      params,
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Delete calendar section
   */
  private async deleteSection(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const sectionId = this.executeFunctions.getNodeParameter(
      "sectionId",
      itemIndex
    ) as string;

    const response = await this.makeApiCall(
      "calendar.section.delete",
      {
        type,
        ownerId,
        id: sectionId,
      },
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }

  /**
   * Sync calendar events (full event sync)
   * This method implements the full event sync functionality
   */
  private async syncEvents(itemIndex: number) {
    const type = this.executeFunctions.getNodeParameter(
      "type",
      itemIndex
    ) as string;
    const ownerId = this.executeFunctions.getNodeParameter(
      "ownerId",
      itemIndex
    ) as string;
    const from = this.executeFunctions.getNodeParameter(
      "from",
      itemIndex,
      ""
    ) as string;
    const to = this.executeFunctions.getNodeParameter(
      "to",
      itemIndex,
      ""
    ) as string;
    const syncToken = this.executeFunctions.getNodeParameter(
      "syncToken",
      itemIndex,
      ""
    ) as string;

    const params: IDataObject = {
      type,
      ownerId,
    };

    if (from) params.from = from;
    if (to) params.to = to;
    if (syncToken) params.syncToken = syncToken;

    // Use the special sync endpoint for full event synchronization
    const response = await this.makeApiCall(
      "calendar.event.get.sync",
      params,
      {},
      itemIndex
    );

    this.addResponseToReturnData(response, itemIndex);
    return response;
  }
}

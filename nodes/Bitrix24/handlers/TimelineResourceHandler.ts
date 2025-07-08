import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";
import { makeStandardBitrix24Call } from "../GenericFunctions";
import { bitrix24Request } from "../GenericFunctions";

/**
 * Handler for Timeline resource operations in Bitrix24
 */
export class TimelineResourceHandler extends ResourceHandlerBase {
  private resourceEndpoints = {
    timeline: {
      // Comment methods
      getComments: "crm.timeline.comment.list",
      getComment: "crm.timeline.comment.get",
      addComment: "crm.timeline.comment.add",
      updateComment: "crm.timeline.comment.update",
      deleteComment: "crm.timeline.comment.delete",
      getCommentFields: "crm.timeline.comment.fields",

      // Note methods
      getNote: "crm.timeline.note.get",
      saveNote: "crm.timeline.note.save",
      deleteNote: "crm.timeline.note.delete",

      // Bindings methods
      bind: "crm.timeline.bindings.bind",
      getBindings: "crm.timeline.bindings.list",
      unbind: "crm.timeline.bindings.unbind",
      getBindingsFields: "crm.timeline.bindings.fields",

      // Layout blocks methods
      setLayoutBlocks: "crm.timeline.layout.blocks.set",
      getLayoutBlocks: "crm.timeline.layout.blocks.get",
      deleteLayoutBlocks: "crm.timeline.layout.blocks.delete",

      // Log message methods
      addLogMessage: "crm.timeline.logmessage.add",
      getLogMessage: "crm.timeline.logmessage.get",
      getLogMessages: "crm.timeline.logmessage.list",
      deleteLogMessage: "crm.timeline.logmessage.delete",
    },
  };

  /**
   * Helper function to convert entityTypeId (number) to entityType (string)
   */
  private getEntityTypeFromId(entityTypeId: number): string {
    const entityTypeMap: { [key: number]: string } = {
      1: "lead",
      2: "deal",
      3: "contact",
      4: "company",
      7: "quote",
      31: "invoice",
      45: "smart_process",
    };

    return entityTypeMap[entityTypeId] || "unknown";
  }

  /**
   * Prepare filter parameters for timeline API calls, converting ENTITY_TYPE_ID to ENTITY_TYPE when needed
   */
  private prepareTimelineFilter(
    filter: IDataObject,
    debugMode: boolean = false
  ): IDataObject {
    const preparedFilter: IDataObject = { ...filter };

    // Convert ENTITY_TYPE_ID to ENTITY_TYPE if present
    if (
      preparedFilter.ENTITY_TYPE_ID !== undefined &&
      preparedFilter.ENTITY_TYPE === undefined
    ) {
      const entityTypeId =
        typeof preparedFilter.ENTITY_TYPE_ID === "string"
          ? parseInt(preparedFilter.ENTITY_TYPE_ID as string, 10)
          : (preparedFilter.ENTITY_TYPE_ID as number);

      const entityType = this.getEntityTypeFromId(entityTypeId);

      if (debugMode) {
        console.log(
          `[DEBUG] Converting ENTITY_TYPE_ID ${entityTypeId} to ENTITY_TYPE: ${entityType}`
        );
      }

      // Set the correct parameter
      preparedFilter.ENTITY_TYPE = entityType;

      // Remove the incorrect parameter to avoid conflicts
      delete preparedFilter.ENTITY_TYPE_ID;
    }

    // Ensure ENTITY_ID is a number
    if (
      preparedFilter.ENTITY_ID &&
      typeof preparedFilter.ENTITY_ID === "string"
    ) {
      preparedFilter.ENTITY_ID = parseInt(
        preparedFilter.ENTITY_ID as string,
        10
      );

      if (debugMode) {
        console.log(
          `[DEBUG] Converted ENTITY_ID to number: ${preparedFilter.ENTITY_ID}`
        );
      }
    }

    return preparedFilter;
  }

  /**
   * Handle API errors for timeline operations
   */
  private async handleTimelineError(
    error: any,
    itemIndex: number,
    entityInfo?: { entityType?: string; entityId?: number }
  ): Promise<IDataObject> {
    // Check if this is an access denied error
    const errorMsg = error.message || "";
    const isAccessDeniedError =
      errorMsg.toLowerCase().includes("access denied") ||
      (error.statusCode &&
        (error.statusCode === 401 || error.statusCode === 403));

    if (isAccessDeniedError) {
      // Create a helpful response instead of throwing an error
      const helpfulResponse: IDataObject = {
        result: [],
        error: true,
        error_description: "Access denied to timeline API",
        troubleshooting: [
          "Make sure your webhook has the 'crm' scope enabled",
          "The entity you're trying to access may not exist or you don't have permission to view it",
          "Timeline API often requires administrator permissions in Bitrix24",
          "Some Bitrix24 plans restrict access to timeline API",
        ],
      };

      // Try to get entity data if available
      if (entityInfo && entityInfo.entityType && entityInfo.entityId) {
        try {
          // Try to get the entity data directly
          const entityResponse = await this.makeApiCall(
            `crm.${entityInfo.entityType}.get`,
            { id: entityInfo.entityId },
            {},
            itemIndex
          );

          if (entityResponse && (entityResponse as any).result) {
            helpfulResponse.entity_data = (entityResponse as any).result;
            helpfulResponse.note =
              "Access denied to timeline API, but entity data is available";
          }
        } catch (entityError) {
          // Ignore errors when getting entity data
        }
      }

      return helpfulResponse;
    }

    // For other types of errors, rethrow
    throw error;
  }

  /**
   * Try alternative approaches to get timeline data when the primary method fails
   */
  private async tryAlternativeTimelineApproach(
    entityType: string,
    entityId: number,
    itemIndex: number
  ): Promise<IDataObject | null> {
    try {
      // Try general timeline endpoint instead of comments-specific endpoint
      const endpoint = "crm.timeline.list";
      const filter = {
        ENTITY_TYPE: entityType,
        ENTITY_ID: entityId,
      };

      console.log(
        `[DEBUG] Trying alternative endpoint ${endpoint} for entity type ${entityType}, ID ${entityId}`
      );

      const response = await this.makeApiCall(
        endpoint,
        { FILTER: filter },
        {},
        itemIndex
      );

      if (response && response.result) {
        // Filter for comments only
        const timelineItems = response.result;
        const commentItems = Array.isArray(timelineItems)
          ? timelineItems.filter(
              (item) => item.TYPE_ID === "comment" || item.COMMENT
            )
          : [];

        // Return a modified response
        return {
          result: commentItems,
          total: commentItems.length,
          note: "Retrieved from general timeline API due to access restrictions",
          _approach: "alternative_endpoint",
        };
      }
    } catch (error) {
      console.log(
        `[DEBUG] Alternative timeline approach failed: ${error.message}`
      );
    }

    return null;
  }

  /**
   * Process all timeline operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          // Comment operations
          case "getComments":
            await this.handleGetComments(i);
            break;
          case "getComment":
            await this.handleGetComment(i);
            break;
          case "addComment":
            await this.handleAddComment(i);
            break;
          case "updateComment":
            await this.handleUpdateComment(i);
            break;
          case "deleteComment":
            await this.handleDeleteComment(i);
            break;
          case "getCommentFields":
            await this.handleGetCommentFields(i);
            break;

          // Note operations
          case "getNote":
            await this.handleGetNote(i);
            break;
          case "saveNote":
            await this.handleSaveNote(i);
            break;
          case "deleteNote":
            await this.handleDeleteNote(i);
            break;

          // Bindings operations
          case "bind":
            await this.handleBind(i);
            break;
          case "getBindings":
            await this.handleGetBindings(i);
            break;
          case "unbind":
            await this.handleUnbind(i);
            break;
          case "getBindingsFields":
            await this.handleGetBindingsFields(i);
            break;

          // Layout blocks operations
          case "setLayoutBlocks":
            await this.handleSetLayoutBlocks(i);
            break;
          case "getLayoutBlocks":
            await this.handleGetLayoutBlocks(i);
            break;
          case "deleteLayoutBlocks":
            await this.handleDeleteLayoutBlocks(i);
            break;

          // Log message operations
          case "addLogMessage":
            await this.handleAddLogMessage(i);
            break;
          case "getLogMessage":
            await this.handleGetLogMessage(i);
            break;
          case "getLogMessages":
            await this.handleGetLogMessages(i);
            break;
          case "deleteLogMessage":
            await this.handleDeleteLogMessage(i);
            break;

          case "getTimeline":
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Operation 'getTimeline' is not supported. Please use specific endpoints like getComments, getLogMessages, etc.`,
              { itemIndex: i }
            );

          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Operation '${operation}' is not supported for Timeline resource`,
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
   * Handles retrieving comments from a timeline
   */
  private async handleGetComments(itemIndex: number): Promise<void> {
    const entityTypeId = parseInt(
      this.getNodeParameter("entityTypeId", itemIndex) as string,
      10
    );
    const entityId = parseInt(
      this.getNodeParameter("entityId", itemIndex) as string,
      10
    );
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    // Check if entityTypeId and entityId are valid numbers
    if (isNaN(entityTypeId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity Type ID must be a valid number",
        { itemIndex }
      );
    }

    if (isNaN(entityId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity ID must be a valid number",
        { itemIndex }
      );
    }

    // Convert entity type ID to entity type string as required by the API
    const entityType = this.getEntityTypeFromId(entityTypeId);

    // Prepare filter parameters
    const filter: IDataObject = {
      ENTITY_TYPE: entityType,
      ENTITY_ID: entityId,
    };

    // Add additional filter if specified
    if (options.filter) {
      try {
        const customFilter = JSON.parse(options.filter as string);
        Object.assign(filter, customFilter);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Filter must be a valid JSON",
          { itemIndex }
        );
      }
    }

    // Build the request parameters according to Bitrix24 API format
    const parameters: IDataObject = {};

    // Using uppercase parameter names per Bitrix24 API standards
    parameters.FILTER = filter;

    // Add order if specified
    if (options.order) {
      parameters.ORDER = { CREATED: options.order };
    }

    // Add select if specified
    if (options.select) {
      parameters.SELECT = options.select;
    }

    // Add raw parameters if specified
    if (options.rawParameters) {
      try {
        const rawParams = JSON.parse(options.rawParameters as string);
        Object.assign(parameters, rawParams);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Raw Parameters must be a valid JSON",
          { itemIndex }
        );
      }
    }

    const endpoint = this.resourceEndpoints.timeline.getComments;

    // Make the API call
    try {
      const responseData = await this.makeApiCall(
        endpoint,
        parameters,
        {},
        itemIndex,
        false
      );

      // Store the response in the node data - Fix for 'call' undefined issue
      if (
        this.executeFunctions.helpers &&
        this.executeFunctions.helpers.constructExecutionMetaData
      ) {
        this.executeFunctions.helpers.constructExecutionMetaData(
          this.executeFunctions.helpers.returnJsonArray([responseData]),
          { itemData: { item: 0 } }
        );
      } else {
        // Fallback if helpers or constructExecutionMetaData is not available
        this.returnData.push({
          json: responseData,
        });
      }
    } catch (error) {
      // Try to handle the error
      try {
        const alternativeData = await this.handleTimelineError(
          error,
          itemIndex,
          {
            entityType,
            entityId,
          }
        );

        // If we get here, we have a useful alternative response - Fix for 'call' undefined issue
        if (
          this.executeFunctions.helpers &&
          this.executeFunctions.helpers.constructExecutionMetaData
        ) {
          this.executeFunctions.helpers.constructExecutionMetaData(
            this.executeFunctions.helpers.returnJsonArray([alternativeData]),
            { itemData: { item: 0 } }
          );
        } else {
          // Fallback if helpers or constructExecutionMetaData is not available
          this.returnData.push({
            json: alternativeData,
          });
        }
      } catch (finalError) {
        // If all else fails, throw the original error
        throw error;
      }
    }
  }

  /**
   * Handles adding a comment to an entity
   */
  private async handleAddComment(itemIndex: number): Promise<void> {
    const entityTypeId = parseInt(
      this.getNodeParameter("entityTypeId", itemIndex) as string,
      10
    );
    const entityId = parseInt(
      this.getNodeParameter("entityId", itemIndex) as string,
      10
    );
    const comment = this.getNodeParameter("comment", itemIndex) as string;
    const additionalFields = this.getNodeParameter(
      "additionalFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Check if entityTypeId and entityId are valid numbers
    if (isNaN(entityTypeId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity Type ID must be a valid number",
        { itemIndex }
      );
    }

    if (isNaN(entityId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity ID must be a valid number",
        { itemIndex }
      );
    }

    // Validate that comment isn't empty
    if (!comment || comment.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Comment text cannot be empty",
        { itemIndex }
      );
    }

    // Validate that entityTypeId is one of the accepted values
    const validEntityTypeIds = [1, 2, 3, 4, 7, 31, 45];
    if (!validEntityTypeIds.includes(entityTypeId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Invalid Entity Type ID: ${entityTypeId}. Must be one of these values: ${validEntityTypeIds.join(
          ", "
        )}`,
        { itemIndex }
      );
    }

    // Convert entityTypeId to entityType string
    const entityType = this.getEntityTypeFromId(entityTypeId);

    // Create fields object according to API docs
    const fields: IDataObject = {
      ENTITY_ID: entityId,
      ENTITY_TYPE: entityType,
      COMMENT: comment,
    };

    // Add author ID if specified (must be an integer)
    if (additionalFields.authorId) {
      const authorId = parseInt(additionalFields.authorId as string, 10);
      if (isNaN(authorId)) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Author ID must be a valid number",
          { itemIndex }
        );
      }
      fields.AUTHOR_ID = authorId;
    }

    // Add files if specified (must be an array of file IDs)
    if (additionalFields.files) {
      const filesInput = additionalFields.files as string;
      if (filesInput.trim() !== "") {
        const fileIds = filesInput.split(",").map((id) => id.trim());
        // Validate each file ID is a number
        const invalidIds = fileIds.filter((id) => isNaN(parseInt(id, 10)));
        if (invalidIds.length > 0) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `Invalid file IDs: ${invalidIds.join(
              ", "
            )}. All file IDs must be valid numbers.`,
            { itemIndex }
          );
        }
        fields.FILES = fileIds;
      }
    }

    // Parameter structure according to API docs
    const parameters: IDataObject = {
      FIELDS: fields,
    };

    const endpoint = this.resourceEndpoints.timeline.addComment;
    try {
      const responseData = await this.makeApiCall(
        endpoint,
        parameters,
        {},
        itemIndex
      );

      // Add null check for helpers object
      if (
        this.executeFunctions.helpers &&
        this.executeFunctions.helpers.constructExecutionMetaData
      ) {
        this.executeFunctions.helpers.constructExecutionMetaData(
          this.executeFunctions.helpers.returnJsonArray([responseData]),
          { itemData: { item: 0 } }
        );
      } else {
        // Fallback if helpers or constructExecutionMetaData is not available
        this.returnData.push({
          json: responseData,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handles updating a comment
   */
  private async handleUpdateComment(itemIndex: number): Promise<void> {
    const commentId = this.getNodeParameter("commentId", itemIndex) as string;
    const comment = this.getNodeParameter("comment", itemIndex) as string;
    const updateFields = this.getNodeParameter(
      "updateFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Validate commentId is not empty
    if (!commentId || commentId.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Comment ID cannot be empty",
        { itemIndex }
      );
    }

    // Validate that comment isn't empty
    if (!comment || comment.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Comment text cannot be empty",
        { itemIndex }
      );
    }

    // Create fields object according to API docs
    const fields: IDataObject = {
      COMMENT: comment,
    };

    // Add files if specified (must be an array of file IDs)
    if (updateFields.files) {
      const filesInput = updateFields.files as string;
      if (filesInput.trim() !== "") {
        const fileIds = filesInput.split(",").map((id) => id.trim());
        // Validate each file ID is a number
        const invalidIds = fileIds.filter((id) => isNaN(parseInt(id, 10)));
        if (invalidIds.length > 0) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `Invalid file IDs: ${invalidIds.join(
              ", "
            )}. All file IDs must be valid numbers.`,
            { itemIndex }
          );
        }
        fields.FILES = fileIds;
      }
    }

    // Parameter structure according to API docs
    const parameters: IDataObject = {
      ID: commentId,
      FIELDS: fields,
    };

    const endpoint = this.resourceEndpoints.timeline.updateComment;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles deleting a comment
   */
  private async handleDeleteComment(itemIndex: number): Promise<void> {
    const commentId = this.getNodeParameter("commentId", itemIndex) as string;

    const parameters: IDataObject = {
      ID: commentId,
    };

    const endpoint = this.resourceEndpoints.timeline.deleteComment;
    try {
      const responseData = await this.makeApiCall(
        endpoint,
        parameters,
        {},
        itemIndex
      );

      // Add null check for helpers object
      if (
        this.executeFunctions.helpers &&
        this.executeFunctions.helpers.constructExecutionMetaData
      ) {
        this.executeFunctions.helpers.constructExecutionMetaData(
          this.executeFunctions.helpers.returnJsonArray([responseData]),
          { itemData: { item: 0 } }
        );
      } else {
        // Fallback if helpers or constructExecutionMetaData is not available
        this.returnData.push({
          json: responseData,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handles binding an entity to another entity's timeline
   */
  private async handleBind(itemIndex: number): Promise<void> {
    const entityTypeId = parseInt(
      this.getNodeParameter("entityTypeId", itemIndex) as string,
      10
    );
    const entityId = parseInt(
      this.getNodeParameter("entityId", itemIndex) as string,
      10
    );
    const targetEntityTypeId = parseInt(
      this.getNodeParameter("targetEntityTypeId", itemIndex) as string,
      10
    );
    const targetEntityId = parseInt(
      this.getNodeParameter("targetEntityId", itemIndex) as string,
      10
    );

    // Check if all IDs are valid numbers
    if (
      isNaN(entityTypeId) ||
      isNaN(entityId) ||
      isNaN(targetEntityTypeId) ||
      isNaN(targetEntityId)
    ) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity Type ID, Entity ID, Target Entity Type ID, and Target Entity ID must be valid numbers",
        { itemIndex }
      );
    }

    // Convert entityTypeId and targetEntityTypeId to entityType strings
    const entityType = this.getEntityTypeFromId(entityTypeId);
    const targetEntityType = this.getEntityTypeFromId(targetEntityTypeId);

    const parameters: IDataObject = {
      ENTITY_TYPE: entityType,
      ENTITY_ID: entityId,
      TARGET_ENTITY_TYPE: targetEntityType,
      TARGET_ENTITY_ID: targetEntityId,
    };

    const endpoint = this.resourceEndpoints.timeline.bind;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles unbinding an entity from another entity's timeline
   */
  private async handleUnbind(itemIndex: number): Promise<void> {
    const entityTypeId = parseInt(
      this.getNodeParameter("entityTypeId", itemIndex) as string,
      10
    );
    const entityId = parseInt(
      this.getNodeParameter("entityId", itemIndex) as string,
      10
    );
    const targetEntityTypeId = parseInt(
      this.getNodeParameter("targetEntityTypeId", itemIndex) as string,
      10
    );
    const targetEntityId = parseInt(
      this.getNodeParameter("targetEntityId", itemIndex) as string,
      10
    );

    // Check if all IDs are valid numbers
    if (
      isNaN(entityTypeId) ||
      isNaN(entityId) ||
      isNaN(targetEntityTypeId) ||
      isNaN(targetEntityId)
    ) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity Type ID, Entity ID, Target Entity Type ID, and Target Entity ID must be valid numbers",
        { itemIndex }
      );
    }

    // Convert entityTypeId and targetEntityTypeId to entityType strings
    const entityType = this.getEntityTypeFromId(entityTypeId);
    const targetEntityType = this.getEntityTypeFromId(targetEntityTypeId);

    // Use uppercase parameters per Bitrix24 API standards
    const parameters: IDataObject = {
      ENTITY_TYPE: entityType,
      ENTITY_ID: entityId,
      TARGET_ENTITY_TYPE: targetEntityType,
      TARGET_ENTITY_ID: targetEntityId,
    };

    const endpoint = this.resourceEndpoints.timeline.unbind;
    try {
      const responseData = await this.makeApiCall(
        endpoint,
        parameters,
        {},
        itemIndex
      );

      // Add null check for helpers object
      if (
        this.executeFunctions.helpers &&
        this.executeFunctions.helpers.constructExecutionMetaData
      ) {
        this.executeFunctions.helpers.constructExecutionMetaData(
          this.executeFunctions.helpers.returnJsonArray([responseData]),
          { itemData: { item: 0 } }
        );
      } else {
        // Fallback if helpers or constructExecutionMetaData is not available
        this.returnData.push({
          json: responseData,
        });
      }
    } catch (error) {
      // Try to provide a more helpful error message for common issues
      if (error.message && error.message.includes("not found")) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `The binding between the entities could not be found. Please verify the entity IDs are correct and that a binding exists.`,
          { itemIndex }
        );
      }
      throw error;
    }
  }

  /**
   * Handles getting bindings for an entity
   */
  private async handleGetBindings(itemIndex: number): Promise<void> {
    const entityTypeId = parseInt(
      this.getNodeParameter("entityTypeId", itemIndex) as string,
      10
    );
    const entityId = parseInt(
      this.getNodeParameter("entityId", itemIndex) as string,
      10
    );

    // Check if entityTypeId and entityId are valid numbers
    if (isNaN(entityTypeId) || isNaN(entityId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity Type ID and Entity ID must be valid numbers",
        { itemIndex }
      );
    }

    // Validate entity type ID is valid
    const validEntityTypeIds = [1, 2, 3, 4, 7, 31, 45]; // Valid entity type IDs in Bitrix24
    if (!validEntityTypeIds.includes(entityTypeId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Invalid Entity Type ID: ${entityTypeId}. Must be one of: ${validEntityTypeIds.join(
          ", "
        )}`,
        { itemIndex }
      );
    }

    // Convert entityTypeId to entityType string
    const entityType = this.getEntityTypeFromId(entityTypeId);

    // Use uppercase parameter names per Bitrix24 API standards
    const parameters: IDataObject = {
      ENTITY_TYPE: entityType,
      ENTITY_ID: entityId,
    };

    const endpoint = this.resourceEndpoints.timeline.getBindings;
    try {
      const responseData = await this.makeApiCall(
        endpoint,
        parameters,
        {},
        itemIndex
      );

      // Add null check for helpers object
      if (
        this.executeFunctions.helpers &&
        this.executeFunctions.helpers.constructExecutionMetaData
      ) {
        this.executeFunctions.helpers.constructExecutionMetaData(
          this.executeFunctions.helpers.returnJsonArray([responseData]),
          { itemData: { item: 0 } }
        );
      } else {
        // Fallback if helpers or constructExecutionMetaData is not available
        this.returnData.push({
          json: responseData,
        });
      }
    } catch (error) {
      // Try to provide helpful context for common errors
      if (error.message && error.message.includes("access denied")) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `Access denied to get bindings. Make sure your webhook has sufficient permissions for entity type ${entityType} (ID: ${entityId}).`,
          { itemIndex }
        );
      } else if (error.message && error.message.includes("not found")) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `Entity with type ${entityType} and ID ${entityId} not found or has no bindings.`,
          { itemIndex }
        );
      }
      throw error;
    }
  }

  /**
   * Handles getting a specific comment
   */
  private async handleGetComment(itemIndex: number): Promise<void> {
    const commentId = this.getNodeParameter("commentId", itemIndex) as string;

    // Check if commentId is valid
    if (!commentId || commentId.trim() === "") {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Comment ID cannot be empty",
        { itemIndex }
      );
    }

    // Use uppercase parameter name per Bitrix24 API standards
    const parameters: IDataObject = {
      ID: commentId,
    };

    const endpoint = this.resourceEndpoints.timeline.getComment;
    try {
      const responseData = await this.makeApiCall(
        endpoint,
        parameters,
        {},
        itemIndex
      );

      // Add null check for helpers object
      if (
        this.executeFunctions.helpers &&
        this.executeFunctions.helpers.constructExecutionMetaData
      ) {
        this.executeFunctions.helpers.constructExecutionMetaData(
          this.executeFunctions.helpers.returnJsonArray([responseData]),
          { itemData: { item: 0 } }
        );
      } else {
        // Fallback if helpers or constructExecutionMetaData is not available
        this.returnData.push({
          json: responseData,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handles getting comment fields
   */
  private async handleGetCommentFields(itemIndex: number): Promise<void> {
    const endpoint = this.resourceEndpoints.timeline.getCommentFields;
    const responseData = this.makeApiCall(endpoint, {}, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles getting a note
   */
  private async handleGetNote(itemIndex: number): Promise<void> {
    const noteId = this.getNodeParameter("noteId", itemIndex) as string;

    const parameters: IDataObject = {
      ID: noteId,
    };

    const endpoint = this.resourceEndpoints.timeline.getNote;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles saving a note
   */
  private async handleSaveNote(itemIndex: number): Promise<void> {
    const entityTypeId = parseInt(
      this.getNodeParameter("entityTypeId", itemIndex) as string,
      10
    );
    const entityId = parseInt(
      this.getNodeParameter("entityId", itemIndex) as string,
      10
    );
    const comment = this.getNodeParameter("COMMENT", itemIndex) as string;
    const noteFields = this.getNodeParameter(
      "noteFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Check if entityTypeId and entityId are valid numbers
    if (isNaN(entityTypeId) || isNaN(entityId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity Type ID and Entity ID must be valid numbers",
        { itemIndex }
      );
    }

    // Convert entityTypeId to entityType string
    const entityType = this.getEntityTypeFromId(entityTypeId);

    // Create the fields object with the required parameters
    const fields: IDataObject = {
      ENTITY_ID: entityId,
      ENTITY_TYPE: entityType,
      COMMENT: comment,
    };

    // Add additional fields if specified
    if (noteFields && Object.keys(noteFields).length > 0) {
      Object.assign(fields, noteFields);
    }

    // Format parameters according to API requirements
    const parameters: IDataObject = {
      FIELDS: fields,
    };

    const endpoint = this.resourceEndpoints.timeline.saveNote;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles deleting a note
   */
  private async handleDeleteNote(itemIndex: number): Promise<void> {
    const noteId = this.getNodeParameter("noteId", itemIndex) as string;

    const parameters: IDataObject = {
      ID: noteId,
    };

    const endpoint = this.resourceEndpoints.timeline.deleteNote;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles getting binding fields
   */
  private async handleGetBindingsFields(itemIndex: number): Promise<void> {
    const endpoint = this.resourceEndpoints.timeline.getBindingsFields;
    const responseData = this.makeApiCall(endpoint, {}, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles setting layout blocks
   */
  private async handleSetLayoutBlocks(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;
    const blocks = this.getNodeParameter("blocks", itemIndex) as string;

    let parsedBlocks;
    try {
      parsedBlocks = JSON.parse(blocks);
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Blocks must be a valid JSON array",
        { itemIndex }
      );
    }

    const parameters: IDataObject = {
      ENTITY_TYPE_ID: entityTypeId,
      ENTITY_ID: entityId,
      BLOCKS: parsedBlocks,
    };

    const endpoint = this.resourceEndpoints.timeline.setLayoutBlocks;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles getting layout blocks
   */
  private async handleGetLayoutBlocks(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;

    const parameters: IDataObject = {
      ENTITY_TYPE_ID: entityTypeId,
      ENTITY_ID: entityId,
    };

    const endpoint = this.resourceEndpoints.timeline.getLayoutBlocks;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles deleting layout blocks
   */
  private async handleDeleteLayoutBlocks(itemIndex: number): Promise<void> {
    const entityTypeId = this.getNodeParameter(
      "entityTypeId",
      itemIndex
    ) as string;
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;

    const parameters: IDataObject = {
      ENTITY_TYPE_ID: entityTypeId,
      ENTITY_ID: entityId,
    };

    const endpoint = this.resourceEndpoints.timeline.deleteLayoutBlocks;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles adding a log message
   */
  private async handleAddLogMessage(itemIndex: number): Promise<void> {
    const entityTypeId = parseInt(
      this.getNodeParameter("entityTypeId", itemIndex) as string,
      10
    );
    const entityId = parseInt(
      this.getNodeParameter("entityId", itemIndex) as string,
      10
    );
    const messageText = this.getNodeParameter(
      "messageText",
      itemIndex
    ) as string;
    const additionalFields = this.getNodeParameter(
      "additionalFields",
      itemIndex,
      {}
    ) as IDataObject;

    // Check if entityTypeId and entityId are valid numbers
    if (isNaN(entityTypeId) || isNaN(entityId)) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity Type ID and Entity ID must be valid numbers",
        { itemIndex }
      );
    }

    // Convert entityTypeId to entityType string
    const entityType = this.getEntityTypeFromId(entityTypeId);

    const fields: IDataObject = {
      ENTITY_ID: entityId,
      ENTITY_TYPE: entityType,
      MESSAGE: messageText,
    };

    // Add title if specified
    if (additionalFields.title) {
      fields.TITLE = additionalFields.title;
    }

    // Add author ID if specified
    if (additionalFields.authorId) {
      fields.AUTHOR_ID = parseInt(additionalFields.authorId as string, 10);
    }

    const parameters: IDataObject = {
      FIELDS: fields,
    };

    const endpoint = this.resourceEndpoints.timeline.addLogMessage;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles getting a log message
   */
  private async handleGetLogMessage(itemIndex: number): Promise<void> {
    const logMessageId = this.getNodeParameter(
      "logMessageId",
      itemIndex
    ) as string;

    const parameters: IDataObject = {
      ID: logMessageId,
    };

    const endpoint = this.resourceEndpoints.timeline.getLogMessage;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handles getting log messages
   */
  private async handleGetLogMessages(itemIndex: number): Promise<void> {
    // Initialize the parameters object
    const parameters: IDataObject = {};

    // Create the filter object
    let filter: IDataObject = {};

    // Get entityTypeId (optional)
    let entityTypeParam = this.getNodeParameter(
      "entityTypeId",
      itemIndex,
      ""
    ) as string;
    if (entityTypeParam && entityTypeParam.trim() !== "") {
      const entityTypeId = parseInt(entityTypeParam, 10);

      // Check if entityTypeId is a valid number
      if (isNaN(entityTypeId)) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Entity Type ID must be a valid number",
          { itemIndex }
        );
      }

      // Validate that entityTypeId is one of the accepted values
      const validEntityTypeIds = [1, 2, 3, 4, 7, 31, 45];
      if (!validEntityTypeIds.includes(entityTypeId)) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `Invalid Entity Type ID: ${entityTypeId}. Must be one of these values: ${validEntityTypeIds.join(
            ", "
          )}`,
          { itemIndex }
        );
      }

      // For the Bitrix24 API, we need ENTITY_TYPE_ID in uppercase
      filter.ENTITY_TYPE_ID = entityTypeId;
    }

    // Get entityId (optional)
    let entityIdParam = this.getNodeParameter(
      "entityId",
      itemIndex,
      ""
    ) as string;
    if (entityIdParam && entityIdParam.trim() !== "") {
      const entityId = parseInt(entityIdParam, 10);

      // Check if entityId is a valid number
      if (isNaN(entityId)) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Entity ID must be a valid number",
          { itemIndex }
        );
      }

      // Add to filter - use uppercase for API compatibility
      filter.ENTITY_ID = entityId;
    }

    // Get options
    const options = this.getNodeParameter(
      "logMessageOptions",
      itemIndex,
      {}
    ) as IDataObject;

    // Add custom filter if specified and merge with entity filter
    if (options.filter) {
      try {
        const filterJson = options.filter as string;
        if (filterJson) {
          const parsedFilter = JSON.parse(filterJson);

          // Bitrix24 API expects uppercase keys in filter
          const upperCaseFilter: IDataObject = {};
          Object.keys(parsedFilter).forEach((key) => {
            upperCaseFilter[key.toUpperCase()] = parsedFilter[key];
          });

          // Merge the parsed filter with our entity filter
          filter = {
            ...filter,
            ...upperCaseFilter,
          };
        }
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Filter must be a valid JSON",
          { itemIndex }
        );
      }
    }

    // Only add filter if it has keys
    if (Object.keys(filter).length > 0) {
      parameters.FILTER = filter;
    }

    // Add order if specified (uppercase)
    if (options.order) {
      // Check if order is a valid option
      const validOrderValues = ["ASC", "DESC", "asc", "desc"];
      if (!validOrderValues.includes(options.order as string)) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `Invalid order value: ${options.order}. Must be one of: ASC, DESC`,
          { itemIndex }
        );
      }

      parameters.ORDER = { CREATED: options.order };
    }

    // Add select if specified
    if (options.select) {
      // If select is a string, split it by commas and trim each value
      if (typeof options.select === "string") {
        const selectFields = options.select
          .split(",")
          .map((field) => field.trim());
        parameters.SELECT = selectFields;
      } else {
        parameters.SELECT = options.select;
      }
    }

    const endpoint = this.resourceEndpoints.timeline.getLogMessages;
    try {
      const responseData = await this.makeApiCall(
        endpoint,
        parameters,
        {},
        itemIndex
      );

      // Add null check for helpers object
      if (
        this.executeFunctions.helpers &&
        this.executeFunctions.helpers.constructExecutionMetaData
      ) {
        this.executeFunctions.helpers.constructExecutionMetaData(
          this.executeFunctions.helpers.returnJsonArray([responseData]),
          { itemData: { item: 0 } }
        );
      } else {
        // Fallback if helpers or constructExecutionMetaData is not available
        this.returnData.push({
          json: responseData,
        });
      }
    } catch (error) {
      // Provide helpful error messages for common issues
      if (error.message && error.message.includes("access denied")) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Access denied to log messages. Ensure your webhook has sufficient permissions for the timeline module.",
          { itemIndex }
        );
      }
      throw error;
    }
  }

  /**
   * Handles deleting a log message
   */
  private async handleDeleteLogMessage(itemIndex: number): Promise<void> {
    const logMessageId = this.getNodeParameter(
      "logMessageId",
      itemIndex
    ) as string;

    const parameters: IDataObject = {
      ID: logMessageId,
    };

    const endpoint = this.resourceEndpoints.timeline.deleteLogMessage;
    const responseData = this.makeApiCall(endpoint, parameters, {}, itemIndex);
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

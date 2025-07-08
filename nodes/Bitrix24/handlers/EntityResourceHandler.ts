import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handles Entity operations in Bitrix24
 */
export class EntityResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    entity: {
      get: "entity.get",
      add: "entity.add",
      update: "entity.update",
      delete: "entity.delete",
      rights: "entity.rights",
      propertyAdd: "entity.item.property.add",
      propertyUpdate: "entity.item.property.update",
      propertyDelete: "entity.item.property.delete",
      propertyGet: "entity.item.property.get",
      addSection: "entity.section.add",
      updateSection: "entity.section.update",
      deleteSection: "entity.section.delete",
      getSections: "entity.section.get",
      addItem: "entity.item.add",
      getItem: "entity.item.get",
      updateItem: "entity.item.update",
      deleteItem: "entity.item.delete",
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
   * Process Entity operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "get":
            await this.handleGet(i);
            break;
          case "add":
            await this.handleAdd(i);
            break;
          case "update":
            await this.handleUpdate(i);
            break;
          case "delete":
            await this.handleDelete(i);
            break;
          case "addSection":
            await this.handleAddSection(i);
            break;
          case "updateSection":
            await this.handleUpdateSection(i);
            break;
          case "deleteSection":
            await this.handleDeleteSection(i);
            break;
          case "getSections":
            await this.handleGetSections(i);
            break;
          case "addItem":
            await this.handleAddItem(i);
            break;
          case "getItem":
            await this.handleGetItem(i);
            break;
          case "updateItem":
            await this.handleUpdateItem(i);
            break;
          case "deleteItem":
            await this.handleDeleteItem(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `The operation "${operation}" is not supported for Entity`,
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
   * Handle 'get' operation - Get entities (list all entities)
   */
  private async handleGet(itemIndex: number): Promise<void> {
    // entity.get might not require parameters - it could return all entities
    const requestParams: IDataObject = {};

    const endpoint = this.resourceEndpoints.entity.get;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'add' operation - Add a new entity
   */
  private async handleAdd(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;

    // Get entity data
    let entityData: IDataObject = {};
    try {
      const entityDataJson = this.getNodeParameter(
        "entityData",
        itemIndex,
        "{}"
      ) as string;
      if (entityDataJson) {
        entityData = this.parseJsonParameter(
          entityDataJson,
          "Entity data must be valid JSON",
          itemIndex
        );
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity data must be valid JSON",
        { itemIndex }
      );
    }

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      FIELDS: entityData,
    };

    const endpoint = this.resourceEndpoints.entity.add;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'update' operation - Update an entity
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;

    // Get entity data
    let entityData: IDataObject = {};
    try {
      const entityDataJson = this.getNodeParameter(
        "entityData",
        itemIndex,
        "{}"
      ) as string;
      if (entityDataJson) {
        entityData = this.parseJsonParameter(
          entityDataJson,
          "Entity data must be valid JSON",
          itemIndex
        );
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Entity data must be valid JSON",
        { itemIndex }
      );
    }

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      ID: entityId,
      FIELDS: entityData,
    };

    const endpoint = this.resourceEndpoints.entity.update;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'delete' operation - Delete an entity
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const entityId = this.getNodeParameter("entityId", itemIndex) as string;

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      ID: entityId,
    };

    const endpoint = this.resourceEndpoints.entity.delete;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'addSection' operation - Add an entity section
   */
  private async handleAddSection(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;

    // Get section data
    let sectionData: IDataObject = {};
    try {
      const dataJson = this.getNodeParameter(
        "entityData",
        itemIndex,
        "{}"
      ) as string;
      if (dataJson) {
        sectionData = this.parseJsonParameter(
          dataJson,
          "Section data must be valid JSON",
          itemIndex
        );
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Section data must be valid JSON",
        { itemIndex }
      );
    }

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      FIELDS: sectionData,
    };

    const endpoint = this.resourceEndpoints.entity.addSection;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'updateSection' operation - Update an entity section
   */
  private async handleUpdateSection(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const sectionId = this.getNodeParameter("sectionId", itemIndex) as string;

    // Get section data
    let sectionData: IDataObject = {};
    try {
      const dataJson = this.getNodeParameter(
        "entityData",
        itemIndex,
        "{}"
      ) as string;
      if (dataJson) {
        sectionData = this.parseJsonParameter(
          dataJson,
          "Section data must be valid JSON",
          itemIndex
        );
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Section data must be valid JSON",
        { itemIndex }
      );
    }

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      ID: sectionId,
      FIELDS: sectionData,
    };

    const endpoint = this.resourceEndpoints.entity.updateSection;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'deleteSection' operation - Delete an entity section
   */
  private async handleDeleteSection(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const sectionId = this.getNodeParameter("sectionId", itemIndex) as string;

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      ID: sectionId,
    };

    const endpoint = this.resourceEndpoints.entity.deleteSection;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getSections' operation - Get entity sections
   */
  private async handleGetSections(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
    };

    const endpoint = this.resourceEndpoints.entity.getSections;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'addItem' operation - Add an entity item
   */
  private async handleAddItem(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;

    // Get item data
    let itemData: IDataObject = {};
    try {
      const dataJson = this.getNodeParameter(
        "itemData",
        itemIndex,
        "{}"
      ) as string;
      if (dataJson) {
        itemData = this.parseJsonParameter(
          dataJson,
          "Item data must be valid JSON",
          itemIndex
        );
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Item data must be valid JSON",
        { itemIndex }
      );
    }

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      FIELDS: itemData,
    };

    const endpoint = this.resourceEndpoints.entity.addItem;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'getItem' operation - Get an entity item
   */
  private async handleGetItem(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      ID: itemId,
    };

    const endpoint = this.resourceEndpoints.entity.getItem;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'updateItem' operation - Update an entity item
   */
  private async handleUpdateItem(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;

    // Get item data
    let itemData: IDataObject = {};
    try {
      const dataJson = this.getNodeParameter(
        "itemData",
        itemIndex,
        "{}"
      ) as string;
      if (dataJson) {
        itemData = this.parseJsonParameter(
          dataJson,
          "Item data must be valid JSON",
          itemIndex
        );
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Item data must be valid JSON",
        { itemIndex }
      );
    }

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      ID: itemId,
      FIELDS: itemData,
    };

    const endpoint = this.resourceEndpoints.entity.updateItem;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'deleteItem' operation - Delete an entity item
   */
  private async handleDeleteItem(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const itemId = this.getNodeParameter("itemId", itemIndex) as string;

    const requestParams: IDataObject = {
      ENTITY_TYPE_ID: entityType,
      ID: itemId,
    };

    const endpoint = this.resourceEndpoints.entity.deleteItem;
    const responseData = await this.makeApiCall(
      endpoint,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

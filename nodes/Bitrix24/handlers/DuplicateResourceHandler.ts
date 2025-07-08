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
 * Handler for Bitrix24 duplicate detection operations
 */
export class DuplicateResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    findByCommunication: "crm.duplicate.findbycomm",
    findDuplicates: "crm.entity.findduplicates",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process duplicate detection operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "findByCommunication":
            await this.handleFindByCommunication(i);
            break;
          case "findDuplicates":
            await this.handleFindDuplicates(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `The operation "${operation}" is not supported for duplicate detection`,
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
   * Get endpoint for a specific operation
   */
  private getResourceOperation(operation: string): string {
    if (!this.resourceEndpoints[operation]) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `The operation "${operation}" is not supported for duplicate detection`
      );
    }

    return this.resourceEndpoints[operation];
  }

  /**
   * Handle find by communication operation
   */
  private async handleFindByCommunication(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const commType = this.getNodeParameter("commType", itemIndex) as string;
    const commValue = this.getNodeParameter("commValue", itemIndex) as string;

    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const params: IDataObject = {
      ENTITY_TYPE: entityType.toUpperCase(),
      TYPE: commType,
      VALUES: [commValue],
    };

    if (options.entityId) {
      params.ENTITY_ID = options.entityId;
    }

    if (options.customParameters) {
      this.processCustomParameters(options, params, itemIndex);
    }

    try {
      const endpoint = this.getResourceOperation("findByCommunication");
      const responseData = await makeStandardBitrix24Call.call(
        this.executeFunctions,
        endpoint,
        params,
        {},
        itemIndex
      );

      this.returnData.push({
        json: responseData,
      });
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Error finding duplicates by communication: ${error.message}`,
        { itemIndex }
      );
    }
  }

  /**
   * Handle find duplicates operation
   */
  private async handleFindDuplicates(itemIndex: number): Promise<void> {
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;
    const entityData = this.getNodeParameter(
      "entityData",
      itemIndex
    ) as IDataObject;

    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const params: IDataObject = {
      ENTITY_TYPE: entityType.toUpperCase(),
      ENTITY_DATA: entityData,
    };

    if (options.entityId) {
      params.ENTITY_ID = options.entityId;
    }

    if (options.customParameters) {
      this.processCustomParameters(options, params, itemIndex);
    }

    try {
      const endpoint = this.getResourceOperation("findDuplicates");
      const responseData = await makeStandardBitrix24Call.call(
        this.executeFunctions,
        endpoint,
        params,
        {},
        itemIndex
      );

      this.returnData.push({
        json: responseData,
      });
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Error finding duplicates: ${error.message}`,
        { itemIndex }
      );
    }
  }

  /**
   * Process custom parameters
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
              "Custom Parameters",
              itemIndex
            )
          : (options.customParameters as IDataObject);

      for (const key in customParams) {
        if (Object.prototype.hasOwnProperty.call(customParams, key)) {
          params[key] = customParams[key];
        }
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Error parsing custom parameters: ${error.message}`,
        { itemIndex }
      );
    }
  }
}

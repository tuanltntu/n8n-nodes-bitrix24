import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handler for Bitrix24 Bizproc operations
 */
export class BizprocResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    startWorkflow: "bizproc.workflow.start",
    getTask: "bizproc.task.get",
    getTasks: "bizproc.task.list",
    completeTask: "bizproc.task.complete",
    getWorkflow: "bizproc.workflow.get",
    getWorkflows: "bizproc.workflow.instances",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process Bizproc operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "startWorkflow":
            await this.handleStartWorkflow(i);
            break;
          case "getTask":
            await this.handleGetTask(i);
            break;
          case "getTasks":
            await this.handleGetTasks(i);
            break;
          case "completeTask":
            await this.handleCompleteTask(i);
            break;
          case "getWorkflow":
            await this.handleGetWorkflow(i);
            break;
          case "getWorkflows":
            await this.handleGetWorkflows(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Unsupported operation "${operation}" for Bizproc resource`,
              { itemIndex: i }
            );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          this.addErrorToReturnData(error, i);
        } else {
          throw error;
        }
      }
    }

    return this.returnData;
  }

  /**
   * Handle start workflow operation
   */
  private async handleStartWorkflow(itemIndex: number): Promise<void> {
    const templateId = this.getNodeParameter("templateId", itemIndex) as string;
    const documentId = this.getNodeParameter("documentId", itemIndex) as string;
    const parameters = this.getNodeParameter(
      "parameters",
      itemIndex,
      "{}"
    ) as string;

    const body: IDataObject = {
      TEMPLATE_ID: templateId,
      DOCUMENT_ID: documentId,
    };

    if (parameters) {
      try {
        body.PARAMETERS = JSON.parse(parameters);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `Invalid JSON in parameters: ${error.message}`,
          { itemIndex }
        );
      }
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.startWorkflow,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get task operation
   */
  private async handleGetTask(itemIndex: number): Promise<void> {
    const taskId = this.getNodeParameter("taskId", itemIndex) as string;

    const body: IDataObject = {
      ID: taskId,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getTask,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get tasks operation
   */
  private async handleGetTasks(itemIndex: number): Promise<void> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {};

    if (options.filter) {
      try {
        body.filter = JSON.parse(options.filter as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.order) {
      try {
        body.order = JSON.parse(options.order as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.start) {
      body.start = options.start;
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getTasks,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle complete task operation
   */
  private async handleCompleteTask(itemIndex: number): Promise<void> {
    const taskId = this.getNodeParameter("taskId", itemIndex) as string;
    const parameters = this.getNodeParameter(
      "parameters",
      itemIndex,
      "{}"
    ) as string;

    const body: IDataObject = {
      TASK_ID: taskId,
    };

    if (parameters) {
      try {
        body.PARAMETERS = JSON.parse(parameters);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `Invalid JSON in parameters: ${error.message}`,
          { itemIndex }
        );
      }
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.completeTask,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get workflow operation
   */
  private async handleGetWorkflow(itemIndex: number): Promise<void> {
    const workflowId = this.getNodeParameter("workflowId", itemIndex) as string;

    const body: IDataObject = {
      ID: workflowId,
    };

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getWorkflow,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle get workflows operation
   */
  private async handleGetWorkflows(itemIndex: number): Promise<void> {
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    ) as IDataObject;

    const body: IDataObject = {};

    if (options.filter) {
      try {
        body.filter = JSON.parse(options.filter as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.order) {
      try {
        body.order = JSON.parse(options.order as string);
      } catch (error) {
        // Ignore invalid JSON
      }
    }

    if (options.start) {
      body.start = options.start;
    }

    const responseData = await this.makeApiCall(
      this.resourceEndpoints.getWorkflows,
      body,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

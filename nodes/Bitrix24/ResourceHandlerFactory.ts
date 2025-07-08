import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { ResourceHandlerBase } from "./handlers/ResourceHandlerBase";
import { CalendarResourceHandler } from "./handlers/CalendarResourceHandler";
import { CrmResourceHandler } from "./handlers/CrmResourceHandler";
import { UserResourceHandler } from "./handlers/UserResourceHandler";
import { DiskResourceHandler } from "./handlers/DiskResourceHandler";
import { OpenLinesResourceHandler } from "./handlers/OpenLinesResourceHandler";
import { EntityResourceHandler } from "./handlers/EntityResourceHandler";
import { ChatbotResourceHandler } from "./handlers/ChatbotResourceHandler";

/**
 * Factory class for creating resource handlers
 */
export class ResourceHandlerFactory {
  /**
   * Create a resource handler
   * @param resource The resource to create a handler for
   * @param executeFunctions The execute functions
   * @param returnData The return data
   * @returns The resource handler
   */
  public static createHandler(
    resource: string,
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[]
  ): ResourceHandlerBase {
    switch (resource) {
      case "calendar":
        return new CalendarResourceHandler(executeFunctions, returnData);
      case "crm":
        return new CrmResourceHandler(executeFunctions, returnData);
      case "user":
        return new UserResourceHandler(executeFunctions, returnData);
      case "disk":
        return new DiskResourceHandler(executeFunctions, returnData);
      case "openLines":
        return new OpenLinesResourceHandler(executeFunctions, returnData);
      case "entity":
        return new EntityResourceHandler(executeFunctions, returnData);
      case "chatbot":
        return new ChatbotResourceHandler(executeFunctions, returnData);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  }
}

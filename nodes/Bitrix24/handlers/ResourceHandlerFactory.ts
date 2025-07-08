import {
  IExecuteFunctions,
  INodeExecutionData,
  IDataObject,
} from "n8n-workflow";
import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { CrmResourceHandler } from "./CrmResourceHandler";
import { TaskResourceHandler } from "./TaskResourceHandler";
import { UserResourceHandler } from "./UserResourceHandler";
import { SpaResourceHandler } from "./SpaResourceHandler";
import { ActivityResourceHandler } from "./ActivityResourceHandler";
import { AutomationResourceHandler } from "./AutomationResourceHandler";
import { DocumentGeneratorResourceHandler } from "./DocumentGeneratorResourceHandler";
import { ChatResourceHandler } from "./ChatResourceHandler";
import { UserFieldResourceHandler } from "./UserFieldResourceHandler";
import { FileResourceHandler } from "./FileResourceHandler";
import { UserFieldConfigResourceHandler } from "./UserFieldConfigResourceHandler";
import { DuplicateResourceHandler } from "./DuplicateResourceHandler";
import { TimelineResourceHandler } from "./TimelineResourceHandler";
import { DiskResourceHandler } from "./DiskResourceHandler";
import { BizprocResourceHandler } from "./BizprocResourceHandler";
import { StatusResourceHandler } from "./StatusResourceHandler";
import { CalendarResourceHandler } from "./CalendarResourceHandler";
import { CatalogResourceHandler } from "./CatalogResourceHandler";
import { ChatbotResourceHandler } from "./ChatbotResourceHandler";
import { EventsResourceHandler } from "./EventsResourceHandler";
import { ListsResourceHandler } from "./ListsResourceHandler";
import { ProductResourceHandler } from "./ProductResourceHandler";
import { DirectApiResourceHandler } from "./DirectApiResourceHandler";
import { OpenLinesResourceHandler } from "./OpenLinesResourceHandler";
import { TelephonyResourceHandler } from "./TelephonyResourceHandler";
import { EntityResourceHandler } from "./EntityResourceHandler";
import { MessageServiceResourceHandler } from "./MessageServiceResourceHandler";
import { NotifyResourceHandler } from "./NotifyResourceHandler";

/**
 * Interface to define handler options
 */
export interface IResourceHandlerOptions extends IDataObject {
  forceWebhook?: boolean; // option to force use of webhook authentication
  debug?: boolean; // enable debug mode for detailed logging
}

/**
 * Factory to create the appropriate resource handler
 */
export class ResourceHandlerFactory {
  /**
   * Create a handler for the requested resource
   */
  public static createHandler(
    resource: string,
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ): ResourceHandlerBase {
    // For debugging
    const isDebugMode = options.debug === true || process.env.DEBUG === "true";
    if (isDebugMode) {
      console.log(
        `RESOURCE HANDLER FACTORY: Creating handler for resource ${resource}`
      );
      console.log(
        `RESOURCE HANDLER FACTORY: Options:`,
        JSON.stringify(options)
      );
    }

    // Block the customMethod resource completely
    if (resource === "customMethod") {
      throw new Error("Custom API Call is disabled");
    }

    // Add authentication override if forceWebhook is set
    if (options.forceWebhook === true) {
      if (isDebugMode) {
        console.log(
          `RESOURCE HANDLER FACTORY: Using forced webhook authentication`
        );
      }
      // We'll pass this option to all handlers
    }

    // Select the appropriate handler based on the resource type
    switch (resource) {
      case "crm":
        return new CrmResourceHandler(executeFunctions, returnData, options);
      case "task":
        return new TaskResourceHandler(executeFunctions, returnData, options);
      case "user":
        return new UserResourceHandler(executeFunctions, returnData, options);
      case "spa":
        return new SpaResourceHandler(executeFunctions, returnData, options);
      case "activity":
        return new ActivityResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "automation":
        return new AutomationResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "documentGenerator":
        return new DocumentGeneratorResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "chat":
        return new ChatResourceHandler(executeFunctions, returnData, options);
      case "userField":
        return new UserFieldResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "file":
        return new FileResourceHandler(executeFunctions, returnData, options);
      case "userFieldConfig":
        return new UserFieldConfigResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "duplicate":
        return new DuplicateResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "timeline":
        return new TimelineResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "disk":
        return new DiskResourceHandler(executeFunctions, returnData, options);
      case "bizproc":
        return new BizprocResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "status":
        return new StatusResourceHandler(executeFunctions, returnData, options);
      case "calendar":
        return new CalendarResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "catalog":
        return new CatalogResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "chatbot":
        return new ChatbotResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "events":
        return new EventsResourceHandler(executeFunctions, returnData, options);
      case "lists":
        return new ListsResourceHandler(executeFunctions, returnData, options);
      case "product":
        return new ProductResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "directApi":
        return new DirectApiResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "openLines":
        return new OpenLinesResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "telephony":
        return new TelephonyResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "entity":
        return new EntityResourceHandler(executeFunctions, returnData, options);
      case "messageservice":
        return new MessageServiceResourceHandler(
          executeFunctions,
          returnData,
          options
        );
      case "notify":
        return new NotifyResourceHandler(executeFunctions, returnData, options);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  }
}

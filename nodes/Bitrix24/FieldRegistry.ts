import { INodePropertyOptions, INodeProperties } from "n8n-workflow";

// Import fields from description files
import { crmFields } from "./descriptions/CrmDescription";
import { taskFields } from "./descriptions/TaskDescription";
import { userFields } from "./descriptions/UserDescription";
import { spaFields } from "./descriptions/SpaDescription";
import { activityFields } from "./descriptions/ActivityDescription";
import { automationFields } from "./descriptions/AutomationDescription";
import { documentGeneratorFields } from "./descriptions/DocumentGeneratorDescription";
import { chatFields } from "./descriptions/ChatDescription";
import { userFieldFields } from "./descriptions/UserFieldDescription";
import { fileFields } from "./descriptions/FileDescription";
import { userFieldConfigFields } from "./descriptions/UserFieldConfigDescription";
import { duplicateFields } from "./descriptions/DuplicateDescription";
import { timelineFields } from "./descriptions/TimelineDescription";
import { diskFields } from "./descriptions/DiskDescription";
import { bizprocFields } from "./descriptions/BizprocDescription";
import { statusFields } from "./descriptions/StatusDescription";
import { calendarFields } from "./descriptions/CalendarDescription";
import { catalogFields } from "./descriptions/CatalogDescription";
import { chatbotFields } from "./descriptions/ChatbotDescription";
import { eventsFields } from "./descriptions/EventsDescription";
import { listsFields } from "./descriptions/ListsDescription";
import { productFields } from "./descriptions/ProductDescription";
import { directApiFields } from "./descriptions/DirectApiDescription";
import { openLinesFields } from "./descriptions/OpenLinesDescription";
import { telephonyFields } from "./descriptions/TelephonyDescription";
import { entityFields } from "./descriptions/EntityDescription";
import { notifyFields } from "./descriptions/NotifyDescription";
import { messageServiceFields } from "./descriptions/MessageServiceDescription";

/**
 * Central registry for managing Bitrix24 resources and fields
 * Simplified to only essential methods
 */
export class FieldRegistry {
  /**
   * Get all available Bitrix24 resources
   */
  static getAvailableResources(): INodePropertyOptions[] {
    return [
      {
        name: "Direct API",
        value: "directApi",
        description: "Direct API Access",
      },
      {
        name: "CRM",
        value: "crm",
        description: "Customer Relationship Management",
      },
      { name: "Task", value: "task", description: "Task Management" },
      { name: "User", value: "user", description: "User Management" },
      { name: "SPA", value: "spa", description: "Smart Process Automation" },
      {
        name: "Activity",
        value: "activity",
        description: "Activity Management",
      },
      {
        name: "Automation",
        value: "automation",
        description: "Business Process Automation",
      },
      {
        name: "Document Generator",
        value: "documentGenerator",
        description: "Document Generation",
      },
      {
        name: "Data Storage",
        value: "entity",
        description: "Data Storage",
      },
      { name: "Chat", value: "chat", description: "Chat Management" },
      {
        name: "User Field",
        value: "userField",
        description: "User Field Management",
      },
      { name: "File", value: "file", description: "File Management" },
      {
        name: "User Field Config",
        value: "userFieldConfig",
        description: "User Field Configuration",
      },
      {
        name: "Duplicate",
        value: "duplicate",
        description: "Duplicate Management",
      },
      {
        name: "Timeline",
        value: "timeline",
        description: "Timeline Management",
      },
      { name: "Disk", value: "disk", description: "Disk Management" },
      { name: "Workflow", value: "bizproc", description: "Business Process" },
      { name: "Status", value: "status", description: "Status Management" },
      {
        name: "Calendar",
        value: "calendar",
        description: "Calendar Management",
      },
      { name: "Catalog", value: "catalog", description: "Catalog Management" },
      { name: "Chatbot", value: "chatbot", description: "Chatbot Management" },
      { name: "Events", value: "events", description: "Events Management" },
      { name: "Lists", value: "lists", description: "Lists Management" },
      { name: "Product", value: "product", description: "Product Management" },
      {
        name: "Open Lines",
        value: "openLines",
        description: "Open Lines Management",
      },
      {
        name: "Telephony",
        value: "telephony",
        description: "Telephony Management",
      },
      {
        name: "Message Service",
        value: "messageservice",
        description: "Message Service (SMS/Messaging)",
      },
      {
        name: "Notify",
        value: "notify",
        description: "Notification Management",
      },
    ];
  }

  /**
   * Get all available fields from all description files
   */
  static getAvailableFields(): INodeProperties[] {
    return [
      ...crmFields,
      ...taskFields,
      ...userFields,
      ...spaFields,
      ...activityFields,
      ...automationFields,
      ...documentGeneratorFields,
      ...chatFields,
      ...userFieldFields,
      ...fileFields,
      ...userFieldConfigFields,
      ...duplicateFields,
      ...timelineFields,
      ...diskFields,
      ...bizprocFields,
      ...statusFields,
      ...calendarFields,
      ...catalogFields,
      ...chatbotFields,
      ...eventsFields,
      ...listsFields,
      ...productFields,
      ...directApiFields,
      ...openLinesFields,
      ...telephonyFields,
      ...entityFields,
      ...messageServiceFields,
      ...notifyFields,
    ];
  }
}

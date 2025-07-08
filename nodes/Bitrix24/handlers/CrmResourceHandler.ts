import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";
import {
  CRM_ENTITY_MAPPING,
  CRM_OPERATION_MAPPING,
} from "../descriptions/CrmDescription";

/**
 * Handler for Bitrix24 CRM operations
 */
export class CrmResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    lead: {
      create: "crm.lead.add",
      get: "crm.lead.get",
      list: "crm.lead.list",
      getAll: "crm.lead.list",
      update: "crm.lead.update",
      delete: "crm.lead.delete",
      getFields: "crm.lead.fields",
    },
    deal: {
      create: "crm.deal.add",
      get: "crm.deal.get",
      list: "crm.deal.list",
      getAll: "crm.deal.list",
      update: "crm.deal.update",
      delete: "crm.deal.delete",
      getFields: "crm.deal.fields",
      getProducts: "crm.deal.productrows.get",
      setProducts: "crm.deal.productrows.set",
    },
    contact: {
      create: "crm.contact.add",
      get: "crm.contact.get",
      list: "crm.contact.list",
      getAll: "crm.contact.list",
      update: "crm.contact.update",
      delete: "crm.contact.delete",
      getFields: "crm.contact.fields",
      addToCompany: "crm.contact.company.add",
      removeFromCompany: "crm.contact.company.delete",
      getCompanies: "crm.contact.company.items.get",
      setCompany: "crm.contact.company.items.set",
    },
    company: {
      create: "crm.company.add",
      get: "crm.company.get",
      list: "crm.company.list",
      getAll: "crm.company.list",
      update: "crm.company.update",
      delete: "crm.company.delete",
      getFields: "crm.company.fields",
    },
    quote: {
      create: "crm.quote.add",
      get: "crm.quote.get",
      list: "crm.quote.list",
      getAll: "crm.quote.list",
      update: "crm.quote.update",
      delete: "crm.quote.delete",
      getFields: "crm.quote.fields",
    },
    invoice: {
      create: "crm.invoice.add",
      get: "crm.invoice.get",
      list: "crm.invoice.list",
      getAll: "crm.invoice.list",
      update: "crm.invoice.update",
      delete: "crm.invoice.delete",
      getFields: "crm.invoice.fields",
    },
    product: {
      create: "crm.product.add",
      get: "crm.product.get",
      list: "crm.product.list",
      getAll: "crm.product.list",
      update: "crm.product.update",
      delete: "crm.product.delete",
      getFields: "crm.product.fields",
      getSections: "crm.productsection.list",
      getProperties: "crm.product.property.list",
      getPropertySettings: "crm.product.property.settings.get",
    },
    activity: {
      create: "crm.activity.add",
      get: "crm.activity.get",
      list: "crm.activity.list",
      getAll: "crm.activity.list",
      update: "crm.activity.update",
      delete: "crm.activity.delete",
      getFields: "crm.activity.fields",
    },
  };

  // Common endpoints that work across entities
  private readonly commonEndpoints = {
    getUserFields: "crm.userfield.list",
    getStatus: "crm.status.list",
    getCurrency: "crm.currency.list",
    getCatalog: "crm.catalog.list",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process CRM operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        // Get entity type and operation type from new structure
        const entityType = this.getNodeParameter("entityType", i) as string;
        const operationType = this.getNodeParameter("operation", i) as string;

        // Check for common operations first
        let endpoint = this.commonEndpoints[operationType];

        if (!endpoint) {
          // Check entity-specific operations
          endpoint = this.resourceEndpoints[entityType]?.[operationType];
        }

        if (!endpoint) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `Endpoint not found for ${entityType}.${operationType}`,
            { itemIndex: i }
          );
        }

        const body = this.buildRequestBody(operationType, entityType, i);

        // Make API call
        const responseData = await this.makeApiCall(endpoint, body, {}, i);
        this.addResponseToReturnData(responseData, i);
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
   * Build request body based on operation type
   */
  private buildRequestBody(
    operationType: string,
    entityType: string,
    itemIndex: number
  ): IDataObject {
    switch (operationType) {
      case "create":
        return this.buildCompleteRequestBody(itemIndex, "create");

      case "update":
        return this.buildCompleteRequestBody(itemIndex, "update");

      case "get":
      case "delete":
        const id = this.getNodeParameter("recordId", itemIndex) as string;
        return { id };

      case "list":
      case "getAll":
        const options = this.getNodeParameter(
          "crmOptions",
          itemIndex,
          {}
        ) as IDataObject;

        const body: IDataObject = {};
        this.buildListOptions(body, options);
        return body;

      case "getFields":
      case "getUserFields":
      case "getStatus":
      case "getCurrency":
      case "getCatalog":
      case "getSections":
      case "getProperties":
      case "getPropertySettings":
        return {};

      // Contact-specific operations
      case "addToCompany":
      case "removeFromCompany":
        const contactId = this.getNodeParameter(
          "recordId",
          itemIndex
        ) as string;
        const companyId = this.getNodeParameter(
          "companyId",
          itemIndex
        ) as string;
        return {
          id: contactId,
          fields: { COMPANY_ID: companyId },
        };

      case "getCompanies":
      case "setCompany":
        const contactIdForCompany = this.getNodeParameter(
          "recordId",
          itemIndex
        ) as string;
        return { id: contactIdForCompany };

      // Deal-specific operations
      case "getProducts":
      case "setProducts":
        const dealId = this.getNodeParameter("recordId", itemIndex) as string;
        if (operationType === "setProducts") {
          const products = this.getNodeParameter(
            "products",
            itemIndex
          ) as string;
          try {
            return {
              id: dealId,
              rows: JSON.parse(products),
            };
          } catch (error) {
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Invalid JSON in products parameter: ${error.message}`,
              { itemIndex }
            );
          }
        }
        return { id: dealId };

      default:
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          `Unsupported operation type: ${operationType}`,
          { itemIndex: itemIndex }
        );
    }
  }

  /**
   * Build complete request body including special PHONE and EMAIL fields
   */
  private buildCompleteRequestBody(
    itemIndex: number,
    operation: string
  ): IDataObject {
    // Get entity type to handle special cases
    const entityType = this.getNodeParameter("entityType", itemIndex) as string;

    // Get regular fields
    const regularFields = this.getNodeParameter(
      "fields",
      itemIndex,
      {}
    ) as IDataObject;
    const fields = this.buildFieldsFromCollection(regularFields);

    // Handle deal category for deal creation
    if (entityType === "deal" && operation === "create") {
      const categoryId = this.getNodeParameter(
        "categoryId",
        itemIndex,
        null
      ) as string | null;
      if (
        categoryId !== null &&
        categoryId !== undefined &&
        categoryId !== ""
      ) {
        fields.CATEGORY_ID = categoryId;
      }
    }

    // Handle special PHONE fields
    const phoneFields = this.getNodeParameter(
      "phoneFields",
      itemIndex,
      {}
    ) as IDataObject;
    if (phoneFields.phoneItems && Array.isArray(phoneFields.phoneItems)) {
      const phoneValues = phoneFields.phoneItems.map((item: any) => ({
        VALUE: item.VALUE,
        VALUE_TYPE: item.VALUE_TYPE || "WORK",
      }));
      if (phoneValues.length > 0) {
        fields.PHONE = phoneValues;
      }
    }

    // Handle special EMAIL fields
    const emailFields = this.getNodeParameter(
      "emailFields",
      itemIndex,
      {}
    ) as IDataObject;
    if (emailFields.emailItems && Array.isArray(emailFields.emailItems)) {
      const emailValues = emailFields.emailItems.map((item: any) => ({
        VALUE: item.VALUE,
        VALUE_TYPE: item.VALUE_TYPE || "WORK",
      }));
      if (emailValues.length > 0) {
        fields.EMAIL = emailValues;
      }
    }

    if (operation === "create") {
      return { fields };
    } else if (operation === "update") {
      const recordId = this.getNodeParameter("recordId", itemIndex) as string;
      return {
        id: recordId,
        fields,
      };
    }

    return { fields };
  }

  /**
   * Build fields object from collection format
   */
  private buildFieldsFromCollection(
    fieldsCollection: IDataObject
  ): IDataObject {
    const fields: IDataObject = {};

    // Handle fixedCollection format - fieldItems is an array
    if (
      fieldsCollection.fieldItems &&
      Array.isArray(fieldsCollection.fieldItems)
    ) {
      for (const fieldItem of fieldsCollection.fieldItems) {
        if (
          fieldItem &&
          typeof fieldItem === "object" &&
          "fieldName" in fieldItem &&
          "fieldValue" in fieldItem
        ) {
          const fieldData = fieldItem as { fieldName: string; fieldValue: any };
          if (fieldData.fieldName && fieldData.fieldValue !== undefined) {
            fields[fieldData.fieldName] = fieldData.fieldValue;
          }
        }
      }
    }

    return fields;
  }

  private buildListOptions(body: IDataObject, options: IDataObject) {
    if (options.select) {
      try {
        body.select = JSON.parse(options.select as string);
      } catch (error) {
        // If not valid JSON, treat as comma-separated string
        body.select = (options.select as string)
          .split(",")
          .map((s) => s.trim());
      }
    }

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
  }
}

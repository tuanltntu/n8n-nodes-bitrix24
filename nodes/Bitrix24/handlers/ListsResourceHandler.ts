import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
  INodePropertyOptions,
  ILoadOptionsFunctions,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";
import {
  bitrix24ApiRequestAllItems,
  makeStandardBitrix24Call,
} from "../GenericFunctions";

/**
 * Handle Bitrix24 Lists operations
 */
export class ListsResourceHandler extends ResourceHandlerBase {
  private readonly resourceEndpoints = {
    add: "lists.add",
    delete: "lists.delete",
    get: "lists.get",
    update: "lists.update",
    getIblockTypeId: "lists.get.iblock.type.id",
    addField: "lists.field.add",
    deleteField: "lists.field.delete",
    getFields: "lists.field.get",
    getFieldTypes: "lists.field.type.get",
    updateField: "lists.field.update",
    getElementFields: "lists.element.field.get",
    getElements: "lists.element.get",
    getElement: "lists.element.get",
    addElement: "lists.element.add",
    updateElement: "lists.element.update",
    deleteElement: "lists.element.delete",
    getElementFileUrl: "lists.element.get.file.url",
    getSectionElement: "lists.section.element.get",
    getElementFile: "lists.element.file.get",
    getSections: "lists.section.get",
    addSection: "lists.section.add",
    getSection: "lists.section.get",
    updateSection: "lists.section.update",
    deleteSection: "lists.section.delete",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process Lists operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          case "add":
            await this.handleAdd(i);
            break;
          case "delete":
            await this.handleDelete(i);
            break;
          case "get":
            await this.handleGet(i);
            break;
          case "update":
            await this.handleUpdate(i);
            break;
          case "getIblockTypeId":
            await this.handleGetIblockTypeId(i);
            break;
          case "addField":
            await this.handleAddField(i);
            break;
          case "deleteField":
            await this.handleDeleteField(i);
            break;
          case "getFields":
            await this.handleGetFields(i);
            break;
          case "getFieldTypes":
            await this.handleGetFieldTypes(i);
            break;
          case "updateField":
            await this.handleUpdateField(i);
            break;
          case "getElementFields":
            await this.handleGetElementFields(i);
            break;
          case "getElements":
            await this.handleGetElements(i);
            break;
          case "getElement":
            await this.handleGetElement(i);
            break;
          case "addElement":
            await this.handleAddElement(i);
            break;
          case "updateElement":
            await this.handleUpdateElement(i);
            break;
          case "deleteElement":
            await this.handleDeleteElement(i);
            break;
          case "getElementFileUrl":
            await this.handleGetElementFileUrl(i);
            break;
          case "getSectionElement":
            await this.handleGetSectionElement(i);
            break;
          case "getElementFile":
            await this.handleGetElementFile(i);
            break;
          case "getSections":
            await this.handleGetSections(i);
            break;
          case "addSection":
            await this.handleAddSection(i);
            break;
          case "getSection":
            await this.handleGetSection(i);
            break;
          case "updateSection":
            await this.handleUpdateSection(i);
            break;
          case "deleteSection":
            await this.handleDeleteSection(i);
            break;
          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Unsupported operation "${operation}" for Lists resource`,
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
   * Get endpoint for the specified operation
   */
  private getEndpoint(operation: string): string {
    const endpoint = this.resourceEndpoints[operation];
    if (!endpoint) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        `Unsupported operation "${operation}" for Lists resource`
      );
    }

    return endpoint;
  }

  /**
   * Handle adding a new list
   */
  private async handleAdd(itemIndex: number): Promise<void> {
    // Lấy các tham số bắt buộc
    const iblockTypeId = this.getNodeParameter(
      "IBLOCK_TYPE_ID",
      itemIndex
    ) as string;
    const iblockCode = this.getNodeParameter(
      "IBLOCK_CODE",
      itemIndex
    ) as string;

    // Lấy tham số SOCNET_GROUP_ID (nếu có)
    const socnetGroupId = this.getNodeParameter(
      "SOCNET_GROUP_ID",
      itemIndex,
      ""
    ) as string;

    // Xây dựng đối tượng FIELDS từ fixedCollection
    const fieldsUi = this.getNodeParameter("fieldsUi", itemIndex, {
      fieldsValues: [
        {
          fieldName: "NAME",
          fieldValue: "New List",
        },
      ],
    }) as IDataObject;

    const fieldsValues = (fieldsUi.fieldsValues as IDataObject[]) || [];
    const fields: IDataObject = {};

    // Chuyển đổi từ mảng sang object key-value
    for (const field of fieldsValues) {
      const fieldName = field.fieldName as string;
      const fieldValue = field.fieldValue as string;

      if (fieldName && fieldValue !== undefined) {
        // Chuyển đổi BIZPROC từ chuỗi sang Y/N
        if (fieldName === "BIZPROC") {
          fields[fieldName] =
            fieldValue === "true" ||
            fieldValue === "Y" ||
            fieldValue === "y" ||
            fieldValue === "yes"
              ? "Y"
              : "N";
        } else if (fieldName === "SORT") {
          // Chuyển đổi sang số nếu là SORT
          fields[fieldName] = parseInt(fieldValue, 10) || 500;
        } else {
          fields[fieldName] = fieldValue;
        }
      }
    }

    // Đảm bảo trường NAME luôn có giá trị
    if (!fields.NAME || fields.NAME === "") {
      fields.NAME = "New List";
    }

    // Xây dựng đối tượng MESSAGES từ form
    const messagesUi = this.getNodeParameter(
      "messagesUi",
      itemIndex,
      {}
    ) as IDataObject;

    // Xây dựng đối tượng RIGHTS từ form
    const rightsUi = this.getNodeParameter("rightsUi", itemIndex, {
      rightsValues: [],
    }) as IDataObject;

    const rightsValues = (rightsUi.rightsValues as IDataObject[]) || [];
    const rights: IDataObject = {};

    for (const right of rightsValues) {
      const code = right.code as string;
      const permission = right.permission as string;
      if (code && permission) {
        rights[code] = permission;
      }
    }

    // Xây dựng body request
    const body: IDataObject = {
      IBLOCK_TYPE_ID: iblockTypeId,
      IBLOCK_CODE: iblockCode,
      FIELDS: fields,
    };

    // Thêm SOCNET_GROUP_ID nếu có
    if (socnetGroupId) {
      body.SOCNET_GROUP_ID = socnetGroupId;
    }

    // Thêm MESSAGES nếu có
    if (Object.keys(messagesUi).length > 0) {
      body.MESSAGES = messagesUi;
    }

    // Thêm RIGHTS nếu có
    if (Object.keys(rights).length > 0) {
      body.RIGHTS = rights;
    }

    const endpoint = this.getEndpoint("add");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      body,
      {}, // empty query params
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle deleting a list
   */
  private async handleDelete(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const iblockTypeId = this.getNodeParameter(
      "IBLOCK_TYPE_ID",
      itemIndex
    ) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      IBLOCK_TYPE_ID: iblockTypeId,
    };

    const endpoint = this.getEndpoint("delete");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting lists
   */
  private async handleGet(itemIndex: number): Promise<void> {
    // Tạo body parameter chứ không phải query parameter
    const body: IDataObject = {};

    // Lấy các tham số required trực tiếp từ form
    const iblockTypeId = this.getNodeParameter(
      "IBLOCK_TYPE_ID",
      itemIndex
    ) as string;
    body.IBLOCK_TYPE_ID = iblockTypeId;

    // Lấy tham số filter
    try {
      const filterParam = this.getNodeParameter("FILTER", itemIndex, {}) as
        | string
        | object;

      body.FILTER =
        typeof filterParam === "string"
          ? JSON.parse(filterParam as string)
          : filterParam;
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Filter must be a valid JSON",
        { itemIndex }
      );
    }

    // Lấy các tham số phụ
    const socnetGroupId = this.getNodeParameter(
      "SOCNET_GROUP_ID",
      itemIndex,
      ""
    ) as string;
    if (socnetGroupId) {
      body.SOCNET_GROUP_ID = socnetGroupId;
    }

    const checkPermissions = this.getNodeParameter(
      "CHECK_PERMISSIONS",
      itemIndex,
      true
    ) as boolean;
    body.CHECK_PERMISSIONS = checkPermissions ? "Y" : "N";

    const endpoint = this.getEndpoint("get");

    // Dùng makeStandardBitrix24Call thay vì bitrix24ApiRequestAllItems vì không cần phân trang
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      body,
      {}, // empty query params
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle updating an existing list
   */
  private async handleUpdate(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    let fields = this.getNodeParameter("fields", itemIndex) as string | object;

    if (typeof fields === "string") {
      try {
        fields = JSON.parse(fields);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Fields must be a valid JSON",
          { itemIndex }
        );
      }
    }

    const params: IDataObject = {
      IBLOCK_ID: listId,
      FIELDS: fields,
    };

    const endpoint = this.getEndpoint("update");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting IBLOCK type ID
   */
  private async handleGetIblockTypeId(itemIndex: number): Promise<void> {
    const body: IDataObject = {};

    try {
      const filterParam = this.getNodeParameter("filter", itemIndex, {}) as
        | string
        | object;

      if (filterParam) {
        body.FILTER =
          typeof filterParam === "string"
            ? JSON.parse(filterParam as string)
            : filterParam;
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Filter must be a valid JSON",
        { itemIndex }
      );
    }

    const endpoint = this.getEndpoint("getIblockTypeId");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      body,
      {}, // empty query params
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle adding a field to a list
   */
  private async handleAddField(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const iblockTypeId = this.getNodeParameter(
      "IBLOCK_TYPE_ID",
      itemIndex
    ) as string;
    const fieldType = this.getNodeParameter("FIELD_TYPE", itemIndex) as string;
    const name = this.getNodeParameter("NAME", itemIndex) as string;
    const fieldId = this.getNodeParameter("FIELD_ID", itemIndex) as string;

    // Xây dựng object FIELDS theo chuẩn API Bitrix24
    const fields: IDataObject = {
      NAME: name,
      IS_REQUIRED: "N",
      MULTIPLE: "N",
      TYPE: fieldType,
      SORT: "500",
      CODE: fieldId,
    };

    // Lấy các tham số từ fieldParametersUi
    const fieldParametersUi = this.getNodeParameter(
      "fieldParametersUi",
      itemIndex,
      { parameters: [] }
    ) as IDataObject;
    const parameters = (fieldParametersUi.parameters as IDataObject[]) || [];

    // Xử lý từng tham số
    for (const param of parameters) {
      const paramName = param.name as string;
      let value = param.value;

      if (paramName && value !== undefined) {
        if (paramName === "custom" && param.customName) {
          // Xử lý tham số tùy chỉnh
          fields[param.customName as string] = value;
        } else if (paramName === "IS_REQUIRED" || paramName === "MULTIPLE") {
          // Chuyển đổi sang Y/N cho các tham số boolean
          fields[paramName] =
            value.toString().toLowerCase() === "true" ||
            value === "Y" ||
            value === "y"
              ? "Y"
              : "N";
        } else {
          // Các tham số khác
          fields[paramName] = value;
        }
      }
    }

    // Xử lý trường kiểu List
    if (fieldType === "L") {
      try {
        // Look for VALUES in field parameters first
        const fieldParameters = this.getNodeParameter(
          "fieldParametersUi",
          itemIndex
        ) as {
          parameters?: Array<{ name: string; value: string }>;
        };

        let listValues = "";

        // Check if VALUES parameter exists in field parameters
        if (fieldParameters && fieldParameters.parameters) {
          const valuesParam = fieldParameters.parameters.find(
            (param) => param.name === "VALUES" || param.name === "List Values"
          );

          if (valuesParam && valuesParam.value) {
            listValues = valuesParam.value;
          }
        }

        // If VALUES not found in parameters, try old method as fallback
        if (!listValues) {
          try {
            listValues = this.getNodeParameter(
              "LIST_TEXT_VALUES",
              itemIndex,
              ""
            ) as string;
          } catch (error) {
            // Parameter doesn't exist anymore, use default
            listValues = "Option 1\nOption 2\nOption 3";
          }
        }

        // Set the values
        if (listValues && listValues.trim() !== "") {
          fields.LIST_TEXT_VALUES = listValues;
        } else {
          // Default value if none provided
          fields.LIST_TEXT_VALUES = "Option 1\nOption 2\nOption 3";
        }

        console.log("Using List values:", fields.LIST_TEXT_VALUES);
      } catch (error) {
        // Use default values if error
        fields.LIST_TEXT_VALUES = "Option 1\nOption 2\nOption 3";
        console.log(
          "Error getting List values, using defaults:",
          error.message
        );
      }
    }

    // Xử lý trường kiểu CRM
    if (fieldType === "S:ECrm") {
      try {
        // Lấy CRM_ENTITY_TYPES trực tiếp
        const crmEntityTypes = this.getNodeParameter(
          "CRM_ENTITY_TYPES",
          itemIndex,
          ["LEAD", "DEAL", "CONTACT", "COMPANY"]
        ) as string[];

        // Đặt giá trị mặc định cho DEFAULT_VALUE là "lead"
        fields.DEFAULT_VALUE = "lead";

        // Xây dựng USER_TYPE_SETTINGS
        fields.USER_TYPE_SETTINGS = {};

        // Kiểm tra xem có entity types được chọn không
        if (crmEntityTypes && crmEntityTypes.length > 0) {
          // Đặt các entity types đã chọn thành "Y"
          for (const entityType of crmEntityTypes) {
            fields.USER_TYPE_SETTINGS[entityType] = "Y";
          }
        } else {
          // Sử dụng giá trị mặc định
          fields.USER_TYPE_SETTINGS = {
            LEAD: "Y",
            DEAL: "Y",
            CONTACT: "Y",
            COMPANY: "Y",
          };

          // Thêm cả Smart Process phổ biến
          fields.USER_TYPE_SETTINGS["DYNAMIC_131"] = "Y";
          fields.USER_TYPE_SETTINGS["DYNAMIC_178"] = "Y";
        }

        console.log(
          "CRM field settings:",
          JSON.stringify(
            {
              DEFAULT_VALUE: fields.DEFAULT_VALUE,
              USER_TYPE_SETTINGS: fields.USER_TYPE_SETTINGS,
            },
            null,
            2
          )
        );
      } catch (error) {
        // Sử dụng giá trị mặc định nếu có lỗi
        fields.DEFAULT_VALUE = "lead";
        fields.USER_TYPE_SETTINGS = {
          LEAD: "Y",
          DEAL: "Y",
          CONTACT: "Y",
          COMPANY: "Y",
          DYNAMIC_131: "Y",
          DYNAMIC_178: "Y",
        };
        console.log(
          "Error processing CRM field settings, using defaults:",
          error.message
        );
      }
    }

    // Xây dựng request đúng theo format API Bitrix24
    const params: IDataObject = {
      IBLOCK_ID: listId,
      IBLOCK_TYPE_ID: iblockTypeId,
      FIELDS: fields,
    };

    // Log request để debug chi tiết
    console.log("Field Add request params:", JSON.stringify(params, null, 2));

    const endpoint = this.getEndpoint("addField");

    try {
      const responseData = await makeStandardBitrix24Call.call(
        this.executeFunctions,
        endpoint,
        params,
        itemIndex
      );

      // Nếu thành công
      console.log(
        "Field Add response data:",
        JSON.stringify(responseData, null, 2)
      );
      this.returnData.push({ json: responseData });
    } catch (error) {
      // Log lỗi cụ thể
      console.error("Field Add error:", error);
      throw error;
    }
  }

  /**
   * Handle deleting a field from a list
   */
  private async handleDeleteField(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const fieldId = this.getNodeParameter("fieldId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      FIELD_ID: fieldId,
    };

    const endpoint = this.getEndpoint("deleteField");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting field types for a list
   */
  private async handleGetFieldTypes(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
    };

    const endpoint = this.getEndpoint("getFieldTypes");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle updating a field in a list
   */
  private async handleUpdateField(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const fieldId = this.getNodeParameter("fieldId", itemIndex) as string;
    let fieldData = this.getNodeParameter("fieldData", itemIndex) as
      | string
      | object;

    if (typeof fieldData === "string") {
      try {
        fieldData = JSON.parse(fieldData);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Field data must be a valid JSON",
          { itemIndex }
        );
      }
    }

    const params: IDataObject = {
      IBLOCK_ID: listId,
      FIELD_ID: fieldId,
      FIELD_DATA: fieldData,
    };

    const endpoint = this.getEndpoint("updateField");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting fields for a list
   */
  private async handleGetFields(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const params: IDataObject = {
      IBLOCK_ID: listId,
    };

    const endpoint = this.getEndpoint("getFields");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting element fields for a list
   */
  private async handleGetElementFields(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const params: IDataObject = {
      IBLOCK_ID: listId,
    };

    const endpoint = this.getEndpoint("getElementFields");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting all elements from a list
   */
  private async handleGetElements(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const body: IDataObject = {
      IBLOCK_ID: listId,
    };

    // Xử lý filter (required param)
    try {
      const filterParam = this.getNodeParameter("filter", itemIndex) as
        | string
        | object;

      body.FILTER =
        typeof filterParam === "string"
          ? JSON.parse(filterParam as string)
          : filterParam;
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Filter must be a valid JSON",
        { itemIndex }
      );
    }

    // Xử lý các tham số phụ
    try {
      const orderParam = this.getNodeParameter("order", itemIndex, {}) as
        | string
        | object;

      if (orderParam) {
        body.ORDER =
          typeof orderParam === "string"
            ? JSON.parse(orderParam as string)
            : orderParam;
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Order must be a valid JSON",
        { itemIndex }
      );
    }

    const select = this.getNodeParameter("select", itemIndex, "") as string;
    if (select) {
      body.SELECT = select;
    }

    const endpoint = this.getEndpoint("getElements");

    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      body,
      {}, // empty query params
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting a single element by ID
   */
  private async handleGetElement(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const elementId = this.getNodeParameter("elementId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      ELEMENT_ID: elementId,
    };

    const endpoint = this.getEndpoint("getElement");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle adding a new element to a list
   */
  private async handleAddElement(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    let elementFields = this.getNodeParameter("elementFields", itemIndex) as
      | string
      | object;

    if (typeof elementFields === "string") {
      try {
        elementFields = JSON.parse(elementFields);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Element fields must be a valid JSON",
          { itemIndex }
        );
      }
    }

    const params: IDataObject = {
      IBLOCK_ID: listId,
      ELEMENT_CODE: (elementFields as IDataObject).CODE || "",
      FIELDS: elementFields,
    };

    const endpoint = this.getEndpoint("addElement");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle updating an element in a list
   */
  private async handleUpdateElement(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const elementId = this.getNodeParameter("elementId", itemIndex) as string;
    let elementFields = this.getNodeParameter("elementFields", itemIndex) as
      | string
      | object;

    if (typeof elementFields === "string") {
      try {
        elementFields = JSON.parse(elementFields);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Element fields must be a valid JSON",
          { itemIndex }
        );
      }
    }

    const params: IDataObject = {
      IBLOCK_ID: listId,
      ELEMENT_ID: elementId,
      FIELDS: elementFields,
    };

    const endpoint = this.getEndpoint("updateElement");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle deleting an element from a list
   */
  private async handleDeleteElement(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const elementId = this.getNodeParameter("elementId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      ELEMENT_ID: elementId,
    };

    const endpoint = this.getEndpoint("deleteElement");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting element file URL
   */
  private async handleGetElementFileUrl(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const elementId = this.getNodeParameter("elementId", itemIndex) as string;
    const fieldId = this.getNodeParameter("fieldId", itemIndex) as string;
    const fileId = this.getNodeParameter("fileId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      ELEMENT_ID: elementId,
      FIELD_ID: fieldId,
      FILE_ID: fileId,
    };

    const endpoint = this.getEndpoint("getElementFileUrl");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting section element
   */
  private async handleGetSectionElement(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const sectionId = this.getNodeParameter("sectionId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      SECTION_ID: sectionId,
    };

    const endpoint = this.getEndpoint("getSectionElement");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting element file
   */
  private async handleGetElementFile(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const elementId = this.getNodeParameter("elementId", itemIndex) as string;
    const fieldId = this.getNodeParameter("fieldId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      ELEMENT_ID: elementId,
      FIELD_ID: fieldId,
    };

    const endpoint = this.getEndpoint("getElementFile");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting sections
   */
  private async handleGetSections(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const body: IDataObject = {
      IBLOCK_ID: listId,
    };

    // Xử lý filter (required param)
    try {
      const filterParam = this.getNodeParameter("filter", itemIndex) as
        | string
        | object;

      body.FILTER =
        typeof filterParam === "string"
          ? JSON.parse(filterParam as string)
          : filterParam;
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Filter must be a valid JSON",
        { itemIndex }
      );
    }

    // Xử lý các tham số phụ
    try {
      const orderParam = this.getNodeParameter("order", itemIndex, {}) as
        | string
        | object;

      if (orderParam) {
        body.ORDER =
          typeof orderParam === "string"
            ? JSON.parse(orderParam as string)
            : orderParam;
      }
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        "Order must be a valid JSON",
        { itemIndex }
      );
    }

    const select = this.getNodeParameter("select", itemIndex, "") as string;
    if (select) {
      body.SELECT = select;
    }

    const endpoint = this.getEndpoint("getSections");

    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      body,
      {}, // empty query params
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle adding a new section
   */
  private async handleAddSection(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    let sectionFields = this.getNodeParameter("sectionFields", itemIndex) as
      | string
      | object;

    if (typeof sectionFields === "string") {
      try {
        sectionFields = JSON.parse(sectionFields);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Section fields must be a valid JSON",
          { itemIndex }
        );
      }
    }

    const params: IDataObject = {
      IBLOCK_ID: listId,
      FIELDS: sectionFields,
    };

    const endpoint = this.getEndpoint("addSection");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle getting a single section by ID
   */
  private async handleGetSection(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const sectionId = this.getNodeParameter("sectionId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      SECTION_ID: sectionId,
    };

    const endpoint = this.getEndpoint("getSection");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle updating a section
   */
  private async handleUpdateSection(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const sectionId = this.getNodeParameter("sectionId", itemIndex) as string;
    let sectionFields = this.getNodeParameter("sectionFields", itemIndex) as
      | string
      | object;

    if (typeof sectionFields === "string") {
      try {
        sectionFields = JSON.parse(sectionFields);
      } catch (error) {
        throw new NodeOperationError(
          this.executeFunctions.getNode(),
          "Section fields must be a valid JSON",
          { itemIndex }
        );
      }
    }

    const params: IDataObject = {
      IBLOCK_ID: listId,
      SECTION_ID: sectionId,
      FIELDS: sectionFields,
    };

    const endpoint = this.getEndpoint("updateSection");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  /**
   * Handle deleting a section
   */
  private async handleDeleteSection(itemIndex: number): Promise<void> {
    const listId = this.getNodeParameter("listId", itemIndex) as string;
    const sectionId = this.getNodeParameter("sectionId", itemIndex) as string;

    const params: IDataObject = {
      IBLOCK_ID: listId,
      SECTION_ID: sectionId,
    };

    const endpoint = this.getEndpoint("deleteSection");
    const responseData = await makeStandardBitrix24Call.call(
      this.executeFunctions,
      endpoint,
      params,
      itemIndex
    );

    this.returnData.push({ json: responseData });
  }

  // Thêm hàm để lấy danh sách entity CRM và SPA
  private async getCrmEntityTypes(itemIndex: number): Promise<string[]> {
    try {
      // Gọi API để lấy danh sách entity động (smart processes)
      const endpoint = "crm.type.list";
      const responseData = await makeStandardBitrix24Call.call(
        this.executeFunctions,
        endpoint,
        {},
        itemIndex
      );

      console.log(
        "CRM entity types response:",
        JSON.stringify(responseData, null, 2)
      );

      // Danh sách entity mặc định
      const entityTypes = ["LEAD", "DEAL", "CONTACT", "COMPANY"];

      // Thêm các entity động từ response
      if (responseData && responseData.result) {
        // Hỗ trợ cả hai loại format response
        const types = Array.isArray(responseData.result)
          ? responseData.result
          : responseData.result.types || [];

        if (Array.isArray(types)) {
          for (const type of types) {
            if (type.entityTypeId) {
              entityTypes.push(`DYNAMIC_${type.entityTypeId}`);
            }
          }
        }
      }

      return entityTypes;
    } catch (error) {
      console.error("Error fetching CRM entity types:", error);
      // Trả về danh sách mặc định nếu có lỗi
      return ["LEAD", "DEAL", "CONTACT", "COMPANY"];
    }
  }

  // Thêm phương thức mới cho loadOptionsMethod
  public async getCrmEntityTypesOptions(
    this: ILoadOptionsFunctions
  ): Promise<INodePropertyOptions[]> {
    try {
      // Danh sách mặc định của các entity CRM chuẩn
      const returnData: INodePropertyOptions[] = [
        {
          name: "Lead",
          value: "LEAD",
        },
        {
          name: "Deal",
          value: "DEAL",
        },
        {
          name: "Contact",
          value: "CONTACT",
        },
        {
          name: "Company",
          value: "COMPANY",
        },
      ];

      // Lấy thông tin credential
      const credentials = await this.getCredentials("bitrix24OAuth");
      console.log(
        "Credentials type:",
        credentials.oauthTokenData ? "OAuth" : "Webhook"
      );

      // Xác định URL API dựa trên loại credential
      let url = "";
      if (credentials.oauthTokenData) {
        // OAuth
        url = "/rest/crm.type.list";
      } else if (credentials.webhookUrl) {
        // Webhook
        const webhookUrl = credentials.webhookUrl as string;
        url = `${webhookUrl}/crm.type.list`;
      } else {
        throw new Error("No valid credentials found");
      }

      console.log("API URL:", url);

      // Gọi API dựa trên loại credentials
      let responseData;
      if (credentials.oauthTokenData) {
        // OAuth - sử dụng httpRequestWithAuthentication
        responseData = await this.helpers.httpRequestWithAuthentication.call(
          this,
          "bitrix24OAuth",
          {
            method: "POST",
            url,
            body: {},
          }
        );
      } else {
        // Webhook - sử dụng httpRequest trực tiếp
        responseData = await this.helpers.httpRequest({
          method: "POST",
          url,
          body: {},
        });
      }

      console.log(
        "API Response for CRM entity types (raw):",
        JSON.stringify(responseData, null, 2)
      );

      // Xử lý kết quả từ API
      if (responseData && responseData.result) {
        console.log("Found result property in response");

        // Hỗ trợ cả hai loại format response
        let types = [];
        if (Array.isArray(responseData.result)) {
          console.log(
            "Result is an array with length:",
            responseData.result.length
          );
          types = responseData.result;
        } else if (
          responseData.result.types &&
          Array.isArray(responseData.result.types)
        ) {
          console.log(
            "Result.types is an array with length:",
            responseData.result.types.length
          );
          types = responseData.result.types;
        } else {
          console.log(
            "Result structure is neither an array nor has types array:",
            typeof responseData.result
          );
        }

        if (Array.isArray(types) && types.length > 0) {
          console.log("Processing types array with length:", types.length);
          for (const type of types) {
            console.log("Processing type:", JSON.stringify(type));
            if (type.entityTypeId && type.title) {
              returnData.push({
                name: type.title, // Tên hiển thị từ API
                value: `DYNAMIC_${type.entityTypeId}`, // Format chuẩn cho dynamic entity
                description: `Smart Process Type ID: ${type.entityTypeId}`,
              });
              console.log(
                `Added dynamic entity: ${type.title} (DYNAMIC_${type.entityTypeId})`
              );
            }
          }
        } else {
          console.log("No valid types found in the response");
        }
      } else {
        console.log("No result property found in response");
      }

      console.log("Final returnData length:", returnData.length);
      return returnData;
    } catch (error) {
      console.error("Error loading CRM entity types:", error);

      // Log chi tiết lỗi để debug
      if (error.message) {
        console.log("Error message:", error.message);
      }
      if (error.response) {
        console.log("Error response:", JSON.stringify(error.response, null, 2));
      }
      if (error.stack) {
        console.log("Error stack:", error.stack);
      }

      // Trả về danh sách mặc định nếu có lỗi
      return [
        {
          name: "Lead",
          value: "LEAD",
        },
        {
          name: "Deal",
          value: "DEAL",
        },
        {
          name: "Contact",
          value: "CONTACT",
        },
        {
          name: "Company",
          value: "COMPANY",
        },
      ];
    }
  }
}

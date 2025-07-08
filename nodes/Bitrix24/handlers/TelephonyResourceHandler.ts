import {
  IExecuteFunctions,
  INodeExecutionData,
  IDataObject,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handler for Bitrix24 Telephony operations
 */
export class TelephonyResourceHandler extends ResourceHandlerBase {
  private readonly endpoints: { [key: string]: string } = {
    // External Call Operations - Confirmed endpoints
    externalCallRegister: "telephony.externalcall.register",
    externalCallFinish: "telephony.externalcall.finish",
    externalCallHide: "telephony.externalcall.hide",
    externalCallShow: "telephony.externalcall.show",
    externalCallSearchCrm: "telephony.externalcall.searchcrmentities",
    externalCallAttachRecord: "telephony.externalcall.attachrecord",

    // External Line Operations - Confirmed endpoints
    externalLineGet: "telephony.externalline.get",
    externalLineAdd: "telephony.externalline.add",
    externalLineUpdate: "telephony.externalline.update",
    externalLineDelete: "telephony.externalline.delete",

    // Voximplant Operations - Confirmed endpoints
    voximplantStatistics: "voximplant.statistic.get",
    voximplantLineGet: "voximplant.line.get",
    voximplantSipConnectorGet: "voximplant.sip.connector.status",
    voximplantSipLineGet: "voximplant.sip.line.get",
    voximplantSipLineAdd: "voximplant.sip.line.add",
    voximplantSipLineUpdate: "voximplant.sip.line.update",
    voximplantSipLineDelete: "voximplant.sip.line.delete",
  };

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process Telephony operations
   */
  public async process(): Promise<INodeExecutionData[]> {
    for (let i = 0; i < this.items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        switch (operation) {
          // External Call Operations
          case "externalCallRegister":
            await this.handleExternalCallRegister(i);
            break;
          case "externalCallFinish":
            await this.handleExternalCallFinish(i);
            break;
          case "externalCallHide":
            await this.handleExternalCallHide(i);
            break;
          case "externalCallShow":
            await this.handleExternalCallShow(i);
            break;
          case "externalCallSearchCrm":
            await this.handleExternalCallSearchCrm(i);
            break;
          case "externalCallAttachRecord":
            await this.handleExternalCallAttachRecord(i);
            break;

          // External Line Operations
          case "externalLineGet":
            await this.handleExternalLineGet(i);
            break;
          case "externalLineAdd":
            await this.handleExternalLineAdd(i);
            break;
          case "externalLineUpdate":
            await this.handleExternalLineUpdate(i);
            break;
          case "externalLineDelete":
            await this.handleExternalLineDelete(i);
            break;

          // Voximplant Operations
          case "voximplantStatistics":
            await this.handleVoximplantStatistics(i);
            break;
          case "voximplantLineGet":
            await this.handleVoximplantLineGet(i);
            break;
          case "voximplantSipConnectorGet":
            await this.handleVoximplantSipConnectorGet(i);
            break;
          case "voximplantSipLineGet":
            await this.handleVoximplantSipLineGet(i);
            break;
          case "voximplantSipLineAdd":
            await this.handleVoximplantSipLineAdd(i);
            break;
          case "voximplantSipLineUpdate":
            await this.handleVoximplantSipLineUpdate(i);
            break;
          case "voximplantSipLineDelete":
            await this.handleVoximplantSipLineDelete(i);
            break;

          default:
            throw new NodeOperationError(
              this.executeFunctions.getNode(),
              `Operation "${operation}" is not supported for Telephony`,
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

  // External Call Operations

  /**
   * Handle 'externalCallRegister' operation
   */
  private async handleExternalCallRegister(itemIndex: number): Promise<void> {
    const phoneNumber = this.getNodeParameter(
      "phoneNumber",
      itemIndex
    ) as string;
    const callType = this.getNodeParameter("callType", itemIndex) as string;

    const requestParams: IDataObject = {
      PHONE_NUMBER: phoneNumber,
      TYPE: callType,
    };

    // Optional parameters
    try {
      const userId = this.getNodeParameter("userId", itemIndex) as string;
      if (userId) requestParams.USER_ID = userId;
    } catch (error) {}

    try {
      const lineNumber = this.getNodeParameter(
        "lineNumber",
        itemIndex
      ) as string;
      if (lineNumber) requestParams.LINE_NUMBER = lineNumber;
    } catch (error) {}

    const responseData = await this.makeApiCall(
      this.endpoints.externalCallRegister,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalCallFinish' operation
   */
  private async handleExternalCallFinish(itemIndex: number): Promise<void> {
    const callId = this.getNodeParameter("callId", itemIndex) as string;

    const requestParams: IDataObject = {
      CALL_ID: callId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalCallFinish,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalCallHide' operation
   */
  private async handleExternalCallHide(itemIndex: number): Promise<void> {
    const callId = this.getNodeParameter("callId", itemIndex) as string;

    const requestParams: IDataObject = {
      CALL_ID: callId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalCallHide,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalCallShow' operation
   */
  private async handleExternalCallShow(itemIndex: number): Promise<void> {
    const callId = this.getNodeParameter("callId", itemIndex) as string;

    const requestParams: IDataObject = {
      CALL_ID: callId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalCallShow,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalCallSearchCrm' operation
   */
  private async handleExternalCallSearchCrm(itemIndex: number): Promise<void> {
    const phoneNumber = this.getNodeParameter(
      "phoneNumber",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      PHONE_NUMBER: phoneNumber,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalCallSearchCrm,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalCallAttachRecord' operation
   */
  private async handleExternalCallAttachRecord(
    itemIndex: number
  ): Promise<void> {
    const callId = this.getNodeParameter("callId", itemIndex) as string;
    const recordUrl = this.getNodeParameter("recordUrl", itemIndex) as string;

    const requestParams: IDataObject = {
      CALL_ID: callId,
      RECORD_URL: recordUrl,
    };

    try {
      const fileName = this.getNodeParameter("fileName", itemIndex) as string;
      if (fileName) requestParams.FILENAME = fileName;
    } catch (error) {}

    const responseData = await this.makeApiCall(
      this.endpoints.externalCallAttachRecord,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  // External Line Operations

  /**
   * Handle 'externalLineGet' operation
   */
  private async handleExternalLineGet(itemIndex: number): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalLineGet,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalLineAdd' operation
   */
  private async handleExternalLineAdd(itemIndex: number): Promise<void> {
    const lineName = this.getNodeParameter("lineName", itemIndex) as string;
    const lineNumber = this.getNodeParameter(
      "lineNumberAdd",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      NAME: lineName,
      NUMBER: lineNumber,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalLineAdd,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalLineUpdate' operation
   */
  private async handleExternalLineUpdate(itemIndex: number): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;
    const lineName = this.getNodeParameter("lineName", itemIndex) as string;
    const lineNumber = this.getNodeParameter(
      "lineNumberAdd",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
      NAME: lineName,
      NUMBER: lineNumber,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalLineUpdate,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'externalLineDelete' operation
   */
  private async handleExternalLineDelete(itemIndex: number): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.externalLineDelete,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  // Voximplant Operations

  /**
   * Handle 'voximplantStatistics' operation
   */
  private async handleVoximplantStatistics(itemIndex: number): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
    };

    // Optional date filters
    try {
      const dateFrom = this.getNodeParameter("dateFrom", itemIndex) as string;
      if (dateFrom) requestParams.DATE_FROM = dateFrom;
    } catch (error) {}

    try {
      const dateTo = this.getNodeParameter("dateTo", itemIndex) as string;
      if (dateTo) requestParams.DATE_TO = dateTo;
    } catch (error) {}

    // Handle additional options
    try {
      const options = this.getNodeParameter(
        "options",
        itemIndex,
        {}
      ) as IDataObject;

      if (options.filter) {
        const filter = this.parseJsonParameter(
          options.filter as string,
          "Filter is not valid JSON",
          itemIndex
        );
        Object.assign(requestParams, filter);
      }

      if (options.sort) {
        const sort = this.parseJsonParameter(
          options.sort as string,
          "Sort is not valid JSON",
          itemIndex
        );
        requestParams.ORDER = sort;
      }

      if (options.limit) {
        requestParams.LIMIT = options.limit;
      }

      if (options.start) {
        requestParams.START = options.start;
      }
    } catch (error) {}

    const responseData = await this.makeApiCall(
      this.endpoints.voximplantStatistics,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'voximplantLineGet' operation
   */
  private async handleVoximplantLineGet(itemIndex: number): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.voximplantLineGet,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'voximplantSipConnectorGet' operation
   */
  private async handleVoximplantSipConnectorGet(
    itemIndex: number
  ): Promise<void> {
    const requestParams: IDataObject = {};

    const responseData = await this.makeApiCall(
      this.endpoints.voximplantSipConnectorGet,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'voximplantSipLineGet' operation
   */
  private async handleVoximplantSipLineGet(itemIndex: number): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.voximplantSipLineGet,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'voximplantSipLineAdd' operation
   */
  private async handleVoximplantSipLineAdd(itemIndex: number): Promise<void> {
    const lineName = this.getNodeParameter("lineName", itemIndex) as string;
    const lineNumber = this.getNodeParameter(
      "lineNumberAdd",
      itemIndex
    ) as string;
    const sipServer = this.getNodeParameter("sipServer", itemIndex) as string;
    const sipLogin = this.getNodeParameter("sipLogin", itemIndex) as string;
    const sipPassword = this.getNodeParameter(
      "sipPassword",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      NAME: lineName,
      NUMBER: lineNumber,
      SIP_SERVER: sipServer,
      SIP_LOGIN: sipLogin,
      SIP_PASSWORD: sipPassword,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.voximplantSipLineAdd,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'voximplantSipLineUpdate' operation
   */
  private async handleVoximplantSipLineUpdate(
    itemIndex: number
  ): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;
    const lineName = this.getNodeParameter("lineName", itemIndex) as string;
    const lineNumber = this.getNodeParameter(
      "lineNumberAdd",
      itemIndex
    ) as string;
    const sipServer = this.getNodeParameter("sipServer", itemIndex) as string;
    const sipLogin = this.getNodeParameter("sipLogin", itemIndex) as string;
    const sipPassword = this.getNodeParameter(
      "sipPassword",
      itemIndex
    ) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
      NAME: lineName,
      NUMBER: lineNumber,
      SIP_SERVER: sipServer,
      SIP_LOGIN: sipLogin,
      SIP_PASSWORD: sipPassword,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.voximplantSipLineUpdate,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }

  /**
   * Handle 'voximplantSipLineDelete' operation
   */
  private async handleVoximplantSipLineDelete(
    itemIndex: number
  ): Promise<void> {
    const lineId = this.getNodeParameter("lineId", itemIndex) as string;

    const requestParams: IDataObject = {
      LINE_ID: lineId,
    };

    const responseData = await this.makeApiCall(
      this.endpoints.voximplantSipLineDelete,
      requestParams,
      {},
      itemIndex
    );
    this.addResponseToReturnData(responseData, itemIndex);
  }
}

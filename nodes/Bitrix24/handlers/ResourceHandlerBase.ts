import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import {
  makeStandardBitrix24Call,
  returnFullBitrix24Response,
  bitrix24Request,
} from "../GenericFunctions";

// Import the options interface from the factory
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Base class for all Bitrix24 resource handlers
 * Defines the common structure and methods for handling different Bitrix24 resources
 */
export abstract class ResourceHandlerBase {
  protected readonly executeFunctions: IExecuteFunctions;
  protected readonly returnData: INodeExecutionData[];
  protected readonly items: INodeExecutionData[];
  protected readonly options: IResourceHandlerOptions;
  protected isDebugMode: boolean;

  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    this.executeFunctions = executeFunctions;
    this.returnData = returnData;
    this.items = executeFunctions.getInputData();
    this.options = options;
    this.isDebugMode =
      this.options.debug === true || process.env.DEBUG === "true";

    if (this.isDebugMode) {
      console.log(
        `ResourceHandlerBase: Initialized with options:`,
        JSON.stringify(this.options)
      );
    }
  }

  /**
   * Process the operations for this resource
   * Each resource handler should implement this method to handle its specific operations
   */
  public abstract process(): Promise<INodeExecutionData[]>;

  /**
   * Make a standardized API call to Bitrix24
   * This encapsulates the standard way to call Bitrix24 API
   */
  protected async makeApiCall(
    endpoint: string,
    body: IDataObject = {},
    queryParams: IDataObject = {},
    itemIndex: number = 0,
    getAllItems: boolean = false
  ): Promise<any> {
    // Add this log to always show when the function is called
    console.log(`=== RESOURCE HANDLER MAKE API CALL: ${endpoint} ===`);

    try {
      console.log(
        `ResourceHandlerBase.makeApiCall: Calling endpoint ${endpoint}`
      );

      // Check if we need to add an accessToken from options
      const options = this.getOptionsWithAccessToken(itemIndex, {});
      options.debug = true; // Always enable debug mode for troubleshooting

      if (options.accessToken) {
        // Log that we found an access token in options
        console.log(
          `ResourceHandlerBase.makeApiCall: Found access_token in options`
        );
      }

      // Get authentication type from node parameters
      let authType = "unknown";
      try {
        authType = this.getNodeParameter(
          "authentication",
          itemIndex,
          "oAuth2"
        ) as string;
        console.log(
          `ResourceHandlerBase.makeApiCall: Using authentication type: ${authType}`
        );
      } catch (error) {
        console.log(
          `ResourceHandlerBase.makeApiCall: Could not get authentication parameter, using default`
        );
      }

      // Add auth type to options
      options.authType = authType.toLowerCase();

      // Use the appropriate authentication method
      if (this.options.forceWebhook === true) {
        if (this.isDebugMode) {
          console.log(
            `ResourceHandlerBase: Using webhook for API call to ${endpoint} (forced)`
          );
        }

        // Make the API call using webhook authentication, passing the accessToken through options
        return await bitrix24Request.call(
          this.executeFunctions,
          endpoint,
          body,
          queryParams,
          {
            debug: true,
            authType: "webhook",
            accessToken: options.accessToken as string,
          }
        );
      } else {
        console.log(
          `ResourceHandlerBase.makeApiCall: Making standard call with auth ${authType}`
        );

        // Add debug info for OAuth2
        if (authType.toLowerCase() === "oauth2") {
          try {
            const credentials = await this.executeFunctions.getCredentials(
              "bitrix24OAuth"
            );
            console.log(
              `ResourceHandlerBase.makeApiCall: OAuth2 credentials have portal URL: ${credentials.portalUrl}`
            );
          } catch (credError) {
            console.error(
              `ResourceHandlerBase.makeApiCall: Failed to get OAuth2 credentials: ${credError.message}`
            );
          }
        }

        // Create API call options with the accessToken
        const apiCallOptions: IDataObject = {
          debug: true,
          authType: authType.toLowerCase(),
        };

        // Add accessToken to options if it exists
        if (options.accessToken) {
          apiCallOptions.accessToken = options.accessToken;
        }

        // Use the standard call method which will auto-detect authentication type
        return await makeStandardBitrix24Call.call(
          this.executeFunctions,
          endpoint,
          body,
          queryParams,
          itemIndex,
          getAllItems,
          apiCallOptions
        );
      }
    } catch (error) {
      console.error(
        `ResourceHandlerBase.makeApiCall: API call to ${endpoint} failed:`,
        error
      );

      // Add more debug info for OAuth2 errors
      if (error.statusCode) {
        console.error(
          `ResourceHandlerBase.makeApiCall: Error status code: ${error.statusCode}`
        );
      }
      if (error.response) {
        console.error(
          `ResourceHandlerBase.makeApiCall: Error response:`,
          JSON.stringify(error.response, null, 2)
        );
      }

      // Instead of throwing a NodeOperationError, return the error response
      // to allow handlers to process the error and display it properly
      let bitrixErrorResponse;

      if (error.response) {
        // If there's a response object containing Bitrix error info
        bitrixErrorResponse = error.response;
      } else if (error.error) {
        // If the error is directly from Bitrix
        bitrixErrorResponse = {
          error: error.error || "UNKNOWN_ERROR",
          error_description:
            error.error_description ||
            error.message ||
            "Unknown error occurred",
        };
      } else {
        // Fallback with just error message
        bitrixErrorResponse = {
          error: "API_ERROR",
          error_description: error.message || "Unknown error occurred",
          endpoint: endpoint,
        };
      }

      // Log the error details for debugging
      console.error(
        `Bitrix24 API error response for ${endpoint}:`,
        bitrixErrorResponse
      );

      // Return error response instead of throwing
      return bitrixErrorResponse;
    }
  }

  /**
   * Process and add API response to the return data
   */
  protected addResponseToReturnData(
    responseData: any,
    itemIndex: number
  ): void {
    if (responseData) {
      const executionData = returnFullBitrix24Response.call(
        this.executeFunctions,
        responseData,
        this.executeFunctions.helpers,
        itemIndex
      );
      this.returnData.push(...executionData);
    }
  }

  /**
   * Add error details to return data for failed items
   */
  protected addErrorToReturnData(error: Error, itemIndex: number): void {
    this.returnData.push({
      json: {
        error: error.message,
        item: this.items[itemIndex].json,
      },
    });
  }

  /**
   * Check if execution should continue on error
   */
  protected continueOnFail(): boolean {
    return this.executeFunctions.getNode().continueOnFail === true;
  }

  /**
   * Get a parameter value for the current operation
   */
  protected getNodeParameter(
    parameterName: string,
    itemIndex: number,
    fallback?: any
  ): any {
    return this.executeFunctions.getNodeParameter(
      parameterName,
      itemIndex,
      fallback
    );
  }

  /**
   * Get options with access token handling
   * This provides a consistent way to get options that might include an accessToken
   * Handles multiple option fields (options, taskOptions, instanceOptions, etc.)
   */
  protected getOptionsWithAccessToken(
    itemIndex: number,
    defaultOptions: IDataObject = {}
  ): IDataObject {
    let options: IDataObject = { ...defaultOptions };

    // List of possible option parameter names
    const optionParameterNames = [
      "options",
      "taskOptions",
      "instanceOptions",
      "additionalOptions",
      "advancedOptions",
    ];

    try {
      // Try to get options from all possible option parameters
      for (const paramName of optionParameterNames) {
        try {
          const paramOptions = this.getNodeParameter(
            paramName,
            itemIndex,
            null
          ) as IDataObject | null;

          // If options exist, merge them with existing options
          if (paramOptions !== null) {
            options = { ...options, ...paramOptions };
          }
        } catch (error) {
          // Ignore errors for parameters that don't exist
        }
      }

      // Make sure accessToken is a string if it exists
      if (options.accessToken !== undefined) {
        options.accessToken = String(options.accessToken).trim();

        // If accessToken is empty string, delete it to avoid sending empty tokens
        if (options.accessToken === "") {
          delete options.accessToken;
        }
      }

      return options;
    } catch (error) {
      // If all option parameters don't exist or there's an error, return default options
      return options;
    }
  }

  /**
   * Parse JSON parameters safely
   */
  protected parseJsonParameter(
    json: string,
    errorMessage: string,
    itemIndex: number
  ): IDataObject {
    try {
      return JSON.parse(json);
    } catch (error) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        errorMessage,
        { itemIndex }
      );
    }
  }
}

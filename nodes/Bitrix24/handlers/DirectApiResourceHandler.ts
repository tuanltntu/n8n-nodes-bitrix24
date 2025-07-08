import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  NodeOperationError,
} from "n8n-workflow";

import { ResourceHandlerBase } from "./ResourceHandlerBase";
import { IResourceHandlerOptions } from "./ResourceHandlerFactory";

/**
 * Handler for Direct API
 * Allows direct calls to any Bitrix24 API endpoint
 */
export class DirectApiResourceHandler extends ResourceHandlerBase {
  constructor(
    executeFunctions: IExecuteFunctions,
    returnData: INodeExecutionData[],
    options: IResourceHandlerOptions = {}
  ) {
    super(executeFunctions, returnData, options);
  }

  /**
   * Process the direct API call
   */
  async process(): Promise<INodeExecutionData[]> {
    // Process each item
    const items = this.executeFunctions.getInputData();
    const returnItems: INodeExecutionData[] = [];

    // Process each item
    for (let i = 0; i < items.length; i++) {
      try {
        // Get operation first
        const operation = this.executeFunctions.getNodeParameter(
          "operation",
          i
        ) as string;

        if (operation !== "call") {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            `Unsupported operation: ${operation}`,
            { itemIndex: i }
          );
        }

        // Get endpoint
        const endpoint = this.executeFunctions.getNodeParameter(
          "endpoint",
          i
        ) as string;

        if (!endpoint || endpoint.trim() === "") {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            "Endpoint cannot be empty",
            { itemIndex: i }
          );
        }

        // Get additional options
        const options = this.executeFunctions.getNodeParameter(
          "directApiOptions",
          i,
          {}
        ) as IDataObject;

        // Store request info for debug
        const requestInfo: IDataObject = {
          endpoint,
          timestamp: new Date().toISOString(),
        };

        // Try to get body as JSON
        let body = {};
        let bodyError = null;
        try {
          const bodyJson = this.executeFunctions.getNodeParameter(
            "body",
            i,
            "{}"
          ) as string;

          // Store raw body for debug purposes
          requestInfo.rawBody = bodyJson;

          // Check if the input is already an object (happens when using expression)
          if (typeof bodyJson === "object") {
            body = bodyJson;
            requestInfo.body = body;
          } else {
            // Try to parse the string as JSON
            try {
              body = JSON.parse(bodyJson);
              requestInfo.body = body;
            } catch (parseError) {
              bodyError = parseError;
              requestInfo.parseError = parseError.message;
            }
          }
        } catch (e) {
          bodyError = e;
          requestInfo.parseError = e.message;
        }

        // If there was a JSON parsing error and debug mode is on, return detailed error
        if (bodyError && options.debug === true) {
          const errorItem: INodeExecutionData = {
            json: {
              error: "Invalid JSON in Request Body",
              _debug: {
                request: requestInfo,
                error: {
                  message: bodyError.message,
                  stack: bodyError.stack,
                  timestamp: new Date().toISOString(),
                },
              },
            },
            pairedItem: { item: i },
          };
          returnItems.push(errorItem);
          continue; // Skip to next item
        }

        // If there was a JSON parsing error and we're still here, throw the error
        if (bodyError) {
          throw new NodeOperationError(
            this.executeFunctions.getNode(),
            "Invalid JSON in Request Body",
            { itemIndex: i }
          );
        }

        // Make API call
        const responseData = await this.makeApiCall(endpoint, body, {}, i);

        // Create return item
        const newItem: INodeExecutionData = {
          json: responseData,
          pairedItem: { item: i },
        };

        // Add debug information if debug mode is enabled
        if (options.debug === true) {
          newItem.json = {
            ...newItem.json,
            _debug: {
              request: requestInfo,
              response: {
                statusCode: 200, // Assuming success since we have data
                timestamp: new Date().toISOString(),
              },
            },
          };
        }

        // Add to return data
        returnItems.push(newItem);
      } catch (error) {
        if (this.continueOnFail()) {
          const errorItem: INodeExecutionData = {
            json: {
              error: error.message,
            },
            pairedItem: { item: i },
          };

          // Add debug information if debug mode is enabled
          try {
            const options = this.executeFunctions.getNodeParameter(
              "directApiOptions",
              i,
              {}
            ) as IDataObject;

            if (options.debug === true) {
              // Try to get the endpoint and body for debug info
              let endpoint = "";
              let body = {};

              try {
                endpoint = this.executeFunctions.getNodeParameter(
                  "endpoint",
                  i
                ) as string;
              } catch (e) {
                // Ignore if we can't get the endpoint
              }

              try {
                const bodyJson = this.executeFunctions.getNodeParameter(
                  "body",
                  i,
                  "{}"
                ) as string;
                body = JSON.parse(bodyJson);
              } catch (e) {
                // Ignore if we can't parse the body
              }

              errorItem.json._debug = {
                request: {
                  endpoint,
                  body,
                  timestamp: new Date().toISOString(),
                },
                error: {
                  message: error.message,
                  stack: error.stack,
                  timestamp: new Date().toISOString(),
                },
              };
            }
          } catch (debugError) {
            // Ignore errors in debug info generation
          }

          returnItems.push(errorItem);
        } else {
          throw error;
        }
      }
    }

    return returnItems;
  }
}

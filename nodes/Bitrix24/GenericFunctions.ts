import {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  IBinaryKeyData,
  ICredentialDataDecryptedObject,
  ICredentialTestFunctions,
  IHttpRequestOptions,
  IHttpRequestMethods,
} from "n8n-workflow";
import { NodeApiError } from "n8n-workflow";

// Custom interface for HTTP request options with formData
interface IExtendedHttpRequestOptions extends IHttpRequestOptions {
  formData?: { [key: string]: any };
}

/**
 * Simplified Bitrix24 API request function that handles all authentication types
 */
export async function bitrix24Request(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  options: IDataObject = {}
) {
  const authType = ((options.authType as string) || "oauth2").toLowerCase();

  try {
    // Use the appropriate auth method based on authType
    if (authType === "webhook") {
      return await bitrix24WebhookCall.call(this, endpoint, body, qs, options);
    } else if (authType === "apikey") {
      return await bitrix24ApiKeyCall.call(this, endpoint, body, qs, options);
    } else {
      // Default to OAuth2
      // Get credentials
      const credentials = await this.getCredentials("bitrix24OAuth");
      const portalUrl = (credentials.portalUrl as string).replace(/\/$/, "");

      // Remove leading slash if it exists
      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint.substring(1)
        : endpoint;

      // Form request URL
      const url = `${portalUrl}/rest/${cleanEndpoint}`;

      // Prepare request options
      const requestOptions: IHttpRequestOptions = {
        method: "POST",
        body,
        qs,
        url,
        json: true,
      };

      try {
        // Make the request using OAuth2 helper
        const response = await this.helpers.requestOAuth2.call(
          this,
          "bitrix24OAuth",
          requestOptions
        );

        // Trả về response trực tiếp không qua xử lý
        return response;
      } catch (error) {
        // Check if we should fall back to webhook
        if (error.statusCode === 401 && options.fallbackToWebhook === true) {
          return await bitrix24WebhookCall.call(
            this,
            endpoint,
            body,
            qs,
            options
          );
        }

        // Return error response instead of throwing
        return handleBitrix24Error(error, authType);
      }
    }
  } catch (error) {
    // Return error response instead of throwing
    return handleBitrix24Error(error, authType);
  }
}

/**
 * Make an API request to Bitrix24 using webhook
 */
async function bitrix24WebhookCall(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  options: IDataObject = {}
) {
  // Get webhook credentials
  const credentials = await this.getCredentials("bitrix24Webhook");
  const webhookUrl = credentials.webhookUrl as string;

  // Ensure we have a valid webhook URL
  if (!webhookUrl) {
    throw new Error("No webhook URL provided in credentials");
  }

  let url: string;

  // Check if an access_token was provided in options
  if (options.accessToken && typeof options.accessToken === "string") {
    // Extract portal base URL from webhook URL
    // Webhook URL format: https://domain.bitrix24.com/rest/USER_ID/WEBHOOK_CODE/
    // We need: https://domain.bitrix24.com/rest/endpoint?auth=accessToken
    const webhookUrlParts = webhookUrl.match(/^(https?:\/\/[^\/]+)/);
    if (!webhookUrlParts) {
      throw new Error("Invalid webhook URL format");
    }

    const portalBaseUrl = webhookUrlParts[1];

    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.substring(1)
      : endpoint;

    // Build URL with portal base + /rest/ + endpoint
    url = `${portalBaseUrl}/rest/${cleanEndpoint}`;

    // Add auth parameter to query string
    if (!qs.auth) {
      qs.auth = options.accessToken;
    }
  } else {
    // Use webhook URL as-is (built-in authentication)
    // Remove trailing slash if present
    const baseUrl = webhookUrl.replace(/\/$/, "");

    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.substring(1)
      : endpoint;

    // Form the complete URL for webhook call
    url = `${baseUrl}/${cleanEndpoint}`;
  }

  // Make HTTP request
  const requestOptions: IHttpRequestOptions = {
    method: "POST",
    url,
    body,
    qs,
    json: true,
  };

  try {
    const response = await this.helpers.request(requestOptions);

    // Trả về response trực tiếp không qua xử lý
    return response;
  } catch (error) {
    // Xử lý đặc biệt cho lỗi có cấu trúc "400 - {...}"
    if (
      error.response &&
      error.response.body &&
      typeof error.response.body === "string"
    ) {
      const errorBody = error.response.body;
      const statusMatch = errorBody.match(/^(\d+)\s*-\s*(\{.*\})$/);

      if (statusMatch) {
        try {
          const status = parseInt(statusMatch[1], 10);
          const jsonPart = statusMatch[2];
          const parsedError = JSON.parse(jsonPart);

          if (parsedError.error && parsedError.error_description) {
            return {
              error: parsedError.error,
              error_description: parsedError.error_description,
              status: status,
              original_error: parsedError,
              auth_type: "webhook",
            };
          }
        } catch (parseError) {
          // Nếu không parse được JSON, sử dụng handleBitrix24Error
        }
      }
    }

    // Trả về lỗi đã định dạng
    return handleBitrix24Error(error, "webhook");
  }
}

/**
 * Make an API request to Bitrix24 using OAuth2 or API Key
 */
async function bitrix24ApiKeyCall(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  options: IDataObject = {}
) {
  // Get API key credentials
  const credentials = await this.getCredentials("bitrix24Api");
  const portalUrl = (credentials.portalUrl as string).replace(/\/$/, "");

  // Use access token from options or from credentials
  let accessToken = options.accessToken as string;
  if (!accessToken) {
    accessToken = credentials.accessToken as string;
  }

  // Remove leading slash if it exists
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;

  // Form request URL
  const url = `${portalUrl}/rest/${cleanEndpoint}`;

  // Add auth parameter to query string
  if (!qs.auth) {
    qs.auth = accessToken;
  }

  // Prepare request options
  const requestOptions: IHttpRequestOptions = {
    method: "POST",
    body,
    qs,
    url,
    json: true,
  };

  try {
    const response = await this.helpers.request(requestOptions);

    // Check if response contains error fields from Bitrix24
    if (response?.error) {
      // Format the error properly
      return {
        error: response.error,
        error_description:
          response.error_description || "Unknown Bitrix24 error",
        status: response.status || 400,
        original_error: response,
        auth_type: "apikey",
      };
    }

    return handleBitrix24Response(response);
  } catch (error) {
    // Check if we need to refresh the token
    if (
      error.statusCode === 401 &&
      error.error &&
      error.error.error === "expired_token"
    ) {
      // Token expired, need to refresh
      try {
        const refreshedToken = await refreshAccessToken.call(
          this,
          credentials as IDataObject
        );

        if (refreshedToken && refreshedToken.accessToken) {
          // Update query string with new token
          qs.auth = refreshedToken.accessToken;
          requestOptions.qs = qs;

          // Retry request with new token
          try {
            const retryResponse = await this.helpers.request(requestOptions);

            // Check if retry response contains error fields from Bitrix24
            if (retryResponse?.error) {
              // Format the error properly
              return {
                error: retryResponse.error,
                error_description:
                  retryResponse.error_description || "Unknown Bitrix24 error",
                status: retryResponse.status || 400,
                original_error: retryResponse,
                auth_type: "apikey",
              };
            }

            return handleBitrix24Response(retryResponse);
          } catch (retryError) {
            // Return error response instead of throwing
            return handleBitrix24Error(retryError, "apikey");
          }
        } else {
          throw new Error(`Failed to refresh token: No token returned`);
        }
      } catch (refreshError) {
        // Return error response instead of throwing
        return handleBitrix24Error(
          {
            message: `Token refresh failed: ${refreshError.message}`,
            statusCode: 401,
          },
          "apikey"
        );
      }
    }

    // Return error response instead of throwing
    return handleBitrix24Error(error, "apikey");
  }
}

/**
 * Handle standard Bitrix24 response
 */
function handleBitrix24Response(response: any): any {
  if (typeof response !== "object") {
    return { result: response };
  }

  // Check if response contains Bitrix24 error fields
  if (response?.error) {
    // Return in standardized error format
    return {
      error: response.error,
      error_description: response.error_description || "Unknown Bitrix24 error",
      status: response.status || 400,
      original_error: response,
    };
  }

  return response;
}

/**
 * Handle error from Bitrix24 response
 */
function handleBitrix24Error(error: any, authType = "unknown") {
  let errorMessage = "Unknown Bitrix24 API error";
  let errorCode = "UNKNOWN_ERROR";
  let statusCode = error.statusCode || 500;
  let errorBody: any = {};

  // First check if error already has bitrix24 error format
  if (error.error && error.error_description) {
    errorCode = error.error;
    errorMessage = error.error_description;
    errorBody = error;
  }
  // Check if response body exists and try to parse it
  else if (error.response?.body) {
    try {
      // Handle special case for string response like "400 - {...}"
      if (typeof error.response.body === "string") {
        const statusMatch = error.response.body.match(/^(\d+)\s*-\s*(.*)/);

        if (statusMatch) {
          // Extract status code and remaining text
          statusCode = parseInt(statusMatch[1], 10);
          const remainingText = statusMatch[2].trim();

          // Try to parse remaining text as JSON if it looks like JSON
          if (remainingText.startsWith("{") && remainingText.endsWith("}")) {
            try {
              const parsedJson = JSON.parse(remainingText);

              if (parsedJson.error) {
                errorCode = parsedJson.error;
              }

              if (parsedJson.error_description) {
                errorMessage = parsedJson.error_description;
              }

              errorBody = parsedJson;
              return {
                error: errorCode,
                error_description: errorMessage,
                status: statusCode,
                original_error: errorBody,
                auth_type: authType,
              };
            } catch (e) {
              // Failed to parse as JSON, use as text
              errorMessage = remainingText;
              errorBody = { raw_text: remainingText };
            }
          } else {
            // Not JSON format, use as text
            errorMessage = remainingText;
            errorBody = { raw_text: remainingText };
          }
        } else {
          // Not status code format, try to parse whole body as JSON
          try {
            errorBody = JSON.parse(error.response.body);

            if (errorBody.error) {
              errorCode = errorBody.error;
            }

            if (errorBody.error_description) {
              errorMessage = errorBody.error_description;
            }
          } catch (e) {
            // Not JSON, use as plain text
            errorMessage = error.response.body;
            errorBody = { raw_text: error.response.body };
          }
        }
      } else {
        // Body is already an object
        errorBody = error.response.body;

        if (errorBody.error) {
          errorCode = errorBody.error;
        }

        if (errorBody.error_description) {
          errorMessage = errorBody.error_description;
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  } else if (error.statusCode === 401) {
    errorMessage = `Authentication failed (${authType})`;
    errorCode = "AUTH_FAILED";
  } else if (error.statusCode === 404) {
    errorMessage = `Endpoint not found: ${error.options?.url || "unknown"}`;
    errorCode = "ENDPOINT_NOT_FOUND";
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Return error response instead of throwing
  return {
    error: errorCode,
    error_description: errorMessage,
    status: statusCode,
    original_error: errorBody,
    auth_type: authType,
  };
}

/**
 * Simplified function to make a standard Bitrix24 call
 */
export async function makeStandardBitrix24Call(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  itemIndex: number = 0,
  getAllItems: boolean = false,
  callOptions: IDataObject = {}
): Promise<any> {
  // Get authentication type from node parameters or from callOptions
  let authType = callOptions.authType as string;
  if (!authType) {
    authType = this.getNodeParameter(
      "authentication",
      itemIndex,
      "oAuth2"
    ) as string;
  }

  // Check if we should fall back to webhook if OAuth2 fails
  const fallbackToWebhook =
    authType === "oAuth2"
      ? (this.getNodeParameter(
          "fallbackToWebhook",
          itemIndex,
          false
        ) as boolean)
      : false;

  // Get additional options if any
  let options: IDataObject = {};
  try {
    options = this.getNodeParameter("options", itemIndex, {}) as IDataObject;
  } catch (e) {
    // Options parameter is optional
  }

  // Merge with call options
  options = { ...options, ...callOptions };

  // Add auth-related options
  options.authType = authType.toLowerCase();
  options.fallbackToWebhook = fallbackToWebhook;

  // Check for access_token in options and make sure it's a string
  if (options.access_token) {
    options.accessToken = String(options.access_token).trim();
    // Log that we're using access_token from options
    console.log(`makeStandardBitrix24Call: Using access_token from options`);
  }

  // Check for accessToken from callOptions
  if (options.accessToken) {
    options.accessToken = String(options.accessToken).trim();
    console.log(`makeStandardBitrix24Call: Using accessToken from callOptions`);
  }

  // Make the API call
  return await bitrix24Request.call(this, endpoint, body, qs, options);
}

/**
 * Make an API request to load all items from paginated Bitrix24 API
 */
export async function bitrix24ApiRequestAllItems(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  propertyName: string,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  uri?: string
) {
  const returnData: IDataObject[] = [];
  let responseData;

  // Đảm bảo query là một đối tượng và start là một thuộc tính
  if (typeof query !== "object") {
    query = {};
  }

  // Đặt giá trị start ban đầu
  query.start = typeof query.start === "undefined" ? 0 : query.start;

  do {
    try {
      // Use the unified request method
      responseData = await bitrix24Request.call(
        this,
        endpoint,
        body,
        query,
        uri
      );

      // If the response has result but the property name doesn't exist, return full response
      if (
        !responseData ||
        !responseData.result ||
        responseData.result[propertyName] === undefined
      ) {
        return responseData;
      }

      // If the property is not an array
      if (!Array.isArray(responseData.result[propertyName])) {
        if (responseData.result[propertyName]) {
          returnData.push(responseData.result[propertyName] as IDataObject);
        }
        break;
      }

      // Add the items to our return data
      returnData.push.apply(
        returnData,
        responseData.result[propertyName] as IDataObject[]
      );

      // Increment the start position for the next page
      // Đảm bảo chuyển start thành số trước khi tăng
      query.start = parseInt(query.start as string, 10) + 50; // Default Bitrix24 page size
    } catch (error) {
      break;
    }
  } while (responseData.result[propertyName]?.length > 0);

  // Return the full collected data
  return {
    result: returnData,
  };
}

/**
 * Download a file from a URL
 */
export async function bitrix24DownloadFile(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  downloadUrl: string
) {
  try {
    const options: IHttpRequestOptions = {
      method: "GET",
      url: downloadUrl,
      encoding: null,
    };

    return await this.helpers.httpRequest(options);
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

/**
 * Validate that the binary data field exists in the input
 */
export function validateBinaryDataExists(
  helpers: IExecuteFunctions["helpers"],
  item: any,
  binaryPropertyName: string
) {
  if (item.binary === undefined) {
    throw new Error("No binary data exists on item!");
  }

  if (item.binary[binaryPropertyName] === undefined) {
    throw new Error(
      `No binary data property "${binaryPropertyName}" exists on item!`
    );
  }
}

/**
 * Test if credentials are valid
 */
export async function testAuth(
  this: ICredentialTestFunctions,
  credential: ICredentialDataDecryptedObject
): Promise<boolean> {
  const { helpers } = this;

  // Test the credentials based on which type is being used
  if (credential.hasOwnProperty("webhookUrl")) {
    // Test webhook-based API
    const webhookUrl = credential.webhookUrl as string;

    try {
      const options = {
        method: "POST" as IHttpRequestMethods,
        url: `${webhookUrl}user.current`,
        json: true,
      };

      await helpers.request(options);
      return true;
    } catch (error) {
      return false;
    }
  } else if (
    credential.hasOwnProperty("accessToken") &&
    credential.hasOwnProperty("portalUrl")
  ) {
    // Test API Key-based API
    try {
      const portalUrl = credential.portalUrl as string;
      const accessToken = credential.accessToken as string;

      // Make sure portal URL doesn't end with /
      const baseUrl = portalUrl.replace(/\/$/, "");

      const options = {
        method: "POST" as IHttpRequestMethods,
        url: `${baseUrl}/rest/user.current`,
        qs: {
          auth: accessToken,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        json: true,
      };

      await helpers.request(options);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    // Test OAuth2-based API
    try {
      const portalUrl = credential.portalUrl as string;
      // Make sure portal URL doesn't end with /
      const baseUrl = portalUrl.replace(/\/$/, "");

      const options = {
        method: "POST" as IHttpRequestMethods,
        url: `${baseUrl}/rest/user.current`,
        json: true,
      };

      await helpers.request(options, {
        oauth2: true,
        credentialsType: "bitrix24OAuth",
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Process and return full Bitrix24 API response
 * Unified handler for all response types
 */
export function returnFullBitrix24Response(
  responseData: any,
  helpers: IExecuteFunctions["helpers"],
  itemIndex: number
) {
  // Return the full response with all data exactly as received
  // without modifying its structure
  return helpers.constructExecutionMetaData(
    helpers.returnJsonArray(responseData),
    { itemData: { item: itemIndex } }
  );
}

/**
 * Load resource options for use in dropdown selectors
 */
export function getEntityFields(
  this: ILoadOptionsFunctions,
  entityType: string
): Promise<INodePropertyOptions[]> {
  return new Promise(async (resolve, reject) => {
    try {
      // Get entity fields
      const endpoint = `crm.${entityType}.fields`;

      // Use the unified request method
      const response = await bitrix24Request.call(this, endpoint);

      if (!response || !response.result) {
        return resolve([]);
      }

      // Process response to format n8n expects
      const options: INodePropertyOptions[] = [];
      for (const key in response.result) {
        const field = response.result[key] as any;

        // Custom fields (UF_*) handling
        if (key.startsWith("UF_")) {
          // Try to find the best label for custom fields
          let fieldName = "";

          // Check various possible label properties in order of preference
          if (field.formLabel) {
            fieldName = field.formLabel;
          } else if (field.listLabel) {
            fieldName = field.listLabel;
          } else if (field.editFormLabel) {
            fieldName = field.editFormLabel;
          } else if (field.title) {
            fieldName = field.title;
          } else if (field.NAME) {
            fieldName = field.NAME;
          } else if (field.name) {
            fieldName = field.name;
          } else if (field.FIELD_NAME) {
            fieldName = field.FIELD_NAME;
          } else {
            // If no label found, use the field ID but mark it as custom
            fieldName = `Custom Field: ${key}`;
          }

          options.push({
            name: fieldName,
            value: key,
            description: `Custom field (${key})`,
          });
        } else {
          // Standard fields
          options.push({
            name:
              field.title ||
              field.formLabel ||
              field.listLabel ||
              field.NAME ||
              field.name ||
              key,
            value: key,
          });
        }
      }

      return resolve(options);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  credentials: ICredentialDataDecryptedObject
) {
  const portalUrl = credentials.portalUrl as string;
  const clientId = credentials.clientId as string;
  const clientSecret = credentials.clientSecret as string;
  const refreshToken = credentials.refreshToken as string;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!clientId || !clientSecret) {
    throw new Error(
      "Client ID and Client Secret are required for token refresh"
    );
  }

  const options: IHttpRequestOptions = {
    method: "GET",
    url: `https://oauth.bitrix.info/oauth/token/`,
    qs: {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    },
    json: true,
  };

  try {
    const response = await this.helpers.httpRequest(options);

    // Return the new tokens
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
    };
  } catch (error) {
    throw new Error(`Failed to refresh access token: ${error.message}`);
  }
}

/**
 * Make an API request to Bitrix24 using API Key
 */
export async function bitrix24ApiKeyRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  itemIndex: number = 0
): Promise<any> {
  try {
    const credentials = await this.getCredentials("bitrix24Api");

    // Ensure itemIndex is a valid number
    const actualItemIndex =
      typeof itemIndex === "number" && !isNaN(itemIndex) ? itemIndex : 0;

    // Check if a different access token is set on the item level
    let accessToken = "";

    try {
      // Only try to get an item-specific token if we have a valid item index
      if (typeof this.getNodeParameter === "function") {
        try {
          const options = this.getNodeParameter(
            "options",
            actualItemIndex,
            {}
          ) as IDataObject;
          accessToken = (options.accessToken as string) || "";
        } catch (error) {
          // Do nothing, no access token set on item level
        }
      }
    } catch (error) {
      // Error getting item-specific access token
    }

    if (accessToken === "") {
      accessToken = credentials.accessToken as string;
    }

    // Ensure auth parameter is properly set
    query.auth = accessToken;

    const options: IHttpRequestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body,
      qs: query,
      url: `${credentials.portalUrl}${
        (credentials.portalUrl as string).endsWith("/") ? "" : "/"
      }rest/${endpoint}`,
      json: true,
    };

    try {
      const response = await this.helpers.httpRequest(options);
      return response;
    } catch (error) {
      // Handle errors specifically
      if (
        error.statusCode === 401 &&
        error.error &&
        error.error.error === "expired_token"
      ) {
        // Access token expired, attempt to refresh
        try {
          const refreshToken = credentials.refreshToken as string;
          const refreshOptions: IHttpRequestOptions = {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
            qs: {
              client_id: credentials.clientId,
              grant_type: "refresh_token",
              client_secret: credentials.clientSecret,
              refresh_token: refreshToken,
            },
            url: `${credentials.portalUrl}${
              (credentials.portalUrl as string).endsWith("/") ? "" : "/"
            }oauth/token/`,
            json: true,
          };

          const refreshResponse = await this.helpers.httpRequest(
            refreshOptions
          );

          if (refreshResponse.access_token) {
            // Token refreshed successfully
            try {
              // Try to update credentials if possible, but continue even if it fails
              // @ts-ignore - updateCredentials may exist on execute functions
              if (typeof this.updateCredentials === "function") {
                // @ts-ignore
                await this.updateCredentials(
                  {
                    ...credentials,
                    accessToken: refreshResponse.access_token,
                    refreshToken:
                      refreshResponse.refresh_token || credentials.refreshToken,
                  },
                  "bitrix24Api"
                );
              }
            } catch (credentialUpdateError) {
              // Continue even if updating credentials fails
            }

            // Update the query with new token and retry the request
            query.auth = refreshResponse.access_token;
            options.qs = query;

            try {
              // Retry the original request with new token
              const retryResponse = await this.helpers.httpRequest(options);
              return retryResponse;
            } catch (retryError) {
              // If retry also fails, but for a different reason (not auth)
              // Only continue with other auth methods if it's still an auth error
              if (retryError.statusCode === 401) {
                throw new Error(
                  `Token refresh succeeded but authentication still failed: ${retryError.message}`
                );
              } else {
                // For non-auth errors, throw the specific error to show the user
                if (retryError.error && retryError.error.error_description) {
                  throw new Error(
                    `${retryError.error.error_description} (Error code: ${retryError.error.error})`
                  );
                } else {
                  throw retryError;
                }
              }
            }
          } else {
            throw new Error(
              `Token refresh failed: ${JSON.stringify(refreshResponse)}`
            );
          }
        } catch (refreshError) {
          throw new Error(`Token refresh failed: ${refreshError.message}`);
        }
      }

      // Original error is not an expired token, or refresh failed
      // Just pass through the original error
      if (error.error && error.error.error_description) {
        throw new Error(
          `${error.error.error_description} (Error code: ${error.error.error})`
        );
      } else {
        throw error;
      }
    }
  } catch (originalError) {
    // Don't try other authentication methods, just throw the original error
    // User explicitly selected API key authentication
    throw new Error(
      `Bitrix24 API Key authentication failed: ${originalError.message}`
    );
  }
}

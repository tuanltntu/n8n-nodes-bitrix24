import {
  ICredentialDataDecryptedObject,
  ICredentialType,
  INodeProperties,
  IAuthenticateGeneric,
  ICredentialTestRequest,
  IconFile,
} from "n8n-workflow";

export class Bitrix24Api implements ICredentialType {
  name = "bitrix24Api";
  displayName = "Bitrix24 API";
  documentationUrl = "bitrix24";
  icon: { light: IconFile; dark: IconFile } = {
    light: "file:../nodes/Bitrix24/bitrix24.svg" as IconFile,
    dark: "file:../nodes/Bitrix24/bitrix24.svg" as IconFile,
  };
  properties: INodeProperties[] = [
    {
      displayName: "Portal URL",
      name: "portalUrl",
      type: "string",
      default: "",
      placeholder: "https://your-portal.bitrix24.com",
      description: "The URL of your Bitrix24 portal",
      required: true,
    },
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      description: "The access token for Bitrix24 API",
      required: true,
    },
    {
      displayName: "Refresh Token",
      name: "refreshToken",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      description:
        "The refresh token for Bitrix24 API. Used to automatically refresh the access token via oauth.bitrix.info when it expires.",
      required: false,
    },
    {
      displayName: "Client ID",
      name: "clientId",
      type: "string",
      default: "",
      description:
        "The client ID of your Bitrix24 application (needed for token refresh via oauth.bitrix.info)",
      required: false,
    },
    {
      displayName: "Client Secret",
      name: "clientSecret",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      description:
        "The client secret of your Bitrix24 application (needed for token refresh via oauth.bitrix.info)",
      required: false,
    },
  ];

  // Bitrix24 doesn't use Bearer token authentication
  // It passes the access token in the URL or request body
}

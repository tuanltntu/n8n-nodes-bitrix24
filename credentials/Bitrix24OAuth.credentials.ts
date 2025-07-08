import {
  ICredentialType,
  INodeProperties,
  IAuthenticateGeneric,
  ICredentialTestRequest,
  IconFile,
} from "n8n-workflow";

export class Bitrix24OAuth implements ICredentialType {
  name = "bitrix24OAuth";
  extends = ["oAuth2Api"];
  displayName = "Bitrix24 OAuth2";
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
      description:
        "The URL of your Bitrix24 portal. Format should be: https://your-portal.bitrix24.com",
      required: true,
    },
    {
      displayName: "OAuth Scope",
      name: "scope",
      type: "string",
      default: "crm",
      description:
        "Comma-separated list of scopes to request. Example: crm,task,calendar,bizproc",
      required: true,
    },
    {
      displayName: "Client ID",
      name: "clientId",
      type: "string",
      default: "",
      required: true,
    },
    {
      displayName: "Client Secret",
      name: "clientSecret",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      required: true,
    },
    {
      displayName: "Authorization URL",
      name: "authUrl",
      type: "hidden",
      default: "=={{$parameter.portalUrl}}/oauth/authorize",
      required: true,
    },
    {
      displayName: "Access Token URL",
      name: "accessTokenUrl",
      type: "hidden",
      default: "https://oauth.bitrix.info/oauth/token/",
      required: true,
    },
    {
      displayName: "Auth URI Query Parameters",
      name: "authQueryParameters",
      type: "hidden",
      default: "response_type=code",
      required: true,
    },
    {
      displayName: "Authentication",
      name: "authentication",
      type: "hidden",
      default: "body",
      required: true,
    },
    {
      displayName: "Ignore SSL Issues",
      name: "ignoreSSLIssues",
      type: "boolean",
      default: false,
      description:
        "Whether to connect even if SSL certificate validation is not possible",
    },
  ];

  // This allows the credential to be used by other parts of n8n
  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      qs: {
        auth: "={{$credentials.accessToken}}",
      },
    },
  };

  // Test the credentials
  test: ICredentialTestRequest = {
    request: {
      baseURL: "={{$credentials.portalUrl}}",
      url: "/rest/user.current",
      method: "POST",
      qs: {
        auth: "={{$credentials.accessToken}}",
      },
    },
  };
}

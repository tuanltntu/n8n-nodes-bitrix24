import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
  IconFile,
} from "n8n-workflow";

export class Bitrix24Webhook implements ICredentialType {
  name = "bitrix24Webhook";
  displayName = "Bitrix24 Webhook";
  documentationUrl = "https://apidocs.bitrix24.com/api-reference/";
  icon: { light: IconFile; dark: IconFile } = {
    light: "file:../nodes/Bitrix24/bitrix24.svg" as IconFile,
    dark: "file:../nodes/Bitrix24/bitrix24.svg" as IconFile,
  };
  properties: INodeProperties[] = [
    {
      displayName: "Webhook URL",
      name: "webhookUrl",
      type: "string",
      default: "",
      placeholder: "https://your-portal.bitrix24.com/rest/1/webhookcode/",
      description:
        "The webhook URL for your Bitrix24 account. Format should be: https://your-portal.bitrix24.com/rest/USER_ID/WEBHOOK_CODE/",
      required: true,
    },
  ];

  // This authenticate function is called by n8n when credentials are used
  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      qs: {
        // No additional parameters needed as the auth is in the URL itself
      },
    },
  };
}

// This is the main entry point for the n8n-nodes-bitrix24 module
// It exports all the nodes that are part of this module

import { INodeTypeDescription } from "n8n-workflow";
import { Bitrix24 } from "./nodes/Bitrix24/Bitrix24.node";

// Import credential types
import { Bitrix24OAuth } from "./credentials/Bitrix24OAuth.credentials";
import { Bitrix24Api } from "./credentials/Bitrix24Api.credentials";
import { Bitrix24Webhook } from "./credentials/Bitrix24Webhook.credentials";

export {
  Bitrix24,
  // Export credentials
  Bitrix24OAuth,
  Bitrix24Api,
  Bitrix24Webhook,
};

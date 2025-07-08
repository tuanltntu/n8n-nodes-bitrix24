import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from "n8n-workflow";

import { FieldRegistry } from "./FieldRegistry";
import { ResourceHandlerFactory } from "./handlers/ResourceHandlerFactory";
import { makeStandardBitrix24Call } from "./GenericFunctions";

/**
 * Bitrix24 Node Implementation
 * Using FieldRegistry for clean architecture
 */
export class Bitrix24 implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Bitrix24",
    name: "bitrix24",
    icon: "file:bitrix24.svg",
    group: ["output"],
    version: 1,
    subtitle: "={{ $parameter['resource'] + ': ' + $parameter['operation'] }}",
    description: "Interact with Bitrix24 CRM and business platform",
    defaults: {
      name: "Bitrix24",
    },
    inputs: ["main"],
    outputs: ["main"],
    usableAsTool: true,
    credentials: [
      {
        name: "bitrix24OAuth",
        required: true,
        displayOptions: {
          show: {
            authentication: ["oAuth2"],
          },
        },
      },
      {
        name: "bitrix24Api",
        required: true,
        displayOptions: {
          show: {
            authentication: ["apiKey"],
          },
        },
      },
      {
        name: "bitrix24Webhook",
        required: true,
        displayOptions: {
          show: {
            authentication: ["webhook"],
          },
        },
      },
    ],
    properties: [
      {
        displayName: "Authentication",
        name: "authentication",
        type: "options",
        options: [
          {
            name: "OAuth2",
            value: "oAuth2",
            description:
              "Use OAuth2 authentication (recommended for production)",
          },
          {
            name: "Webhook",
            value: "webhook",
            description: "Use a Bitrix24 webhook URL (simpler but less secure)",
          },
          {
            name: "API Key",
            value: "apiKey",
            description: "Use Bitrix24 API key authentication",
          },
        ],
        default: "oAuth2",
      },
      // Resource selector
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        required: true,
        default: "crm",
        description: "Select the Bitrix24 resource to work with",
        options: FieldRegistry.getAvailableResources(),
      },
      // All fields from all description files
      ...FieldRegistry.getAvailableFields(),
    ],
  };

  methods = {
    loadOptions: {
      // Load CRM entity fields dynamically
      async getCrmEntityFields(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        try {
          const entityType = this.getCurrentNodeParameter(
            "entityType"
          ) as string;
          if (!entityType) {
            return [];
          }

          // Map entity types to their field endpoints
          const fieldEndpoints: Record<string, string> = {
            contact: "crm.contact.fields",
            deal: "crm.deal.fields",
            lead: "crm.lead.fields",
            company: "crm.company.fields",
            quote: "crm.quote.fields",
            invoice: "crm.invoice.fields",
            product: "crm.product.fields",
            activity: "crm.activity.fields",
          };

          const endpoint = fieldEndpoints[entityType];
          if (!endpoint) {
            return [];
          }

          // Use the same makeStandardBitrix24Call function as other operations
          const response = await makeStandardBitrix24Call.call(
            this,
            endpoint,
            {},
            {}
          );

          if (!response.result) {
            return [];
          }

          const fields = response.result;
          const options: INodePropertyOptions[] = [];

          // System fields that should not be set manually
          const systemFields = [
            "ID",
            "DATE_CREATE",
            "DATE_MODIFY",
            "CREATED_BY_ID",
            "MODIFY_BY_ID",
          ];

          for (const [fieldId, fieldData] of Object.entries(fields)) {
            if (systemFields.includes(fieldId)) {
              continue;
            }

            const field = fieldData as any;

            // Get display name with priority: listLabel -> formLabel -> title -> fieldId
            let displayName = fieldId; // fallback to field ID

            if (field.listLabel && field.listLabel.trim()) {
              displayName = field.listLabel.trim();
            } else if (field.formLabel && field.formLabel.trim()) {
              displayName = field.formLabel.trim();
            } else if (field.title && field.title.trim()) {
              displayName = field.title.trim();
            }

            // Create description with field type and ID info
            let description = `Field ID: ${fieldId}`;
            if (field.type) {
              description = `${field.type} - ${description}`;
            }
            if (field.isRequired) {
              description = `Required - ${description}`;
            }

            options.push({
              name: displayName,
              value: fieldId,
              description: description,
            });
          }

          // Sort options by display name
          return options.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
          return [
            {
              name: "Error loading fields",
              value: "",
              description: `Failed to load CRM fields: ${error.message}`,
            },
          ];
        }
      },

      // Load SPA Types dynamically
      async getSpaTypes(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        try {
          console.log("getSpaTypes called");

          // Get all SPA types
          const response = await makeStandardBitrix24Call.call(
            this,
            "crm.type.list",
            {},
            {}
          );

          console.log(
            "SPA Types API response:",
            JSON.stringify(response, null, 2)
          );

          if (!response.result) {
            return [
              {
                name: "No SPA types available",
                value: "",
                description: "No SPA types found",
              },
            ];
          }

          // Handle both possible response structures
          let types = [];
          if (response.result.types) {
            types = response.result.types;
          } else if (Array.isArray(response.result)) {
            types = response.result;
          } else {
            types = Object.values(response.result);
          }

          const options: INodePropertyOptions[] = [];

          for (const type of types) {
            // Use entityTypeId if available, otherwise use id
            const entityTypeId = type.entityTypeId || type.id;
            const title = type.title || type.name || `SPA Type ${entityTypeId}`;

            options.push({
              name: `${title} (ID: ${entityTypeId})`,
              value: entityTypeId.toString(),
              description: title,
            });
          }

          // Sort by name
          options.sort((a, b) => a.name.localeCompare(b.name));

          console.log("Returning SPA types:", options.length, "types");
          return options;
        } catch (error) {
          console.error("Error in getSpaTypes:", error);
          return [
            {
              name: "Error loading SPA types",
              value: "",
              description: `Failed to load SPA types: ${error.message}`,
            },
          ];
        }
      },

      // Load SPA Type IDs for Type operations (returns id field instead of entityTypeId)
      async getSpaTypeIds(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        try {
          console.log("getSpaTypeIds called");

          // Get all SPA types
          const response = await makeStandardBitrix24Call.call(
            this,
            "crm.type.list",
            {},
            {}
          );

          console.log(
            "SPA Type IDs API response:",
            JSON.stringify(response, null, 2)
          );

          if (!response.result) {
            return [
              {
                name: "No SPA types available",
                value: "",
                description: "No SPA types found",
              },
            ];
          }

          // Handle both possible response structures
          let types = [];
          if (response.result.types) {
            types = response.result.types;
          } else if (Array.isArray(response.result)) {
            types = response.result;
          } else {
            types = Object.values(response.result);
          }

          const options: INodePropertyOptions[] = [];

          for (const type of types) {
            // Use id field for Type operations
            const typeId = type.id;
            const title = type.title || type.name || `SPA Type ${typeId}`;

            options.push({
              name: `${title} (ID: ${typeId})`,
              value: typeId.toString(),
              description: title,
            });
          }

          // Sort by name
          options.sort((a, b) => a.name.localeCompare(b.name));

          console.log("Returning SPA type IDs:", options.length, "types");
          return options;
        } catch (error) {
          console.error("Error in getSpaTypeIds:", error);
          return [
            {
              name: "Error loading SPA type IDs",
              value: "",
              description: `Failed to load SPA type IDs: ${error.message}`,
            },
          ];
        }
      },

      // Load Deal Categories for deal operations
      async getDealCategories(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        try {
          console.log("getDealCategories called");

          // Get all deal categories
          const response = await makeStandardBitrix24Call.call(
            this,
            "crm.category.list",
            { entityTypeId: 2 }, // 2 is the entity type ID for deals
            {}
          );

          console.log(
            "Deal Categories API response:",
            JSON.stringify(response, null, 2)
          );

          if (!response.result) {
            return [
              {
                name: "No deal categories available",
                value: "",
                description: "No deal categories found",
              },
            ];
          }

          // Handle response structure
          let categories = [];
          if (response.result.categories) {
            categories = response.result.categories;
          } else if (Array.isArray(response.result)) {
            categories = response.result;
          } else {
            categories = Object.values(response.result);
          }

          const options: INodePropertyOptions[] = [];

          for (const category of categories) {
            const categoryId = category.id;
            const name = category.name || `Category ${categoryId}`;

            options.push({
              name: name,
              value: categoryId.toString(),
              description:
                category.isDefault === "Y" ? `${name} (Default)` : name,
            });
          }

          // Sort by name, but put default category first
          options.sort((a, b) => {
            if (a.description?.includes("(Default)")) return -1;
            if (b.description?.includes("(Default)")) return 1;
            return a.name.localeCompare(b.name);
          });

          console.log(
            "Returning deal categories:",
            options.length,
            "categories"
          );
          return options;
        } catch (error) {
          console.error("Error in getDealCategories:", error);
          return [
            {
              name: "Error loading deal categories",
              value: "",
              description: `Failed to load deal categories: ${error.message}`,
            },
          ];
        }
      },

      // Load Dynamic Types for automation module
      async getDynamicTypes(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        try {
          console.log("getDynamicTypes called");

          const options: INodePropertyOptions[] = [
            // Standard CRM types
            {
              name: "CRM Deal",
              value: "crm_deal",
              description: "CRM Deal entities",
            },
            {
              name: "CRM Lead",
              value: "crm_lead",
              description: "CRM Lead entities",
            },
            {
              name: "CRM Contact",
              value: "crm_contact",
              description: "CRM Contact entities",
            },
            {
              name: "CRM Company",
              value: "crm_company",
              description: "CRM Company entities",
            },
            {
              name: "CRM Quote",
              value: "crm_quote",
              description: "CRM Quote entities",
            },
            {
              name: "CRM Invoice",
              value: "crm_invoice",
              description: "CRM Invoice entities",
            },
            // Smart Process Automation
            {
              name: "Smart Process",
              value: "spa_placement",
              description: "Smart Process Automation entities",
            },
          ];

          // Try to get SPA types
          try {
            const spaResponse = await makeStandardBitrix24Call.call(
              this,
              "crm.type.list",
              {},
              {}
            );

            if (spaResponse.result) {
              let types = [];
              if (spaResponse.result.types) {
                types = spaResponse.result.types;
              } else if (Array.isArray(spaResponse.result)) {
                types = spaResponse.result;
              } else {
                types = Object.values(spaResponse.result);
              }

              for (const type of types) {
                const entityTypeId = type.entityTypeId || type.id;
                const title =
                  type.title || type.name || `SPA Type ${entityTypeId}`;
                options.push({
                  name: `SPA: ${title}`,
                  value: `spa_${entityTypeId}`,
                  description: `Smart Process: ${title}`,
                });
              }
            }
          } catch (spaError) {
            console.log("Could not load SPA types:", spaError.message);
          }

          console.log("Returning dynamic types:", options.length, "types");
          return options.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
          console.error("Error in getDynamicTypes:", error);
          return [
            {
              name: "Error loading dynamic types",
              value: "",
              description: `Failed to load dynamic types: ${error.message}`,
            },
          ];
        }
      },

      // Load SPA Placement Options for automation module
      async getSpaPlacementOptions(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        try {
          console.log("getSpaPlacementOptions called");

          // Get all SPA types
          const response = await makeStandardBitrix24Call.call(
            this,
            "crm.type.list",
            {},
            {}
          );

          console.log(
            "SPA Placement Options API response:",
            JSON.stringify(response, null, 2)
          );

          if (!response.result) {
            return [
              {
                name: "No SPA types available",
                value: "",
                description: "No Smart Process types found",
              },
            ];
          }

          // Handle both possible response structures
          let types = [];
          if (response.result.types) {
            types = response.result.types;
          } else if (Array.isArray(response.result)) {
            types = response.result;
          } else {
            types = Object.values(response.result);
          }

          const options: INodePropertyOptions[] = [];

          for (const type of types) {
            // Use entityTypeId if available, otherwise use id
            const entityTypeId = type.entityTypeId || type.id;
            const title = type.title || type.name || `SPA Type ${entityTypeId}`;

            // Only include types that support automation
            if (
              type.isAutomationEnabled === "Y" ||
              type.isAutomationEnabled === true
            ) {
              options.push({
                name: `${title} (ID: ${entityTypeId})`,
                value: entityTypeId.toString(),
                description: `${title} - Automation Enabled`,
              });
            }
          }

          // If no automation-enabled types found, show all types
          if (options.length === 0) {
            for (const type of types) {
              const entityTypeId = type.entityTypeId || type.id;
              const title =
                type.title || type.name || `SPA Type ${entityTypeId}`;
              options.push({
                name: `${title} (ID: ${entityTypeId})`,
                value: entityTypeId.toString(),
                description: title,
              });
            }
          }

          // Sort by name
          options.sort((a, b) => a.name.localeCompare(b.name));

          console.log(
            "Returning SPA placement options:",
            options.length,
            "types"
          );
          return options;
        } catch (error) {
          console.error("Error in getSpaPlacementOptions:", error);
          return [
            {
              name: "Error loading SPA placement options",
              value: "",
              description: `Failed to load SPA placement options: ${error.message}`,
            },
          ];
        }
      },

      // Load SPA Item Fields dynamically
      async getSpaItemFields(
        this: ILoadOptionsFunctions
      ): Promise<INodePropertyOptions[]> {
        try {
          const entityTypeId = this.getCurrentNodeParameter(
            "entityTypeId"
          ) as string;

          console.log(
            "getSpaItemFields called with entityTypeId:",
            entityTypeId
          );

          if (!entityTypeId) {
            console.log("No entityTypeId provided");
            return [
              {
                name: "Please select a Type first",
                value: "",
                description: "SPA Type is required to load fields",
              },
            ];
          }

          console.log(
            "Making API call to crm.item.fields with entityTypeId:",
            entityTypeId
          );

          // Use the same makeStandardBitrix24Call function as other operations
          const response = await makeStandardBitrix24Call.call(
            this,
            "crm.item.fields",
            { entityTypeId: entityTypeId },
            {}
          );

          console.log("Full API response:", JSON.stringify(response, null, 2));

          if (!response.result) {
            console.log("No result in API response");
            return [
              {
                name: "No fields available",
                value: "",
                description: "No fields found for this SPA type",
              },
            ];
          }

          // Handle nested fields structure
          let fields = response.result;
          if (response.result.fields) {
            fields = response.result.fields;
          }

          console.log("Fields object type:", typeof fields);
          console.log("Fields keys:", Object.keys(fields));
          console.log(
            "Fields values sample:",
            Object.values(fields).slice(0, 2)
          );

          const options: INodePropertyOptions[] = [];

          console.log("Processing fields:", Object.keys(fields));

          // System fields that shouldn't be set manually
          const systemFields = [
            "ID",
            "CREATED_TIME",
            "UPDATED_TIME",
            "CREATED_BY",
            "UPDATED_BY",
            "ENTITY_TYPE_ID",
          ];

          for (const [fieldName, fieldData] of Object.entries(fields)) {
            if (systemFields.includes(fieldName)) {
              continue;
            }

            const field = fieldData as any;
            let displayName = field.title || fieldName;
            let description = field.type || "Field";

            // Add field type information to description
            if (field.type) {
              description = `${field.type}`;
              if (field.isRequired) {
                description += " (Required)";
              }
              if (field.isReadOnly) {
                description += " (Read Only)";
              }
            }

            // Prioritize common fields
            let sortOrder = 999;
            if (fieldName === "TITLE") sortOrder = 1;
            else if (fieldName === "OPPORTUNITY") sortOrder = 2;
            else if (fieldName === "CURRENCY_ID") sortOrder = 3;
            else if (fieldName === "ASSIGNED_BY_ID") sortOrder = 4;
            else if (fieldName === "STAGE_ID") sortOrder = 5;
            else if (fieldName === "CATEGORY_ID") sortOrder = 6;
            else if (fieldName.includes("DATE")) sortOrder = 10;
            else if (fieldName.includes("PHONE")) sortOrder = 15;
            else if (fieldName.includes("EMAIL")) sortOrder = 16;
            else if (fieldName.includes("WEB")) sortOrder = 17;
            else if (fieldName.includes("IM")) sortOrder = 18;
            else if (fieldName.startsWith("UF_")) sortOrder = 50;

            options.push({
              name: displayName,
              value: fieldName,
              description,
              // @ts-ignore - Adding custom property for sorting
              sortOrder,
            });
          }

          // Sort options by priority then by name
          options.sort((a, b) => {
            // @ts-ignore
            const sortOrderA = a.sortOrder || 999;
            // @ts-ignore
            const sortOrderB = b.sortOrder || 999;

            if (sortOrderA !== sortOrderB) {
              return sortOrderA - sortOrderB;
            }
            return a.name.localeCompare(b.name);
          });

          // Remove the sortOrder property before returning
          options.forEach((option) => {
            // @ts-ignore
            delete option.sortOrder;
          });

          console.log("Returning options:", options.length, "fields");
          return options;
        } catch (error) {
          console.error("Error in getSpaItemFields:", error);
          return [
            {
              name: "Error loading fields",
              value: "",
              description: `Failed to load SPA fields: ${error.message}`,
            },
          ];
        }
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const resource = this.getNodeParameter("resource", 0) as string;

    try {
      // Create resource handler and process all items
      const handler = ResourceHandlerFactory.createHandler(resource, this, []);

      const result = await handler.process();
      return [result];
    } catch (error) {
      // Handle errors gracefully
      if (this.continueOnFail()) {
        return [
          [
            {
              json: {
                error: error.message,
                resource,
                timestamp: new Date().toISOString(),
              },
              pairedItem: { item: 0 },
            },
          ],
        ];
      }
      throw error;
    }
  }
}

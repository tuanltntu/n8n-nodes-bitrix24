# Bitrix24 Integration Development Guidelines

## Basic Structure

- Each module consists of two main files:
  - `*Description.ts`: Defines UI components, operations, and fields
  - `*ResourceHandler.ts`: Implements business logic and API calls

## Naming Conventions

- Use CamelCase for all file names, classes, and variables
- Operation values should be camelCase (e.g., `getValue`, `updateItem`)
- Field names in UI should be camelCase, but may need conversion to UPPERCASE for API calls

## Descriptions Format

### Operations Format

All operations MUST include the Bitrix24 API method name in the description:

```typescript
export const moduleOperations = [
  {
    name: "Get Data", // Clear, concise title in Title Case
    value: "getData", // camelCase value for internal reference
    description: "Get data from API (module.data.get)", // Include API method in parentheses
    action: "Get data from API", // Action text used in UI
  },
  // More operations...
];
```

### Fields Format

- Group related fields together
- Use clear, descriptive names
- Include placeholders and descriptions where helpful
- Use appropriate field types (string, number, boolean, options, etc.)

```typescript
export const moduleFields = [
  // Required fields
  {
    displayName: "ID",
    name: "id",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the item",
  },

  // Optional fields with display options
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    options: [
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
      },
      // More fields...
    ],
  },
];
```

## ResourceHandler Implementation

- Create a handler method for each operation (`handleGetData`, `handleUpdateItem`, etc.)
- Use `this.getNodeParameter()` to obtain parameters from the UI
- Use `makeStandardBitrix24Call()` for all API calls
- Implement proper error handling
- Convert parameter formats as needed for the API

```typescript
async handleGetData(itemIndex: number) {
  const id = this.getNodeParameter('id', itemIndex) as string;

  try {
    return await this.makeStandardBitrix24Call(
      'module.data.get',
      { ID: id }
    );
  } catch (error) {
    throw new NodeApiError(this.getNode(), error);
  }
}
```

## Parameter Processing

- Convert UI parameter names to API parameters as needed
- For complex objects/arrays, ensure proper JSON serialization/deserialization
- Include validation where appropriate

## Testing Requirements

1. Build the project with `npm run build` after making changes
2. Test all operations with sample data
3. Verify API responses are properly processed and returned
4. Ensure webhook permissions include access to used API methods

## Code Quality

- Follow existing style conventions
- Keep handler methods focused on a single responsibility
- Document complex logic with comments
- Avoid duplicate code

## API Documentation

- Always reference the official Bitrix24 API documentation
- Only implement documented methods
- Follow parameter requirements as specified in the API docs

## Error Handling

- Use NodeApiError for API errors
- Use NodeOperationError for validation or logic errors
- Include helpful error messages for end users

## Integration Updates

When updating existing modules or creating new ones:

1. Ensure all operations follow the naming convention with API method in description
2. Update any outdated code to follow current standards
3. Document changes in commit messages
4. Verify backward compatibility when possible

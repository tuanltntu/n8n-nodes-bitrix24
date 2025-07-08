# n8n-nodes-bitrix24

![n8n.io - Workflow Automation](https://img.shields.io/badge/n8n.io-Workflow%20Automation-FF6D5A.svg?style=flat)
![npm version](https://img.shields.io/npm/v/n8n-nodes-bitrix24.svg)
![npm downloads](https://img.shields.io/npm/dt/n8n-nodes-bitrix24.svg)
![GitHub license](https://img.shields.io/github/license/tuanltntu/n8n-nodes-bitrix24.svg)

A comprehensive [n8n](https://n8n.io/) community node that provides seamless integration with [Bitrix24 API](https://apidocs.bitrix24.com/). This node enables you to automate your business processes by connecting Bitrix24 with over 400+ apps available in n8n.

## 🚀 Features

- **Complete CRM Integration**: Manage Contacts, Companies, Leads, Deals, Activities, and Products
- **Task Management**: Create, update, and track tasks with full lifecycle support
- **Chat & Communication**: Send messages, manage chats, and handle notifications
- **Telephony Integration**: Make calls, track call statistics, and manage external lines
- **File Management**: Upload, download, and organize files in Bitrix24
- **User Field Configuration**: Create and manage custom fields across all entities
- **Multiple Authentication Methods**: OAuth2, API Key, and Webhook support
- **Comprehensive Error Handling**: Detailed error messages and logging
- **Production Ready**: Battle-tested with robust error handling and validation

## 📦 Installation

### Option 1: Community Nodes (Recommended)

For n8n version 0.187+ with Community Nodes feature:

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter: `n8n-nodes-bitrix24`
5. Click **Install**

### Option 2: npm Installation

```bash
# Install globally alongside n8n
npm install -g n8n-nodes-bitrix24

# Or install locally in your n8n custom nodes directory
cd ~/.n8n/custom/
npm install n8n-nodes-bitrix24
```

### Option 3: Manual Installation

```bash
# Clone the repository
git clone https://github.com/tuanltntu/n8n-nodes-bitrix24.git

# Install dependencies and build
cd n8n-nodes-bitrix24
npm install
npm run build

# Copy to n8n custom nodes directory
mkdir -p ~/.n8n/custom/
cp -r dist ~/.n8n/custom/n8n-nodes-bitrix24
```

## 🔑 Authentication

### OAuth2 (Recommended)

1. Go to your Bitrix24 portal → **Applications** → **Developer Resources**
2. Create a new application
3. Configure OAuth settings and get:
   - **Portal URL**: `https://your-portal.bitrix24.com`
   - **Client ID**: Your application ID
   - **Client Secret**: Your application secret
   - **Access Token**: Generated OAuth token
   - **Refresh Token**: For token renewal

### Webhook

1. Go to **Applications** → **Webhooks** → **Incoming Webhook**
2. Select required permissions
3. Copy the webhook URL: `https://your-portal.bitrix24.com/rest/1/webhook_code/`

### API Key

1. Go to **Applications** → **Developer Resources**
2. Get your API access token
3. Use with your portal URL

## 📚 Supported Resources & Operations

### 🏢 CRM

| Resource     | Operations                           | API Methods      |
| ------------ | ------------------------------------ | ---------------- |
| **Contact**  | Create, Get, Update, Delete, Get All | `crm.contact.*`  |
| **Company**  | Create, Get, Update, Delete, Get All | `crm.company.*`  |
| **Lead**     | Create, Get, Update, Delete, Get All | `crm.lead.*`     |
| **Deal**     | Create, Get, Update, Delete, Get All | `crm.deal.*`     |
| **Activity** | Create, Get, Update, Delete, Get All | `crm.activity.*` |
| **Product**  | Create, Get, Update, Delete, Get All | `crm.product.*`  |
| **Catalog**  | Create, Get, Update, Delete, Get All | `crm.catalog.*`  |

### ✅ Tasks

| Resource | Operations                                        | API Methods    |
| -------- | ------------------------------------------------- | -------------- |
| **Task** | Create, Get, Update, Delete, Get All, Add Comment | `tasks.task.*` |

### 💬 Communication

| Resource         | Operations                 | API Methods    |
| ---------------- | -------------------------- | -------------- |
| **Message**      | Send Message, Get Messages | `im.message.*` |
| **Chat**         | Create Chat, Add Users     | `im.chat.*`    |
| **Notification** | Send Notification          | `im.notify.*`  |

### 📞 Telephony

| Resource       | Operations                       | API Methods                |
| -------------- | -------------------------------- | -------------------------- |
| **Call**       | Make Call, Get Info, Finish Call | `telephony.externalcall.*` |
| **Statistics** | Get Call Statistics              | `telephony.statistic.*`    |

### 📁 Files

| Resource | Operations                   | API Methods |
| -------- | ---------------------------- | ----------- |
| **File** | Upload, Get, Get All, Delete | `disk.*`    |

### ⚙️ Configuration

| Resource              | Operations                           | API Methods         |
| --------------------- | ------------------------------------ | ------------------- |
| **User Field Config** | Add, Get, Update, Delete, Get List   | `userfieldconfig.*` |
| **Status**            | Create, Get, Update, Delete, Get All | `crm.status.*`      |

### 👥 Users

| Resource | Operations                | API Methods |
| -------- | ------------------------- | ----------- |
| **User** | Get, Get All, Get Current | `user.*`    |

## 💡 Usage Examples

### Create a Contact

```json
{
  "resource": "crm",
  "entity": "contact",
  "operation": "create",
  "NAME": "John Doe",
  "EMAIL": [{ "VALUE": "john@example.com", "VALUE_TYPE": "WORK" }],
  "PHONE": [{ "VALUE": "+1234567890", "VALUE_TYPE": "MOBILE" }]
}
```

### Send a Chat Message

```json
{
  "resource": "chat",
  "entity": "message",
  "operation": "send",
  "chatId": "123",
  "message": "Hello from n8n!"
}
```

### Create a Task

```json
{
  "resource": "task",
  "operation": "create",
  "TITLE": "Review Project Proposal",
  "DESCRIPTION": "Please review the attached proposal",
  "RESPONSIBLE_ID": "1",
  "DEADLINE": "2024-01-15T10:00:00Z"
}
```

## 🔧 Advanced Configuration

### Custom Fields

Configure custom fields for any entity:

```json
{
  "resource": "userFieldConfig",
  "operation": "add",
  "entityId": "CRM_CONTACT",
  "fieldCode": "UF_CUSTOM_FIELD",
  "fieldType": "string",
  "fieldLabel": "Custom Field"
}
```

### Filtering Results

Use filters for precise data retrieval:

```json
{
  "filter": {
    "STAGE_ID": "NEW",
    ">=OPPORTUNITY": 1000
  },
  "order": {
    "DATE_CREATE": "DESC"
  },
  "select": ["ID", "TITLE", "OPPORTUNITY"]
}
```

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors**

- Verify your portal URL format: `https://your-portal.bitrix24.com`
- Check token permissions and expiration
- Ensure webhook permissions match your operations

**Rate Limiting**

- Bitrix24 has API rate limits (2 requests/second for most endpoints)
- Use "Wait" nodes between operations for high-volume workflows

**Field Validation**

- Required fields vary by entity type
- Check Bitrix24 API documentation for specific field requirements
- Use "Options" section for additional parameters

### Debug Mode

Enable debug logging in your n8n instance to see detailed API requests and responses.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup

```bash
git clone https://github.com/tuanltntu/n8n-nodes-bitrix24.git
cd n8n-nodes-bitrix24
npm install
npm run dev
```

### Guidelines

- Follow existing code patterns
- Add tests for new features
- Update documentation
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

If this node helps your workflow automation, consider supporting its development:

[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/tuanltntu)

## 🔗 Links

- [n8n Community](https://community.n8n.io/)
- [Bitrix24 API Documentation](https://apidocs.bitrix24.com/)
- [GitHub Repository](https://github.com/tuanltntu/n8n-nodes-bitrix24)
- [Issues & Bug Reports](https://github.com/tuanltntu/n8n-nodes-bitrix24/issues)

## 📋 Compatibility

- **n8n version**: 0.187.0 or later
- **Node.js**: 16.0.0 or later
- **Bitrix24**: All plans supported

## 📈 Version History

### 0.5.0 (Latest)

- ✅ Complete UserFieldConfig implementation with all operations
- ✅ Fixed Status module validation conflicts
- ✅ Enhanced error handling and validation
- ✅ Updated API endpoints to match Bitrix24 documentation
- ✅ Added comprehensive field validation
- ✅ Improved code structure and maintainability

### 0.4.0

- Added webhook authentication support
- Enhanced credential management
- Improved error handling

### 0.3.0

- Added Chat, Telephony, and File management
- Restructured node interface
- Enhanced user experience

### 0.2.0

- Added task comment functionality
- Improved task management

### 0.1.0

- Initial release with basic CRM functionality

---

**Made with ❤️ for the n8n community**

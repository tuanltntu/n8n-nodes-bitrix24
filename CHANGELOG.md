# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2024-01-08

### Added

- **Complete UserFieldConfig Implementation**: All operations (Add, Get, Update, Delete, Get List) with proper validation
- **Enhanced Status Module**: Fixed validation conflicts that affected other modules
- **Comprehensive Error Handling**: Better error messages and validation throughout all modules
- **Production Ready Documentation**: Professional README, LICENSE, and publishing guides
- **Multiple Authentication Support**: OAuth2, Webhook, and API Key authentication methods
- **Robust Field Validation**: Proper validation for required fields with detailed error messages

### Fixed

- **Status Module Validation Conflicts**: Separated field collections to prevent validation interference
- **UserFieldConfig API Endpoints**: Corrected API methods according to Bitrix24 documentation
- **Field Dependencies**: Fixed moduleId parameter requirements for various operations
- **Export Conflicts**: Resolved circular dependencies and duplicate field exports

### Improved

- **Code Structure**: Better organization with separated descriptions and handlers
- **API Compliance**: All endpoints now match official Bitrix24 API specification
- **User Experience**: Clearer field labels and descriptions throughout the interface
- **Documentation**: Comprehensive examples and troubleshooting guides

### Technical Changes

- Updated package metadata for npm publishing
- Added proper .gitignore and .npmignore configurations
- Enhanced TypeScript types and error handling
- Improved build process and development workflow

## [0.4.0] - 2023-12-30

### Added

- Webhook URL authentication support
- Enhanced credential management with multiple authentication options
- Improved error handling for API requests

### Changed

- Updated credential configurations for better flexibility
- Enhanced user interface for credential setup

## [0.3.0] - 2023-11-10

### Added

- Chat functionality (Messages, Chat Management, Notifications)
- Telephony integration (Calls, External Calls, Statistics)
- Open Channels support (Connectors, Sessions, Dialogs)
- Message Provider services (SMS, Email, Provider Management)
- Enhanced user and file management features

### Changed

- Reorganized node structure into a more user-friendly interface
- Improved resource categorization and navigation

## [0.2.0] - 2023-09-15

### Added

- Task comment functionality
- Enhanced task management capabilities

### Improved

- Better task workflow integration
- Enhanced task-related operations

## [0.1.0] - 2023-07-29

### Added

- Initial release of the Bitrix24 node
- Basic CRM functionality (Contacts, Companies, Leads, Deals)
- Task management support
- OAuth2 authentication
- Core API integration framework

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

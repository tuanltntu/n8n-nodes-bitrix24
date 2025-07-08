# Contributing to n8n-nodes-bitrix24

Thank you for your interest in contributing to n8n-nodes-bitrix24! This document provides guidelines for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- n8n installed and running
- Access to a Bitrix24 portal for testing
- Basic knowledge of TypeScript and n8n node development

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/yourusername/n8n-nodes-bitrix24.git
   cd n8n-nodes-bitrix24
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Link for local development**
   ```bash
   npm link
   cd ~/.n8n/nodes
   npm link n8n-nodes-bitrix24
   ```

## Making Changes

### Branch Naming

Use descriptive branch names with the following prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

Example: `feature/add-calendar-support`

### Commit Messages

Use clear, descriptive commit messages:

```
type(scope): description

- feat(crm): add contact batch operations
- fix(auth): resolve OAuth2 token refresh issue
- docs(readme): update installation instructions
```

## Submitting Changes

### Pull Request Process

1. **Create an issue** first to discuss major changes
2. **Fork the repository** and create your feature branch
3. **Make your changes** following the coding standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request** with a clear description

### Pull Request Requirements

- [ ] Clear description of changes
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (unless discussed)
- [ ] Follows coding standards

## Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Provide proper type definitions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### File Structure

```
src/
├── credentials/           # Authentication credentials
├── nodes/Bitrix24/       # Main node implementation
│   ├── descriptions/     # Field and operation descriptions
│   ├── handlers/         # Resource-specific handlers
│   └── utils/           # Utility functions
└── index.ts             # Main export file
```

### Code Style

- Use 2 spaces for indentation
- Maximum line length of 120 characters
- Use single quotes for strings
- Use trailing commas in objects/arrays

## Testing

### Manual Testing

1. **Set up test environment**

   ```bash
   npm run build
   # Start n8n in development mode
   ```

2. **Test with real Bitrix24 API**
   - Create test workflows
   - Test all authentication methods
   - Verify error handling

### Required Testing

Before submitting a PR, ensure:

- [ ] All existing functionality works
- [ ] New features are tested
- [ ] Error cases are handled
- [ ] Authentication methods work
- [ ] API rate limits are respected

## Documentation

### When to Update Documentation

- Adding new resources or operations
- Changing existing functionality
- Adding new authentication methods
- Fixing bugs that affect user experience

### Documentation Files to Update

- `README.md` - Main documentation
- `CHANGELOG.md` - Version history
- Code comments - Inline documentation
- Examples - Usage examples

## Bitrix24 API Guidelines

### API Integration Best Practices

1. **Follow Bitrix24 API patterns**

   - Use correct endpoint naming
   - Handle pagination properly
   - Respect rate limits

2. **Error Handling**

   - Provide meaningful error messages
   - Handle API timeouts gracefully
   - Log useful debugging information

3. **Authentication**
   - Support all authentication methods
   - Handle token refresh
   - Validate credentials properly

### Adding New Resources

When adding new Bitrix24 resources:

1. **Create description file** in `descriptions/`
2. **Implement handler** in `handlers/`
3. **Register in FieldRegistry**
4. **Add tests and documentation**
5. **Update README with new operations**

## Getting Help

### Resources

- [Bitrix24 API Documentation](https://dev.bitrix24.com/)
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Support Channels

- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - General questions and ideas
- Pull Request Reviews - Code-specific discussions

## Recognition

Contributors will be:

- Listed in the README contributors section
- Mentioned in release notes for significant contributions
- Given credit in the CHANGELOG

Thank you for contributing to n8n-nodes-bitrix24! 🚀

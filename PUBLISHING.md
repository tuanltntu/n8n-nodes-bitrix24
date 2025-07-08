# Publishing Guide for n8n-nodes-bitrix24

## 📋 Pre-Publishing Checklist

Before publishing to npm, ensure all the following are completed:

### ✅ Code & Build

- [ ] All features tested and working
- [ ] Code builds without errors: `npm run build`
- [ ] No TypeScript compilation errors
- [ ] All linting issues resolved: `npm run lint`

### ✅ Documentation

- [ ] README.md updated with latest features
- [ ] Version number updated in package.json
- [ ] CHANGELOG.md updated (if exists)
- [ ] All examples tested and working

### ✅ Package Configuration

- [ ] package.json metadata is correct
- [ ] Author information updated
- [ ] Repository URLs point to correct GitHub repo
- [ ] License file exists
- [ ] .npmignore configured properly

### ✅ Version Management

- [ ] Version follows semantic versioning (semver)
- [ ] Git working directory is clean
- [ ] All changes committed to git

## 🚀 Publishing Steps

### 1. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

### 2. Verify Package Contents

```bash
# Check what files will be included in the package
npm pack --dry-run
```

### 3. Test Build

```bash
npm run build
```

### 4. Publish to npm

```bash
# For public release
npm publish --access public

# Or if you want to test with a tag first
npm publish --tag beta --access public
```

### 5. Verify Publication

```bash
# Check if package is available
npm info n8n-nodes-bitrix24
```

## 🏷️ Version Management

### Semantic Versioning

- **Patch (0.5.1)**: Bug fixes, small improvements
- **Minor (0.6.0)**: New features, backwards compatible
- **Major (1.0.0)**: Breaking changes

### Update Version

```bash
# Patch version
npm version patch

# Minor version
npm version minor

# Major version
npm version major
```

## 📤 GitHub Release

After npm publishing, create a GitHub release:

1. Go to: https://github.com/tuanltntu/n8n-nodes-bitrix24/releases
2. Click "Create a new release"
3. Create a new tag with version number (e.g., v0.5.0)
4. Add release notes with:
   - New features
   - Bug fixes
   - Breaking changes (if any)
   - Migration guide (if needed)

## 🔍 Post-Publishing

### Update n8n Community

1. Post in n8n Community forum about the new release
2. Update any existing threads with new information
3. Share usage examples and tutorials

### Monitor & Support

- Watch for GitHub issues
- Monitor npm downloads and usage
- Respond to community questions
- Plan next release features

## 🛠️ Common Issues

### Authentication Errors

```bash
npm whoami  # Check if you're logged in
npm login   # Login again if needed
```

### Publishing Errors

```bash
# If package name is taken
npm search n8n-nodes-bitrix24

# Check current published version
npm view n8n-nodes-bitrix24 version
```

### Build Issues

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 📞 Support

If you encounter issues during publishing:

- Check npm documentation: https://docs.npmjs.com/
- Contact npm support: https://www.npmjs.com/support
- Open an issue on GitHub: https://github.com/tuanltntu/n8n-nodes-bitrix24/issues

---

Happy Publishing! 🎉

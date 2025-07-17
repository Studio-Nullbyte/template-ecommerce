# GitHub Actions Workflow Documentation

## Workflow Overview

The `deploy.yml` workflow automatically builds and deploys the Studio Nullbyte site to GitHub Pages whenever changes are pushed to the main branch.

## Workflow Configuration

### Triggers
- **Push to main**: Automatic deployment on every push to the main branch
- **Manual dispatch**: Can be triggered manually from the Actions tab

### Permissions
```yaml
permissions:
  contents: read      # Read repository files
  pages: write        # Deploy to GitHub Pages
  id-token: write     # Authentication for deployment
```

### Concurrency
- Only one deployment runs at a time
- New deployments wait for current ones to complete
- No cancellation of in-progress deployments

## Build Job

### Environment
- **OS**: Ubuntu Latest
- **Node.js**: Version 18 (LTS)
- **Package Manager**: npm with caching enabled

### Steps
1. **Checkout**: `actions/checkout@v4`
   - Downloads repository code
   - Includes full git history

2. **Setup Node.js**: `actions/setup-node@v4`
   - Installs Node.js 18
   - Configures npm caching for faster builds
   - Uses package-lock.json for dependency resolution

3. **Install Dependencies**: `npm ci`
   - Clean install from package-lock.json
   - Faster and more reliable than `npm install`
   - Ensures reproducible builds

4. **Build Site**: `npm run build`
   - Runs Vite production build
   - Generates optimized static files in `dist/`
   - Applies GitHub Pages base path configuration

5. **Setup Pages**: `actions/configure-pages@v4`
   - Configures GitHub Pages settings
   - Sets up deployment environment

6. **Upload Artifact**: `actions/upload-pages-artifact@v3`
   - Uploads `dist/` directory
   - Creates deployment artifact for Pages

## Deploy Job

### Environment
- **Name**: github-pages
- **URL**: Automatically provided after deployment
- **Dependencies**: Requires successful build job

### Steps
1. **Deploy to GitHub Pages**: `actions/deploy-pages@v4`
   - Downloads build artifact
   - Deploys to GitHub Pages environment
   - Provides deployment URL

## Performance Optimizations

### Caching Strategy
- **npm cache**: Automatically managed by `actions/setup-node`
- **Build artifacts**: Efficiently uploaded to Pages
- **Dependencies**: Cached between workflow runs

### Build Optimization
- **Source maps**: Generated for debugging
- **Asset optimization**: Vite handles CSS/JS minification
- **Tree shaking**: Dead code elimination
- **Code splitting**: Automatic chunk generation

## Error Handling

### Common Build Failures

**TypeScript Errors:**
```
Error: Type 'X' is not assignable to type 'Y'
```
- Fix TypeScript issues in your code
- Run `npm run lint` locally before pushing

**Missing Dependencies:**
```
Error: Cannot resolve module 'package-name'
```
- Ensure all dependencies are in `package.json`
- Run `npm install package-name --save`

**Build Size Warnings:**
```
Warning: Chunk size limit exceeded
```
- Optimize imports and bundle size
- Use dynamic imports for large dependencies

### Deployment Failures

**Pages Not Enabled:**
- Enable GitHub Pages in repository settings
- Set source to "GitHub Actions"

**Permission Denied:**
```
Error: Resource not accessible by integration
```
- Check repository permissions
- Ensure workflow permissions are correct

## Monitoring & Debugging

### Viewing Logs
1. Go to **Actions** tab in repository
2. Click on latest workflow run
3. Expand job steps to view detailed logs
4. Download logs for offline analysis

### Build Timing
- **Typical build time**: 2-4 minutes
- **Cache hit**: 1-2 minutes
- **Cache miss**: 3-5 minutes

### Deployment Status
- **Green checkmark**: Successful deployment
- **Yellow dot**: In progress
- **Red X**: Failed (check logs)

## Security Considerations

### Secrets
- No secrets required for public repositories
- GitHub automatically provides `GITHUB_TOKEN`
- Minimal permissions for security

### Dependency Security
- Dependabot monitors for vulnerabilities
- Regular updates to GitHub Actions versions
- npm audit runs during build process

## Customization Options

### Build Environment Variables
Add to workflow if needed:
```yaml
env:
  NODE_ENV: production
  VITE_API_URL: ${{ secrets.API_URL }}
```

### Custom Build Steps
Add additional steps as needed:
```yaml
- name: Run tests
  run: npm test

- name: Lighthouse CI
  run: npm run lighthouse
```

### Deployment Notifications
Add notification steps:
```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
```

## Workflow Updates

### Updating Actions
- Monitor for new versions of actions
- Update systematically to get security fixes
- Test updates in a separate branch first

### Node.js Version Updates
- Update when new LTS versions are released
- Test compatibility with current dependencies
- Update local development environment to match

## Related Documentation

- [GitHub Pages Setup Guide](../GITHUB_PAGES_SETUP.md)
- [Mobile Responsive Improvements](../MOBILE_RESPONSIVE_IMPROVEMENTS.md)
- [Main README](../README.md)

## Support

For issues with the workflow:
1. Check workflow logs in Actions tab
2. Verify repository settings
3. Test build locally with `npm run build:gh-pages`
4. Review this documentation for common solutions

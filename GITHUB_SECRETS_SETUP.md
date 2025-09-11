# GitHub Secrets Setup for Cypress Tests

This document explains how to set up GitHub secrets for running Cypress tests in GitHub Actions.

## 🔐 Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. **CYPRESS_BASE_URL**
- **Description:** Base URL of the application under test
- **Example:** `https://app.e2e.gcp.logineko.com`
- **Usage:** Used as the base URL for all test requests

### 2. **CYPRESS_AUTH_BASE_URL**
- **Description:** Keycloak authentication server URL
- **Example:** `https://auth.e2e.gcp.logineko.com`
- **Usage:** Used for user authentication in tests

### 3. **CYPRESS_REALM**
- **Description:** Keycloak realm name
- **Example:** `logineko`
- **Usage:** Used for authentication realm

### 4. **CYPRESS_CLIENT_ID**
- **Description:** Keycloak client ID
- **Example:** `frontend-vue`
- **Usage:** Used for OAuth client identification

### 5. **CYPRESS_APP_URL**
- **Description:** Full application URL with path
- **Example:** `https://app.e2e.gcp.logineko.com/logineko/map`
- **Usage:** Used as redirect URL after authentication

### 6. **CYPRESS_TEST_USERNAME**
- **Description:** Test user username
- **Example:** `e2e_tester`
- **Usage:** Used for test user authentication

### 7. **CYPRESS_TEST_PASSWORD**
- **Description:** Test user password
- **Example:** `9msMWtvlDp6MoJFdvI5fEAqDm4aBhiZW`
- **Usage:** Used for test user authentication

### 8. **CYPRESS_RECORD_KEY** (Optional)
- **Description:** Cypress Dashboard record key
- **Example:** `your-record-key-here`
- **Usage:** For recording test results to Cypress Dashboard

### 9. **CYPRESS_PROJECT_ID** (Optional)
- **Description:** Cypress Dashboard project ID
- **Example:** `your-project-id-here`
- **Usage:** For recording test results to Cypress Dashboard

## 📋 How to Add GitHub Secrets

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables**
4. Click on **Actions**

### Step 2: Add New Secrets
1. Click **New repository secret**
2. Enter the secret name (e.g., `CYPRESS_BASE_URL`)
3. Enter the secret value
4. Click **Add secret**
5. Repeat for all required secrets

### Step 3: Verify Secrets
1. Go to **Actions** tab
2. Click on **Cypress E2E Tests** workflow
3. Click **Run workflow**
4. Check the logs to ensure secrets are being used correctly

## 🔧 Environment Variable Mapping

| GitHub Secret | Cypress Environment Variable | Default Value |
|---------------|------------------------------|---------------|
| `CYPRESS_BASE_URL` | `baseUrl` | `https://app.e2e.gcp.logineko.com` |
| `CYPRESS_AUTH_BASE_URL` | `authBaseUrl` | `https://auth.e2e.gcp.logineko.com` |
| `CYPRESS_REALM` | `realm` | `logineko` |
| `CYPRESS_CLIENT_ID` | `clientId` | `frontend-vue` |
| `CYPRESS_APP_URL` | `appUrl` | `https://app.e2e.gcp.logineko.com/logineko` |
| `CYPRESS_TEST_USERNAME` | `testUsername` | `e2e_tester` |
| `CYPRESS_TEST_PASSWORD` | `testPassword` | `9msMWtvlDp6MoJFdvI5fEAqDm4aBhiZW` |

## 🚀 Testing the Setup

### 1. Manual Trigger
1. Go to **Actions** tab
2. Select **Cypress E2E Tests** workflow
3. Click **Run workflow**
4. Choose your options:
   - Test type: `all`
   - Browser: `chrome`
   - Headless: `true`
5. Click **Run workflow**

### 2. Check Logs
1. Click on the running workflow
2. Click on **cypress-tests** job
3. Check the logs for:
   - Environment variables being loaded
   - Authentication success
   - Test execution

### 3. Verify Test Results
1. Check if tests pass
2. Review uploaded artifacts (screenshots, videos)
3. Verify order creation and search functionality

## 🔒 Security Best Practices

### 1. **Never Commit Secrets**
- ✅ Use GitHub Secrets
- ❌ Never commit `.env` files with real credentials
- ❌ Never hardcode secrets in code

### 2. **Rotate Credentials Regularly**
- Update test user passwords periodically
- Rotate API keys if applicable
- Update GitHub secrets when credentials change

### 3. **Use Different Environments**
- Use different secrets for different environments
- Consider using environment-specific workflows
- Test with staging before production

### 4. **Monitor Usage**
- Check GitHub Actions logs regularly
- Monitor for failed authentications
- Review test results for security issues

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify `CYPRESS_TEST_USERNAME` and `CYPRESS_TEST_PASSWORD`
   - Check `CYPRESS_AUTH_BASE_URL` is accessible
   - Ensure `CYPRESS_REALM` and `CYPRESS_CLIENT_ID` are correct

2. **Application Not Found**
   - Verify `CYPRESS_BASE_URL` is correct
   - Check if the application is accessible
   - Ensure `CYPRESS_APP_URL` includes the correct path

3. **Tests Failing**
   - Check if all secrets are set correctly
   - Verify the application is running
   - Review test logs for specific errors

### Debug Steps

1. **Check Secret Values**
   ```bash
   # In GitHub Actions logs, look for:
   echo "Base URL: $CYPRESS_BASE_URL"
   echo "Auth URL: $CYPRESS_AUTH_BASE_URL"
   ```

2. **Verify Environment Variables**
   - Check if `Cypress.env()` returns correct values
   - Verify authentication URLs are accessible
   - Test API endpoints manually

3. **Review Test Logs**
   - Look for authentication success messages
   - Check for API response errors
   - Verify order creation and search functionality

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Verify all secrets are set correctly
4. Test the application manually
5. Check Cypress documentation: https://docs.cypress.io

---

**Your tests are now ready to run securely in GitHub Actions! 🚀**

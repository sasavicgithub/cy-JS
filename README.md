# Logineko Cypress Authentication

This project provides comprehensive API-based authentication methods for testing the Logineko application using Cypress with Keycloak (OpenID Connect). It includes both API-based and form-based login methods that replicate the exact authentication flow used by the browser.

## Authentication Details

- **IAM Provider**: Keycloak (OpenID Connect)
- **Auth Base URL**: https://auth.e2e.gcp.logineko.com
- **Realm**: logineko
- **Client ID**: frontend-vue

## Features

- **API-based Login**: Fast, reliable authentication using direct API calls
- **Form-based Login**: Browser-like authentication for UI testing
- **Session Management**: Preserve and restore authentication state across tests
- **Token Management**: Automatic handling of access tokens, refresh tokens, and ID tokens
- **Cookie Management**: Proper handling of Keycloak authentication cookies
- **Error Handling**: Comprehensive error handling for various failure scenarios

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update test credentials in `cypress/fixtures/test-credentials.json`:
```json
{
  "testUser": {
    "username": "your-actual-username@example.com",
    "password": "your-actual-password"
  }
}
```

3. Run tests:
```bash
npx cypress open
# or
npx cypress run
```

## Available Commands

### Authentication Commands

#### `cy.keycloakLogin(username, password, redirectUrl?)`
Performs API-based authentication using the Keycloak OAuth2 flow.

```javascript
cy.keycloakLogin('user@example.com', 'password').then((tokens) => {
  // Tokens are automatically stored in localStorage and cookies
  console.log('Access token:', tokens.access_token);
});
```

#### `cy.loginViaAPI(username, password, redirectUrl?)`
Legacy API-based authentication method (use `cy.keycloakLogin` instead).

```javascript
cy.loginViaAPI('user@example.com', 'password').then((tokens) => {
  // Tokens are automatically stored in localStorage and cookies
  console.log('Access token:', tokens.access_token);
});
```

#### `cy.keycloakLoginForm(username, password)`
Performs form-based authentication by visiting the Keycloak login page and submitting credentials.

```javascript
cy.keycloakLoginForm('user@example.com', 'password');
```

#### `cy.loginViaForm(username, password)`
Legacy form-based authentication method (use `cy.keycloakLoginForm` instead).

```javascript
cy.loginViaForm('user@example.com', 'password');
```

#### `cy.keycloakLogout()`
Clears all Keycloak authentication state including cookies and localStorage.

```javascript
cy.keycloakLogout();
```

#### `cy.getKeycloakUserInfo()`
Retrieves user information from Keycloak after authentication.

```javascript
cy.getKeycloakUserInfo().then((userInfo) => {
  console.log('User ID:', userInfo.sub);
  console.log('Username:', userInfo.preferred_username);
});
```

#### `cy.logout()`
Legacy logout method (use `cy.keycloakLogout` instead).

```javascript
cy.logout();
```

### Session Management Commands

#### `cy.preserveAuth()`
Saves current authentication state for later restoration.

```javascript
cy.loginViaAPI('user@example.com', 'password');
cy.preserveAuth();
```

#### `cy.restoreAuth()`
Restores previously saved authentication state.

```javascript
cy.restoreAuth();
```

#### `cy.isAuthenticated()`
Checks if the user is currently authenticated.

```javascript
cy.isAuthenticated().then((authenticated) => {
  if (authenticated) {
    console.log('User is authenticated');
  }
});
```

### Token Management Commands

#### `cy.getAuthTokens()`
Retrieves current authentication tokens.

```javascript
cy.getAuthTokens().then((tokens) => {
  console.log('Access token:', tokens.accessToken);
  console.log('Refresh token:', tokens.refreshToken);
  console.log('ID token:', tokens.idToken);
});
```

#### `cy.setAuthTokens(tokens)`
Manually sets authentication tokens (useful for debugging).

```javascript
cy.setAuthTokens({
  access_token: 'your-access-token',
  refresh_token: 'your-refresh-token',
  id_token: 'your-id-token'
});
```

### API Request Commands

#### `cy.authenticatedRequest(options)`
Makes an authenticated API request with automatic token inclusion.

```javascript
cy.authenticatedRequest({
  method: 'GET',
  url: '/api/some-endpoint'
}).then((response) => {
  expect(response.status).to.equal(200);
});
```

## Test Examples

### Basic Authentication Test

```javascript
describe('Authentication Tests', () => {
  it('should login successfully', () => {
    cy.loginViaAPI('user@example.com', 'password');
    
    // Verify authentication
    cy.visit('https://app.e2e.gcp.logineko.com/logineko/map');
    cy.url().should('include', 'app.e2e.gcp.logineko.com');
    cy.url().should('not.include', 'auth.e2e.gcp.logineko.com');
  });
});
```

### Cross-Test Session Management

```javascript
describe('Session Management', () => {
  beforeEach(() => {
    cy.loginViaAPI('user@example.com', 'password');
    cy.preserveAuth();
  });

  it('should maintain session across tests', () => {
    cy.restoreAuth();
    cy.visit('https://app.e2e.gcp.logineko.com/logineko/map');
    cy.url().should('include', 'app.e2e.gcp.logineko.com');
  });
});
```

### API Testing with Authentication

```javascript
describe('API Tests', () => {
  beforeEach(() => {
    cy.loginViaAPI('user@example.com', 'password');
  });

  it('should make authenticated API calls', () => {
    cy.authenticatedRequest({
      method: 'GET',
      url: '/api/user/profile'
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('user');
    });
  });
});
```

## Configuration

The authentication system is configured in `cypress.config.js`:

```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://app.e2e.gcp.logineko.com',
    chromeWebSecurity: false, // Required for cross-origin requests
    experimentalSessionAndOrigin: true, // Enable session management
    env: {
      authBaseUrl: 'https://auth.e2e.gcp.logineko.com/realms/logineko',
      clientId: 'frontend-vue',
      appUrl: 'https://app.e2e.gcp.logineko.com/logineko/map'
    }
  }
});
```

## Authentication Flow

The API-based login method follows this flow:

1. **Initial Request**: Visit the app URL to trigger OAuth flow
2. **Auth Redirect**: Follow redirect to Keycloak authentication server
3. **Extract Parameters**: Extract session code, execution ID, and other parameters
4. **Submit Credentials**: POST credentials to the authentication endpoint
5. **Handle Redirect**: Process the redirect response with authorization code
6. **Exchange Tokens**: Exchange authorization code for access/refresh tokens
7. **Store State**: Store tokens in localStorage and cookies for session persistence

## Error Handling

The authentication methods include comprehensive error handling for:

- Invalid credentials
- Network failures
- Missing authentication parameters
- Token exchange failures
- Session expiration

## Security Notes

- Test credentials should be stored securely and not committed to version control
- The `chromeWebSecurity: false` setting is required for cross-origin requests but should only be used in test environments
- Authentication tokens are automatically cleared between test runs for security

## Troubleshooting

### Common Issues

1. **Authentication Fails**: Verify credentials in `test-credentials.json`
2. **Cross-Origin Errors**: Ensure `chromeWebSecurity: false` is set in config
3. **Session Not Persisting**: Check that cookies are being set with correct domain
4. **Token Expiration**: Implement token refresh logic if needed

### Debug Mode

Enable debug logging by adding to your test:

```javascript
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('Error:', err);
  return false;
});
```

## Contributing

When adding new authentication methods or modifying existing ones:

1. Follow the existing command structure
2. Include comprehensive error handling
3. Add appropriate test cases
4. Update this documentation
5. Ensure backward compatibility

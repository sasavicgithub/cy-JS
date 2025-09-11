// ***********************************************
// Keycloak Authentication Commands
// Consolidated authentication commands for Logineko
// ***********************************************

/**
 * Keycloak API-based login method
 * @param {string} username - User's username/email
 * @param {string} password - User's password
 * @param {string} redirectUrl - URL to redirect to after login (optional)
 */
Cypress.Commands.add('keycloakLogin', (username, password, redirectUrl = Cypress.env('appUrl')) => {
  const authBaseUrl = Cypress.env('authBaseUrl');
  const realm = Cypress.env('realm');
  const clientId = Cypress.env('clientId');

  // Step 1: Get the authorization URL
  return cy
    .request({
      method: 'GET',
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
      qs: {
        client_id: clientId,
        redirect_uri: redirectUrl,
        response_type: 'code',
        scope: 'openid',
        state: 'test-state-' + Date.now(),
      },
      followRedirect: false,
    })
    .then((response) => {
      // Extract session parameters from the auth response
      const authUrl = response.headers.location || response.url;

      if (!authUrl) {
        // If no redirect, the response might contain the login form directly
        cy.log('No redirect received, checking response body for login form');

        // Try to extract session parameters from the response body
        const body = response.body;
        if (typeof body === 'string' && body.includes('login-actions/authenticate')) {
          // Extract session parameters from the form action URL
          const formActionMatch = body.match(/action="([^"]*login-actions\/authenticate[^"]*)"/);
          if (formActionMatch) {
            const formActionUrl = formActionMatch[1];
            const sessionCodeMatch = formActionUrl.match(/session_code=([^&]+)/);
            const executionMatch = formActionUrl.match(/execution=([^&]+)/);
            const tabIdMatch = formActionUrl.match(/tab_id=([^&]+)/);
            const clientDataMatch = formActionUrl.match(/client_data=([^&]+)/);

            if (sessionCodeMatch && executionMatch) {
              const sessionCode = sessionCodeMatch[1];
              const execution = executionMatch[1];
              const tabId = tabIdMatch ? tabIdMatch[1] : 'test-tab-id';
              const clientData = clientDataMatch ? clientDataMatch[1] : '';

              // Proceed with login using extracted parameters
              return cy.request({
                method: 'POST',
                url: `${authBaseUrl}/realms/${realm}/login-actions/authenticate`,
                qs: {
                  session_code: sessionCode,
                  execution: execution,
                  client_id: clientId,
                  tab_id: tabId,
                  client_data: clientData,
                },
                form: true,
                body: {
                  username: username,
                  password: password,
                },
                followRedirect: false,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Origin: 'null',
                  'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
                },
              });
            }
          }
        }

        throw new Error('No authorization URL or login form found in Keycloak response');
      }

      // Extract session code and execution ID
      const sessionCodeMatch = authUrl.match(/session_code=([^&]+)/);
      const executionMatch = authUrl.match(/execution=([^&]+)/);
      const tabIdMatch = authUrl.match(/tab_id=([^&]+)/);
      const clientDataMatch = authUrl.match(/client_data=([^&]+)/);

      if (!sessionCodeMatch || !executionMatch) {
        throw new Error('Could not extract session parameters from Keycloak response');
      }

      const sessionCode = sessionCodeMatch[1];
      const execution = executionMatch[1];
      const tabId = tabIdMatch ? tabIdMatch[1] : 'test-tab-id';
      const clientData = clientDataMatch ? clientDataMatch[1] : '';

      // Step 2: Submit login credentials with exact payload structure
      return cy.request({
        method: 'POST',
        url: `${authBaseUrl}/realms/${realm}/login-actions/authenticate`,
        qs: {
          session_code: sessionCode,
          execution: execution,
          client_id: clientId,
          tab_id: tabId,
          client_data: clientData,
        },
        form: true,
        body: {
          username: username,
          password: password,
        },
        followRedirect: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: 'null',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
      });
    })
    .then((loginResponse) => {
      // Step 3: Handle the redirect and extract authorization code
      const redirectLocation = loginResponse.headers.location;

      if (!redirectLocation) {
        throw new Error('Login failed - no redirect location received');
      }

      // Check if we got redirected back to the app with authorization code
      if (redirectLocation.includes('code=')) {
        // Extract authorization code from redirect URL
        const codeMatch = redirectLocation.match(/code=([^&]+)/);
        const stateMatch = redirectLocation.match(/state=([^&]+)/);
        const sessionStateMatch = redirectLocation.match(/session_state=([^&]+)/);

        if (!codeMatch) {
          throw new Error('Could not extract authorization code from redirect');
        }

        const authCode = codeMatch[1];
        const state = stateMatch ? stateMatch[1] : '';
        // const sessionState = sessionStateMatch ? sessionStateMatch[1] : '';

        // Step 4: Exchange authorization code for tokens
        return cy
          .request({
            method: 'POST',
            url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
            form: true,
            body: {
              grant_type: 'authorization_code',
              client_id: clientId,
              code: authCode,
              redirect_uri: redirectUrl,
              state: state,
            },
          })
          .then((tokenResponse) => {
            // Store tokens for future use
            const tokens = tokenResponse.body;

            // Set cookies to maintain session
            if (tokens.id_token) {
              cy.setCookie('KEYCLOAK_IDENTITY', tokens.id_token, {
                domain: '.e2e.gcp.logineko.com',
                secure: true,
                httpOnly: true,
                sameSite: 'none',
              });
            }

            cy.setCookie('KEYCLOAK_SESSION', 'authenticated', {
              domain: '.e2e.gcp.logineko.com',
              secure: true,
              sameSite: 'none',
            });

            // Store access token in localStorage for API calls
            cy.window().then((win) => {
              if (tokens.access_token) {
                win.localStorage.setItem('access_token', tokens.access_token);
              }
              if (tokens.refresh_token) {
                win.localStorage.setItem('refresh_token', tokens.refresh_token);
              }
              if (tokens.id_token) {
                win.localStorage.setItem('id_token', tokens.id_token);
              }
            });

            return cy.wrap(tokens);
          });
      } else {
        // If no authorization code, the login might have failed
        throw new Error(
          'Login failed - no authorization code in redirect. Redirect URL: ' + redirectLocation
        );
      }
    });
});

Cypress.Commands.add('keycloakLoginForm', () => {
  // const appUrl = Cypress.env('appUrl');
});

Cypress.Commands.add('keycloakIn', () => {
  // const authBaseUrl = Cypress.env('authBaseUrl');
  // const realm = Cypress.env('realm');
  // const clientId = Cypress.env('clientId');

  // Clear cookies
  cy.clearCookies();
});

Cypress.Commands.add('getKeycloakUserInfo', () => {
  const authBaseUrl = Cypress.env('authBaseUrl');
  const realm = Cypress.env('realm');

  return cy.getAuthTokens().then((tokens) => {
    if (!tokens.accessToken) {
      throw new Error('No access token available');
    }

    return cy
      .request({
        method: 'GET',
        url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/userinfo`,
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .then((response) => {
        return cy.wrap(response.body);
      });
  });
});

/**
 * Setup authenticated session for tests
 * This command handles login and authentication setup
 * Can be used in beforeEach hooks
 */
Cypress.Commands.add('setupAuthenticatedSession', () => {
  const username = Cypress.env('testUsername');
  const password = Cypress.env('testPassword');
  const appUrl = Cypress.env('appUrl');
  const mapUrl = appUrl + '/map';

  cy.log('🔐 Setting up authenticated session...');

  // Perform Keycloak login with map URL as redirect
  cy.keycloakLogin(username, password, mapUrl).then(() => {
    cy.log('✅ Login successful, tokens received');

    // Verify we can access the app
    cy.visit(mapUrl);
    cy.url().should('include', 'app.e2e.gcp.logineko.com');

    cy.keycloakIn();

    cy.log('✅ Authenticated session established successfully!');
  });
});

/**
 * Get authentication tokens from localStorage
 */
Cypress.Commands.add('getAuthTokens', () => {
  return cy.window().then((win) => {
    return {
      accessToken: win.localStorage.getItem('access_token'),
      refreshToken: win.localStorage.getItem('refresh_token'),
      idToken: win.localStorage.getItem('id_token'),
    };
  });
});

/**
 * Check if user is currently authenticated
 */
Cypress.Commands.add('isAuthenticated', () => {
  return cy
    .request({
      method: 'GET',
      url: Cypress.env('appUrl'),
      failOnStatusCode: false,
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      },
    })
    .then((response) => {
      // If we get redirected to auth, the session is not valid
      return (
        !response.headers.location ||
        !response.headers.location.includes(Cypress.env('authBaseUrl'))
      );
    });
});

/**
 * Clear all authentication state
 */
Cypress.Commands.add('clearAuthState', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log('🧹 Authentication state cleared');
});

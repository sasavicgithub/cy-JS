// Environment-specific configurations
export const environments = {
  development: {
    baseUrl: 'https://app.dev.gcp.logineko.com',
    authUrl: 'https://auth.dev.gcp.logineko.com',
    timeout: 10000,
    retries: 2,
  },
  staging: {
    baseUrl: 'https://app.staging.gcp.logineko.com',
    authUrl: 'https://auth.staging.gcp.logineko.com',
    timeout: 15000,
    retries: 3,
  },
  production: {
    baseUrl: 'https://app.e2e.gcp.logineko.com',
    authUrl: 'https://auth.e2e.gcp.logineko.com',
    timeout: 20000,
    retries: 5,
  },
};

export const getEnvironment = () => {
  const env = Cypress.env('ENVIRONMENT') || 'development';
  return environments[env] || environments.development;
};

export default environments;

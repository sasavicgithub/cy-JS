// Environment-specific configurations
export const environments = {
  development: {
    baseUrl: 'https://app.dev.example.com',
    authUrl: 'https://auth.dev.example.com',
    timeout: 10000,
    retries: 2,
  },
  staging: {
    baseUrl: 'https://app.staging.example.com',
    authUrl: 'https://auth.staging.example.com',
    timeout: 15000,
    retries: 3,
  },
  production: {
    baseUrl: 'https://app.production.example.com',
    authUrl: 'https://auth.production.example.com',
    timeout: 20000,
    retries: 5,
  },
};

export const getEnvironment = () => {
  const env = Cypress.env('ENVIRONMENT') || 'development';
  return environments[env] || environments.development;
};

export default environments;

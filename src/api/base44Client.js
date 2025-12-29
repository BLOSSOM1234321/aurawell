import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client - authentication disabled for local development with mock data
export const base44 = createClient({
  appId: "689f3f2da7c7d92e1b2413a7",
  requiresAuth: false // Using mock data for local development
});

// API Configuration
// For development, use your computer's IP address
// For production, this will be your actual API domain

const isDevelopment = __DEV__;

export const API_CONFIG = {
  
  BASE_URL: isDevelopment 
    ? 'http://192.168.8.26:4000'  // Your computer's IP for mobile testing
    : 'https://your-production-domain.com', // Replace with your production domain
  API_URL: isDevelopment 
    ? 'http://192.168.8.26:4000/api'
    : 'https://your-production-domain.com/api',
};

// Alternative: Use environment variables
// export const API_CONFIG = {
//   BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.26:4000',
//   API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.26:4000/api',
// };

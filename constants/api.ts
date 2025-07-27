const isDevelopment = __DEV__;

export const API_CONFIG = {
  
  BASE_URL: isDevelopment 
    ? 'https://greenmintbackend.onrender.com' 
    : 'https://greenmintbackend.onrender.com',
  API_URL: isDevelopment 
    ? 'https://greenmintbackend.onrender.com/api'
    : 'https://greenmintbackend.onrender.com/api',
};


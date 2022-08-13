import nextConfig from 'next/config';
const { publicRuntimeConfig } = nextConfig();

export const APP_NAME = publicRuntimeConfig.APP_NAME;
export const API_HOST = publicRuntimeConfig.API_HOST;
export const PRODUCTION = publicRuntimeConfig.PRODUCTION;
export const DOMAIN = publicRuntimeConfig.DOMAIN;
export const FB_APP_ID = publicRuntimeConfig.FB_APP_ID;

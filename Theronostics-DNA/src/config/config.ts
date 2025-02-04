// src/config.ts

const env = process.env.REACT_APP_NODE_ENV;

let appUrl = "";
let apiUrl = "";
let theme_key = "";
let ENCRYPTION_KEY_1 = "";
let ENCRYPTION_KEY_2 = "";

switch (env) {
  case "development":
    appUrl = process.env.REACT_APP_DEV_APP_URL || "";
    apiUrl = process.env.REACT_APP_DEV_API_URL || "";
    theme_key = process.env.REACT_APP_CURRENT_THEME_KEY || "";
    ENCRYPTION_KEY_1 = process.env.REACT_APP_DEV_ENCRYPTION_KEY_1 || "";
    ENCRYPTION_KEY_2 = process.env.REACT_APP_DEV_ENCRYPTION_KEY_2 || "";

    break;
  case "testing":
    appUrl = process.env.REACT_APP_TEST_APP_URL || "";
    apiUrl = process.env.REACT_APP_TEST_API_URL || "";
    theme_key = process.env.REACT_APP_CURRENT_THEME_KEY || "";
    ENCRYPTION_KEY_1 = process.env.REACT_APP_PROD_ENCRYPTION_KEY_1 || "";
    ENCRYPTION_KEY_2 = process.env.REACT_APP_PROD_ENCRYPTION_KEY_2 || "";

    break;
  case "production":
    appUrl = process.env.REACT_APP_PROD_APP_URL || "";
    apiUrl = process.env.REACT_APP_PROD_API_URL || "";
    theme_key = process.env.REACT_APP_CURRENT_THEME_KEY || "";
    ENCRYPTION_KEY_1 = process.env.REACT_APP_TEST_ENCRYPTION_KEY_1 || "";
    ENCRYPTION_KEY_2 = process.env.REACT_APP_TEST_ENCRYPTION_KEY_2 || "";

    break;
  case "localhost":
    appUrl = process.env.REACT_APP_LOCAL_APP_URL || "";
    apiUrl = process.env.REACT_APP_LOCAL_API_URL || "";
    theme_key = process.env.REACT_APP_CURRENT_THEME_KEY || "";
    ENCRYPTION_KEY_1 = process.env.REACT_APP_LOCAL_ENCRYPTION_KEY_1 || "";
    ENCRYPTION_KEY_2 = process.env.REACT_APP_LOCAL_ENCRYPTION_KEY_2 || "";

    break;
  default:
    appUrl = process.env.REACT_APP_LOCAL_APP_URL || "";
    apiUrl = process.env.REACT_APP_LOCAL_API_URL || "";
    theme_key = process.env.REACT_APP_CURRENT_THEME_KEY || "";
    ENCRYPTION_KEY_1 = process.env.REACT_APP_LOCAL_ENCRYPTION_KEY_1 || "";
    ENCRYPTION_KEY_2 = process.env.REACT_APP_LOCAL_ENCRYPTION_KEY_2 || "";

    break;
}

const config = {
  appUrl,
  apiUrl,
  theme_key,
  ENCRYPTION_KEY_1,
  ENCRYPTION_KEY_2,
};

export default config;

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  erpUrl: process.env.ERP_URL || 'http://localhost:3000',
  users: {
    admin: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    },
    user: {
      username: process.env.TEST_USERNAME || 'test_user',
      password: process.env.TEST_PASSWORD || 'Test@123456'
    }
  },
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO) || 100,
    timeout: parseInt(process.env.TIMEOUT) || 30000,
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH) || 1920,
      height: parseInt(process.env.VIEWPORT_HEIGHT) || 1080
    }
  },
  test: {
    retries: parseInt(process.env.RETRIES) || 2,
    workers: process.env.CI ? 1 : undefined
  }
};

module.exports = config;

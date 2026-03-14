require('dotenv').config()

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFiles: ['./jest.setup.js'],
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
    __EXTERNAL_SERVER_URL__: 'http://localhost:3000',
    __INTERNAL_SERVER_URL__: 'http://localhost:3000',
  },
}
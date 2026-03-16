require('dotenv').config()

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
    __EXTERNAL_SERVER_URL__: process.env.EXTERNAL_SERVER_URL,
    __INTERNAL_SERVER_URL__: process.env.INTERNAL_SERVER_URL,
  },
}

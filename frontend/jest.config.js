module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Ensure JS and JSX are transformed
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock styles
  },
  testEnvironment: "jsdom", // Ensure Jest uses a browser-like environment
  transformIgnorePatterns: [
    "/node_modules/(?!axios)", // Make sure Axios is transformed
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Run setupTests after the environment is set
};

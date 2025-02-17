module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest', // This ensures Jest uses Babel for transforming JSX/TSX files
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"  // This will resolve the alias
      },
  };
  
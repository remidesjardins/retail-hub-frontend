module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'vue'],
    transform: {
        '^.+\\.vue$': 'vue-jest',   // Handles `.vue` files
        '^.+\\.js$': 'babel-jest',  // Handles JavaScript ES module syntax
    },
    testMatch: ['**/tests/unit/**/*.spec.js'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    transformIgnorePatterns: [
        '/node_modules/'            // Ignore node_modules
    ]
};
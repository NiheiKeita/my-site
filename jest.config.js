module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx'
            }
        }]
    },
    testMatch: ['**/*.test.(ts|tsx)'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.d.ts',
    ],
};
import nextJest from 'next/jest.js'

// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // This resolves the '@/' alias if you use it in your code
    '^@/(.*)$': '<rootDir>/src/$1',
    // This is the mock for MUI icons
    '^@mui/icons-material/(.*)$':
      '<rootDir>/src/__mocks__/@mui/icons-material/jest-mock.tsx',
  },
  // This tells Jest to transform these specific node modules
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|@supabase/auth-helpers-nextjs)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)

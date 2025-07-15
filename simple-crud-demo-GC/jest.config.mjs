import nextJest from 'next/jest.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mui/icons-material/(.*)$':
      '<rootDir>/src/__mocks__/@mui/icons-material/jest-mock.tsx',
    'msw/node': require.resolve('msw/node'),
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|@supabase/auth-helpers-nextjs|msw)/)',
  ],
}

export default createJestConfig(customJestConfig)

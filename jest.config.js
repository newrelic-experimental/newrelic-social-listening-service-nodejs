module.exports = {
  setupFiles: ['./jest-setup-file.ts', 'dotenv/config'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['<rootDir>/app/test/mock'],
};

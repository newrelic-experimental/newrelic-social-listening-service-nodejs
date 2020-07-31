module.exports = {
  setupFiles: ['dotenv/config', './jest-setup-file.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

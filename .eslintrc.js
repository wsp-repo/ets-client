module.exports = {
  overrides: [
    {
      extends: ['./node_modules/@wspro/linter/eslint/js'],
      files: ['*.js'],
    },
    {
      extends: ['./node_modules/@wspro/linter/eslint/ts'],
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        include: ['./src/**/*.ts', './test/**/*.ts'],
        project: './tsconfig.json',
      },
    },
  ],
  root: true,
};

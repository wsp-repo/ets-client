#!/bin/bash

echo "Remove node_modules & package-lock.json"
rm -r -f -d ./node_modules ./package-lock.json

echo "Install dependencies..."
npm install --save --save-exact \
    @nestjs/common@latest \
    @nestjs/microservices@latest \
    dotenv@latest \
    rxjs@latest \
    uuid@latest

echo "Install devDependencies..."
npm install --save-dev --save-exact \
    @nestjs/testing@latest \
    @types/jest@latest \
    @types/node@latest \
    @types/supertest@latest \
    @typescript-eslint/eslint-plugin@latest \
    @typescript-eslint/parser@latest \
    @wspro/linter@latest \
    cross-env@latest \
    eslint@latest \
    eslint-config-airbnb-base@latest \
    eslint-config-airbnb-typescript@latest \
    eslint-config-prettier@latest \
    eslint-plugin-import@latest \
    eslint-plugin-jest@latest \
    eslint-plugin-jsx-a11y@latest \
    eslint-plugin-prettier@latest \
    eslint-plugin-simple-import-sort@latest \
    husky@latest \
    jest@latest \
    lint-staged@latest \
    prettier@latest \
    rimraf@latest \
    supertest@latest \
    ts-jest@latest \
    ts-loader@latest \
    ts-node@latest \
    tsconfig-paths@latest \
    typescript@latest

echo "Installed all dependencies"

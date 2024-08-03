import { fix } from './package.json.declapract';

const exampleFoundContents = `
{
  "author": "you",
  "name": "svc-jobs",
  "main": "src/index.js",
  "private": true,
  "version": "0.8.2",
  "devDependencies": {
    "@types/aws-lambda": "8.10.40",
    "@types/jest": "27.0.1",
    "@types/pg": "7.14.3",
    "@types/shelljs": "0.8.6",
    "@types/uuid": "3.4.7",
    "@types/yesql": "3.2.2",
    "@typescript-eslint/eslint-plugin": "2.19.0",
    "@typescript-eslint/parser": "2.19.0",
    "declapract-typescript-ehmpathy": "0.1.7",
    "core-js": "3.6.4",
    "declapract": "0.9.2",
    "eslint": "6.1.0",
    "eslint-config-airbnb-base": "14.0.0",
    "eslint-config-airbnb-typescript": "7.0.0",
    "eslint-config-prettier": "6.10.0",
    "eslint-plugin-import": "2.20.1",
    "eslint-plugin-prettier": "3.1.2",
    "jest": "27.1.1",
    "prettier": "2.0.2",
    "serverless": "2.57.0",
    "serverless-offline": "5.12.1",
    "serverless-pseudo-parameters": "2.5.0",
    "shelljs": "0.8.3",
    "simple-lambda-testing-methods": "0.1.2",
    "sql-code-generator": "0.8.2",
    "sql-dao-generator": "0.2.0",
    "sql-schema-control": "0.7.3",
    "sql-schema-generator": "0.21.1",
    "ts-jest": "27.0.5",
    "typescript": "4.4.2",
    "uuid": "3.4.0"
  },
  "scripts": {
    "fix:format": "prettier --write '**/*.ts' --config ./prettier.config.js",
    "generate:dao:postgres": "npx sql-dao-generator generate && npm run format",
    "generate:schema": "npx sql-schema-generator generate -c codegen.sql.schema.yml",
    "generate:types-from-sql": "npx sql-code-generator generate -c codegen.sql.types.yml",
    "build:clean": "rm dist/ -rf",
    "build": "npm run build:clean && npm run build:compile",
    "provision:docker:prepare": "cp provision/schema/sql/init/.extensions.sql provision/docker/integration_test_db/init/ && cp provision/schema/sql/init/.schema.sql provision/docker/integration_test_db/init/ && cp provision/schema/sql/init/.user.cicd.sql provision/docker/integration_test_db/init/",
    "provision:docker:up": "docker compose -f ./provision/docker/integration_test_db/docker-compose.yml up -d --force-recreate --build --renew-anon-volumes",
    "build:compile": "tsc -p ./tsconfig.build.json",
    "provision:docker:await": "docker compose -f ./provision/docker/integration_test_db/docker-compose.yml exec -T postgres /root/wait-for-postgres.sh",
    "provision:docker:down": "docker compose -f ./provision/docker/integration_test_db/docker-compose.yml down",
    "provision:schema:plan": "npx sql-schema-control plan -c provision/schema/control.yml",
    "test:lint": "eslint -c ./.eslintrc.js src/**/*.ts",
    "provision:schema:apply": "npx sql-schema-control apply -c provision/schema/control.yml",
    "provision:integration-test-db": "npm run provision:docker:prepare && npm run provision:docker:up && npm run provision:docker:await && npm run provision:schema:plan && npm run provision:schema:apply && npm run provision:schema:plan",
    "test:types": "tsc -p ./tsconfig.build.json --noEmit",
    "test:format": "prettier --parser typescript --check 'src/**/*.ts' --config ./prettier.config.js",
    "test:unit": "jest -c ./jest.unit.config.js --forceExit --coverage --verbose --passWithNoTests",
    "deploy:release": "npm run build && sls deploy -v -s $STAGE",
    "test:integration": "jest -c ./jest.integration.config.js --forceExit --coverage --verbose --passWithNoTests",
    "test": "npm run test:types && npm run test:format && npm run test:lint && npm run test:unit && npm run test:integration && npm run test:acceptance:locally",
    "test:acceptance": "npm run build && jest -c ./jest.acceptance.config.js --forceExit --verbose --runInBand",
    "prepush": "npm run test && npm run build",
    "test:acceptance:locally": "npm run build && LOCALLY=true jest -c ./jest.acceptance.config.js",
    "preversion": "npm run prepush",
    "postversion": "git push origin HEAD --tags --no-verify",
    "deploy:dev": "STAGE=dev npm run deploy:release",
    "deploy:prod": "STAGE=prod npm run deploy:release && npm run deploy:send-notification",
    "fix:lint": "eslint -c ./.eslintrc.js src/**/*.ts --fix"
  },
  "dependencies": {
    "@middy/core": "1.0.0",
    "@types/yesql": "3.2.2",
    "aws-lambda": "1.0.5",
    "aws-sdk": "2.658.0",
    "axios": "0.19.2",
    "change-case": "4.1.1",
    "config-with-paramstore": "1.1.1",
    "zipcodes": "8.0.0",
    "date-fns": "2.14.0",
    "domain-objects": "0.7.2",
    "joi": "17.4.0",
    "simple-type-guards": "0.2.0",
    "lambda-service-client": "2.0.0",
    "middy": "0.33.2",
    "pg": "8.2.1",
    "simple-dynamodb-client": "0.7.1",
    "simple-lambda-handlers": "0.5.0",
    "simple-leveled-log-methods": "0.1.1",
    "us-state-codes": "1.1.2",
    "yesql": "4.1.3"
  }
}
    `.trim();

describe('package.json order', () => {
  it('should sort a small example of a package json correctly', async () => {
    const fixedContents = await fix(
      `
{
  "author": "you",
  "name": "svc-jobs",
  "main": "src/index.js",
  "private": true,
  "version": "0.8.2",
  "devDependencies": {},
  "scripts": {
    "test": "test...",
    "build": "build..."
  },
  "dependencies": {}
}
      `.trim(),
      {} as any,
    );
    expect(fixedContents).toMatchSnapshot();
  });
  it('should not reorder unspecified keys', async () => {
    const fixedContents = await fix(
      `
{
  "private": true,
  "author": "you",
  "license": "MIT",
  "version": "0.8.2",
  "name": "svc-jobs",
  "main": "src/index.js",
  "devDependencies": {},
  "scripts": {
    "new-thing": "do new thing",
    "test": "test...",
    "deploy": "deploy...",
    "undeploy": "undeploy...",
    "build": "build..."
  },
  "dependencies": {}
}
      `.trim(),
      {} as any,
    );
    expect(fixedContents).toMatchSnapshot();
  });
  it('should sort a full example of a package json correctly', async () => {
    const fixedContents = await fix(exampleFoundContents, {} as any);
    expect(fixedContents).toMatchSnapshot();
  });
});

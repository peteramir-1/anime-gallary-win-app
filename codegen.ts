import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8021/graphql',
  documents: 'src/app/core/graphql/*.graphql',
  config: {
    declarationKind: 'interface',
  },
  generates: {
    'src/app/core/services/graphql.service.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
    },
    './src/app/core/graphql/schema/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;

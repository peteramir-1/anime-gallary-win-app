import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8021/graphql',
  documents: 'src/app/graphql/documents/*.graphql',
  config: {
    declarationKind: 'interface',
  },
  generates: {
    'src/app/graphql/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
    },
    './src/app/graphql/schema/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;

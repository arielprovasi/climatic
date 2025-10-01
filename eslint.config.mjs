import nextPlugin from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    },
    nextPlugin.configs['core-web-vitals'],
    {},
];

export default eslintConfig;

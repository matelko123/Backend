module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: ['standard'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        indent: ['error', 4],
        semi: [2, 'always'],
        curly: ['error', 'multi'],
        camelcase: ['error', { ignoreDestructuring: true, properties: 'never' }]
    }
};

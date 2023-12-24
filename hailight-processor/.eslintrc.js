module.exports = {
    "env": {
        "es2021": true,
        "node": true,
        "jest": true
    },
    plugins: [
        "@stylistic"
    ],
    parser: "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": true
    },
    "rules": {
        "@stylistic/quotes": ["error", "double"],
        "@stylistic/semi": ["error", "always"],
    }
}; 
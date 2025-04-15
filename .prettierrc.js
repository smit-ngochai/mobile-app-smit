module.exports = {
    env: {
        es6: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2017,
        ecmaFeatures: {
            jsx: true
        },
        sourceType: "module"
    },
    proseWrap: "always",
    vueIndentScriptAndStyle: false,
    wrapAttributes: false,
    sortAttributes: false,
    bracketSpacing: true,
    bracketSameLine: true,
    jsxBracketSameLine: true,
    singleQuote: false,
    trailingComma: "none",
    arrowParens: "avoid",
    tabWidth: 4,
    useTabs: false,
    semi: false,
    printWidth: 500,
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            options: {
                parser: "typescript"
            }
        }
    ]
}

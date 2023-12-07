module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "airbnb-base",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "linebreak-style": "off",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "no-tabs": "off",
    "no-console": "off",
    "comma-dangle": "off",
    camelcase: "off",
    "operator-linebreak": "off",
    "no-underscore-dangle": "off",
    "import/no-extraneous-dependencies": "off",
  },
};

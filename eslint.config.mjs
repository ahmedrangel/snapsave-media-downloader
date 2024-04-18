import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.js", "**/*.ts"],
  ignores: [
    "node_modules/**/*",
    "dist/**/*"
  ],
  extends: [
    {
      rules: {
        "indent": ["error", 2, { "SwitchCase": 1 }],
        "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "camelcase": "off",
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "no-console": ["off"],
        "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
        "no-multi-spaces": "error",
        "space-before-blocks": "error",
        "no-trailing-spaces": "error",
      }
    },
    ...tseslint.configs.recommended
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "off",
  }
});
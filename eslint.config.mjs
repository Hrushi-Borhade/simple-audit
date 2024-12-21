// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic.map((config) => {
    if (config.rules) {
      config.rules["@typescript-eslint/consistent-type-definitions"] = "off";
      config.rules["@typescript-eslint/prefer-for-of"] = "off";
    }
    return config;
  })
);

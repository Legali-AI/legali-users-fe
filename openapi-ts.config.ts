import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: {
    path: "http://localhost:8000/openapi.json",
  },
  output: {
    format: "prettier",
    lint: "biome",
    clean: true,
    path: "./src/sdk/out",
  },

  plugins: [
    ...defaultPlugins,
    // Use axios as http client
    "@hey-api/client-axios",
    // Use zod as validation library
    "zod",
    {
      asClass: false,
      name: "@hey-api/sdk",
    },

    // Transform dates to correct format
    {
      name: "@hey-api/sdk",
      validator: true,
    },

    // Generate typescript enums, usage: enums
    {
      enums: "typescript",
      name: "@hey-api/typescript",
    },

    // Generate schema, usage: validation
    {
      name: "@hey-api/schemas",
      type: "json",
    },
  ],
});

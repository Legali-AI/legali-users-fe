module.exports = {
  "!(src/sdk|**/sdk)/**/*.{js,jsx,ts,tsx}": [
    "biome check --write",
    () => "bun run type-check",
    // () => "bun run build", // build better on CI/CD
  ],
  "**/*.{json,md,css,scss,yaml,yml}": ["prettier --write"],
};

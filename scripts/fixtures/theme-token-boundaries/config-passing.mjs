/** Fixture config: scans only the intentionally passing fixture. */
export default {
  tokenAuthority: [],
  tokenConsumers: ['scripts/fixtures/theme-token-boundaries/passing-*.html'],
  ignore: [],
  allowedTokenPrefixes: ['--color-', '--font-', '--text-', '--space-', '--shadow-'],
};

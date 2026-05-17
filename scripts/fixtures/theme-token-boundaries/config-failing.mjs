/** Fixture config: scans only the intentionally failing fixture. */
export default {
  tokenAuthority: [],
  tokenConsumers: ['scripts/fixtures/theme-token-boundaries/failing-*.html'],
  ignore: [],
  allowedTokenPrefixes: ['--color-', '--font-', '--text-', '--space-', '--shadow-'],
};

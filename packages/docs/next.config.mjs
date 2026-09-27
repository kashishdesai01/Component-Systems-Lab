import createMDX from '@next/mdx';
const withMDX = createMDX({ extension: /\.mdx?$/ });
export default withMDX({
  output: 'export',
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['@csl/ui', '@csl/tokens'],
});

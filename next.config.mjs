/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only App Router files are routed (src/app/.../page.js). The legacy
  // src/pages/*.jsx files are plain components, not Pages Router routes.
  // NOTE: must list >= 2 entries — Next serializes this array through a
  // loader query string and a single entry collapses to a bare string.
  pageExtensions: ['js', 'mjs'],
  devIndicators: { buildActivity: false },
};

export default nextConfig;

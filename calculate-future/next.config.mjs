/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export-friendly: every calculator/guide page is pre-rendered at
  // build time via generateStaticParams(), driven entirely by the config
  // files in /config — no per-page files to hand-maintain.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

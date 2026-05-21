import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  // Static export has no Next.js image-optimization server. Without this,
  // next/image (which Fumadocs uses to render markdown images) emits
  // `/_next/image?url=...` srcs that 404 on a static host. `unoptimized`
  // makes next/image emit direct asset paths instead.
  images: { unoptimized: true },
};

export default withMDX(config);

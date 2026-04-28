import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'build',
  outputFileTracingRoot: __dirname,
  experimental: {
    forceSwcTransforms: true,
  },
}
 
export default nextConfig
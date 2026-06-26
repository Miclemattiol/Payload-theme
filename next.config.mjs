import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin';

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const serverHostname = new URL(serverURL).hostname

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/media/**' },
      { protocol: 'https', hostname: serverHostname, pathname: '/media/**' },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

const withNextIntl = createNextIntlPlugin();

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })

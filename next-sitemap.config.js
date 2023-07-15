/** @type {import('next-sitemap').IConfig} */

const dev = process.env.NODE_ENV !== 'production';
const url = dev
  ? 'http://localhost:3000/'
  : process?.env?.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/';

module.exports = {
  siteUrl: url,
  generateRobotsTxt: true,
  changefreq: 'daily',
  exclude: ['/signin', '/terms-of-service', '/privacy-policy']
};

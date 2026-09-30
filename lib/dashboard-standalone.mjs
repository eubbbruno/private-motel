const allowedExact = new Set(['/dashboard', '/api/dashboard', '/api/campaigns/active']);
const allowedPrefixes = Object.freeze([
  '/dashboard/',
  '/api/dashboard/',
  '/images/',
  '/_next/',
]);

const allowedFiles = new Set(['/favicon.ico', '/robots.txt']);

export function dashboardRedirect(pathname, env = process.env) {
  if (env.DASHBOARD_STANDALONE !== 'true') return null;
  if (allowedFiles.has(pathname) || allowedExact.has(pathname) || allowedPrefixes.some(prefix => pathname.startsWith(prefix))) return null;
  return '/dashboard';
}

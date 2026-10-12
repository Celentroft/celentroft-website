/**
 * Absolute origin of the site, used for Open Graph URLs.
 * On Vercel it is derived from the system env vars, locally it falls back to localhost.
 */
const host =
  process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : (process.env.VERCEL_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL);

export const siteUrl = host ? `https://${host}` : "http://localhost:3000";

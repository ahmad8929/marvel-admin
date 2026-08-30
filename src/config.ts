/** Runtime configuration from Vite env vars (inlined at build time). */
const raw = (import.meta.env.VITE_API_URL ?? "").trim();

if (import.meta.env.PROD && (!raw || raw.startsWith("http://localhost"))) {
  // eslint-disable-next-line no-console
  console.error(
    "[marvel-admin] VITE_API_URL is not set for this build.\n" +
      "Set it in Vercel → Project → Settings → Environment Variables to\n" +
      "  https://<your-api-host>/api/v1\n" +
      "then REDEPLOY (env vars are baked in at build time).",
  );
}

const apiUrl = raw || "http://localhost:3001/api/v1";

export const config = {
  apiUrl,
  adminApiUrl: apiUrl + "/admin",
  // Only used for building preview URLs; the API returns absolute media URLs anyway.
  mediaUrl:
    import.meta.env.VITE_MEDIA_URL ??
    "https://orangered-badger-607568.hostingersite.com/media",
  /** true when the build shipped without a real API URL */
  misconfigured:
    import.meta.env.PROD && (!raw || raw.startsWith("http://localhost")),
} as const;

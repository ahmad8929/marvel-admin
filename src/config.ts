/** Runtime configuration from Vite env vars. */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1",
  adminApiUrl:
    (import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1") + "/admin",
  mediaUrl: import.meta.env.VITE_MEDIA_URL ?? "https://media.marvelsonline.in",
} as const;

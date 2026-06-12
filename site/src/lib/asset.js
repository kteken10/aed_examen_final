// Préfixe les assets publics avec la base Vite (gère GitHub Pages /repo/, Cloudflare racine, local).
export const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\//, '')

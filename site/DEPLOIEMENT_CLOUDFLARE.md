# Déploiement sur Cloudflare Pages

La plateforme est un site **statique** (Vite + React). Le dossier à publier est **`dist/`** (déjà généré).

## Régénérer le build (si tu modifies quelque chose)
```bash
cd site
npm install      # une seule fois
npm run build    # produit/rafraîchit dist/
```
> Si les données changent, régénère d'abord `src/data.json` (voir le notebook / scripts), puis `npm run build`.

## ⚠ Avant de déployer
Dans `src/pages/References.jsx`, remplace `GITHUB_URL` par l'adresse réelle de ton dépôt GitHub, puis relance `npm run build`.

---

## Option A — Glisser-déposer (le plus simple, sans Git)
1. Va sur **dash.cloudflare.com** → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
2. Donne un nom au projet (ex. `aed-demande-tourisme`).
3. **Glisse le dossier `dist/`** (ou son contenu) dans la zone d'upload.
4. **Deploy**. Ton site est en ligne sur `https://<projet>.pages.dev`.

Pour mettre à jour : refais `npm run build` et ré-uploade `dist/`.

## Option B — Connexion Git (déploiement automatique à chaque push)
1. Pousse le dossier `site/` sur un dépôt GitHub.
2. Cloudflare Pages → **Create application** → **Pages** → **Connect to Git** → choisis le repo.
3. Réglages de build :
   - **Framework preset** : `Vite`
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Root directory** : `site` (si le repo contient tout le projet, pas seulement `site/`)
4. **Save and Deploy**. Chaque `git push` redéploie automatiquement.

## Domaine personnalisé (optionnel)
Dans le projet Pages → **Custom domains** → **Set up a domain** → saisis ton domaine et suis les instructions DNS (Cloudflare ajoute le CNAME/route).

---

## Notes techniques
- **Aucune dépendance CDN bloquante** : Chart.js est bundlé dans le build → les graphiques marchent **hors-ligne**. (Seules les polices Google Fonts sont en CDN, avec repli automatique sur les polices système.)
- **Pas de routing serveur** : navigation par onglets côté client, une seule page → aucune configuration de redirection SPA nécessaire.
- **Fichiers téléchargeables** (GOLD, dictionnaire, rapport, notebook, dashboard HTML) servis depuis `dist/files/`.

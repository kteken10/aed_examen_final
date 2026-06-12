# Déploiement — GitHub Pages (lien public pour le professeur)

Dépôt : **https://github.com/kteken10/aed_examen_final**
URL publique finale : **https://kteken10.github.io/aed_examen_final/**

Le site (`site/`, Vite + React) est construit et publié **automatiquement par GitHub Actions** à chaque `git push`.
Tout est déjà configuré : `.github/workflows/deploy.yml`, `base: './'` dans `site/vite.config.js`, chemins d'assets relatifs.

---

## Étapes (une seule fois)

### 1. Pousser le projet sur GitHub
Depuis le dossier `AED_EXAMEN_FINAL/` :
```bash
git init
git add .
git commit -m "Rendu examen AED — pipeline, GOLD, dashboard, rapport, plateforme web"
git branch -M main
git remote add origin https://github.com/kteken10/aed_examen_final.git
git push -u origin main
```
> S'il demande une authentification : utilise un **Personal Access Token** GitHub comme mot de passe
> (GitHub → Settings → Developer settings → Personal access tokens → Fine-grained, scope `repo`).

### 2. Activer GitHub Pages en mode "Actions"
Sur la page du dépôt : **Settings → Pages → Build and deployment → Source : `GitHub Actions`**.

### 3. C'est tout
Le workflow se lance automatiquement (onglet **Actions** du dépôt). Au bout de ~2 minutes,
le site est en ligne sur **https://kteken10.github.io/aed_examen_final/**.
Chaque `git push` suivant redéploie automatiquement.

---

## Mettre à jour le site plus tard
```bash
# après une modif (données, design, contenu) :
git add .
git commit -m "maj"
git push          # le déploiement se relance tout seul
```

## Vérifier en local avant de pousser
```bash
cd site
npm install
npm run build
npm run preview   # ouvre l'URL affichée (http://localhost:4173)
```

## Alternative : Cloudflare Pages (glisser-déposer, sans Git)
1. `cd site && npm run build`
2. dash.cloudflare.com → Workers & Pages → Create → Pages → **Upload assets** → glisse `site/dist/`.
3. Le site est servi sur `https://<projet>.pages.dev`.

> Le `base: './'` rend le build compatible **GitHub Pages, Cloudflare et ouverture locale** sans rien changer.

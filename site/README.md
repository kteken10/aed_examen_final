# Plateforme — Demande touristique & recommandation de destinations

Plateforme web (Vite + React) centralisant l'ensemble des livrables de l'examen AED :
dashboard interactif, dictionnaire de données, Data Gold, journal qualité, rapport, annexes et références techniques.

## Lancer en local
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # génère dist/ (à publier)
npm run preview  # prévisualise le build
```

## Structure
- `src/data.json` — données générées par le pipeline (KPI, séries, prévisions, modèles, GOLD, dico, qualité, reco).
- `src/pages/` — un composant par onglet.
- `public/files/` — fichiers téléchargeables (GOLD .xlsx, dictionnaire, rapport .pptx, notebook, dashboard HTML).
- `public/img/` — synthèses visuelles de marché.

## Déploiement
Voir **DEPLOIEMENT_CLOUDFLARE.md**. Pense à mettre l'URL de ton dépôt GitHub dans `src/pages/References.jsx`.

## Mise à jour des données
Les données sont figées dans `src/data.json`. Pour les rafraîchir après un changement du pipeline,
régénère ce fichier depuis le notebook puis relance `npm run build`.

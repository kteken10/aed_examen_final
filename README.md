# Examen final — Prévision de la demande touristique & recommandation de destinations

Projet d'Analyse Exploratoire des Données (AED) et de Management de Projet Data.
**Objectif métier** : prévoir la demande touristique future **par pays** (série temporelle), puis **recommander les meilleures destinations** à promouvoir dans chaque pays (scoring sous contraintes).

## 🌐 Plateforme en ligne (à consulter en priorité)

**https://kteken10.github.io/aed_examen_final/**

Une interface unique qui regroupe tous les livrables : dashboard interactif, Data Gold, dictionnaire de données, journal de qualité, rapport et références techniques. Tous les fichiers sources y sont aussi téléchargeables.

## 📂 Structure du dépôt

| Dossier / fichier | Contenu |
|---|---|
| **`rendu_final/`** | **Le devoir complet** (voir détail ci-dessous) |
| `site/` | Code source de la plateforme web (React + Vite) déployée en ligne |

### Contenu de `rendu_final/`
| Fichier | Livrable |
|---|---|
| `01_pipeline_tourisme.ipynb` | **Code Python exécuté** : chargement → audit → nettoyage → GOLD → modélisation → export |
| `GOLD_DATA_tourisme.xlsx` | **Data Gold** fiabilisée (5 feuilles : README, journal qualité, grain pays, grain destination, dictionnaire) |
| `03_Dictionnaire_de_donnees.xlsx` | **Dictionnaire de données** (20 variables) |
| `04_Dashboard_demande_tourisme.html` | Dashboard autonome (version « double-clic ») |
| `05_Rapport_Management_Projet.pptx` | **Rapport de management de projet** |
| `0X_*.csv / .json / .xlsx` | Données sources fournies (entrées du sujet) — nécessaires pour ré-exécuter le notebook |
| `images_marche/` | Synthèses visuelles de marché (annexes fournies) |

## ▶️ Ré-exécuter le notebook
Ouvrir `rendu_final/01_pipeline_tourisme.ipynb` depuis le dossier `rendu_final/` et lancer « Run All ».
Les données sources sont dans le même dossier ; le notebook régénère lui-même la Data Gold.

## 🔑 Points méthodologiques
- **Deux niveaux de granularité** : prévision au niveau **pays** (série temporelle) vs recommandation au niveau **destination** (scoring — aucun modèle).
- **Split temporel** strict (jamais aléatoire) + **prévision multi-pas**.
- **Comparaison de plusieurs approches de prévision** : baselines + famille statistique (**ETS/Holt-Winters, SARIMA, SARIMAX**) + **régression dynamique** de série temporelle (retards + saisonnalité), benchmark Random Forest.
- **Validation croisée adaptée aux séries temporelles** (Time Series Cross-Validation, 12 plis) + **split train / validation / test**.
- **Qualité & gouvernance** : 14 anomalies tracées, 3 sources non fiables écartées (on refuse plutôt qu'on impute).

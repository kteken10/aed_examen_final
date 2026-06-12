import { Download } from 'lucide-react'
import { asset } from '../lib/asset'
import { Card, CardContent, CardHeader, CardTitle, PageHeader, Button } from '../components/ui'

function Section({ n, title, children }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><span className="inline-flex w-6 h-6 rounded-lg bg-accent-500 text-slate-900 text-xs font-bold items-center justify-center">{n}</span>{title}</CardTitle></CardHeader>
      <CardContent className="text-sm text-slate-700 space-y-2 [&_b]:text-slate-900 [&_ul]:ml-4 [&_ul]:list-disc [&_li]:mt-1.5">{children}</CardContent>
    </Card>
  )
}

export default function Report({ data }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rapport de management de projet"
        description="Du besoin métier à la décision : choix techniques, arbitrages, limites et recommandations. La valeur tient moins au modèle qu'à la rigueur de l'audit — savoir quelles données refuser est la première décision métier."
        actions={<Button variant="accent" as="a" href={asset("files/05_Rapport_Management_Projet.pptx")} download><Download className="w-4 h-4" /> Rapport .pptx</Button>}
      />

      <Section n="1" title="Le besoin métier — deux questions de natures différentes">
        <p>Deux niveaux, deux granularités, deux méthodes :</p>
        <ul>
          <li><b>A — Quels marchés (pays) sont porteurs ?</b> → prévision de <b>série temporelle</b> (demande mensuelle par pays).</li>
          <li><b>B — Quelles destinations promouvoir ?</b> → <b>aucun modèle</b> : score multicritère raisonné sous contraintes.</li>
        </ul>
        <p>Le scoring est automatisable ; le <b>choix final des destinations et l'allocation budgétaire restent humains</b>.</p>
      </Section>

      <Section n="2" title="Les données & leur qualité — on ne suppose jamais qu'une donnée est correcte">
        <p>{data.stats.n_sources} sources, {data.stats.n_quality} anomalies, 4 critiques, 3 sources écartées.</p>
        <ul>
          <li><b>05_cible</b> : fichier en texte libre, sans données structurées → pas de variable cible (recommandation non supervisée).</li>
          <li><b>06_campaign</b> : status incohérent (FAIL à ROI 220k, TOP à 1 %) → écarté.</li>
          <li><b>03_reviews</b> : sentiment décorrélé du score (corr 0,03) → exclu.</li>
          <li><b>04_facteurs</b> : séparateur « ; », 61 % de jointure perdue → météo/vol optionnels.</li>
          <li><b>Harmonisation</b> : casse pays + acronyme « USA » cassé par str.title() → corrigés.</li>
        </ul>
      </Section>

      <Section n="3" title="Les choix techniques">
        <ul>
          <li><b>Clé (pays, destination)</b> : City_X est réutilisé entre pays, jamais la destination seule.</li>
          <li><b>Refuser plutôt qu'imputer</b> : reconstruire une donnée non fiable fausse la décision.</li>
          <li><b>GOLD + 8 dérivées</b> : value_for_money, normalisations, score composite, pénalité météo, score ajusté.</li>
          <li><b>Pondérations modifiables</b> : le levier de décision reste défendable.</li>
        </ul>
      </Section>

      <Section n="4" title="Modélisation — deux familles de prévision comparées">
        <p>Cible : demand_index mensuel par pays. Évaluation en <b>prévision multi-pas</b> (train ≤ juin 2024, test juil.–déc. 2024) :</p>
        <ul>
          <li><b>Statistique native</b> : SARIMA et SARIMAX (par pays).</li>
          <li><b>ML supervisé</b> : régression dynamique (retards + saisonnalité) et Random Forest (globaux).</li>
        </ul>
        <p><b>SARIMAX (MAE 8,2) bat SARIMA (9,6)</b>, mais les deux sont dominés par la <b>régression dynamique globale (MAE {data.stats.best_mae}, 5/8 pays)</b> — mutualiser 8 séries courtes bat un modèle univariate. <b>Choix après comparaison, pas par défaut.</b></p>
      </Section>

      <Section n="5" title="Les arbitrages assumés">
        <ul>
          <li><b>Data</b> : écarter 3 sources non fiables plutôt que les imputer — décision défensive.</li>
          <li><b>Modèle</b> : interprétabilité &gt; complexité. Régression &gt; SARIMA/SARIMAX/RF ici.</li>
          <li><b>KPI</b> : comparer les pays sur la dynamique (YoY), jamais sur le niveau d'indice.</li>
        </ul>
      </Section>

      <Section n="6" title="Recommandation métier">
        <p>Chaîne : marché porteur (momentum) → score destination ajusté météo → contraintes → décision humaine. Top des marchés porteurs : <b>Spain</b> (City_10, City_32, City_43) · <b>Germany</b> (City_37, City_4, City_5) · <b>Italy</b> (City_29, City_50, City_37). Météo « bad » pénalisée (−12) là où connue.</p>
      </Section>

      <Section n="7" title="Limites du modèle">
        <ul>
          <li>Prévision <b>sans intervalle de confiance</b> : ordre de grandeur.</li>
          <li><b>Saisonnalité contre-intuitive</b> (creux estival) : à valider avec le métier.</li>
          <li><b>Facteurs externes peu joignables</b> (61 % de perte) : indicatifs.</li>
          <li><b>Sources écartées</b> : protocole qualité avant réintégration.</li>
        </ul>
      </Section>

      <Section n="8" title="Recommandations & gouvernance">
        <p>Contrôle qualité à l'ingestion (casse, clés, jointures), <b>dater</b> les facteurs externes, <b>re-collecter</b> avis/campagnes selon protocole, <b>versionner</b> la GOLD. Chaque choix est tracé et défendable.</p>
      </Section>
    </div>
  )
}

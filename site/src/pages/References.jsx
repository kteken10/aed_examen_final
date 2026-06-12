import { GitBranch, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, PageHeader, Button } from '../components/ui'

const GITHUB_URL = 'https://github.com/VOTRE-COMPTE/aed-demande-tourisme' // ← remplacer par votre dépôt

const METHODO = [
  ['Type de problème', 'Prévision série temporelle (pays) + scoring (destination)', 'Deux granularités distinctes — ne pas confondre'],
  ['Validation', 'Split temporel + prévision multi-pas + backtest 12 origines', 'Pas de fuite ; robustesse hors d’un seul split'],
  ['Familles comparées', 'Statistique (SARIMA/SARIMAX) vs ML (LinReg/RF)', 'Comparaison exigée — choix justifié par les métriques'],
  ['Modèle retenu', 'Régression linéaire globale', 'Mutualise 8 séries courtes ; bat SARIMA univariate'],
  ['Priorisation marchés', 'Momentum YoY (pas le niveau d’indice)', 'Indices non comparables entre pays'],
  ['Contrainte météo', 'Score ajusté (bad −12, average −4 si connu)', 'Opérationnalise la contrainte sans biaiser les manquants'],
]

export default function References({ data }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Références techniques"
        description="Méthodologie, pile technique et accès au code source. Le détail reproductible (notebook, scripts) vit sur GitHub ; cette plateforme en présente les résultats."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Code source & reproductibilité</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">Le notebook exécute toute la chaîne (chargement → audit → nettoyage → GOLD → modélisation → export) et <b className="text-slate-900">régénère lui-même la GOLD DATA</b>.</p>
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary" as="a" href={GITHUB_URL} target="_blank" rel="noreferrer"><GitBranch className="w-4 h-4" /> Dépôt GitHub</Button>
              <Button variant="secondary" as="a" href="/files/01_pipeline_tourisme.ipynb" download><Download className="w-4 h-4" /> Notebook .ipynb</Button>
            </div>
            <p className="text-[11px] font-mono text-slate-400">⚠ Remplacez l'URL GitHub dans <code>src/pages/References.jsx</code>.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pile technique</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm text-slate-700 space-y-2">
              <li><b>Data / ML</b> : Python, pandas, scikit-learn, statsmodels (SARIMAX)</li>
              <li><b>Modèles</b> : régression linéaire, Random Forest, SARIMA, SARIMAX</li>
              <li><b>Restitution</b> : React 18, Vite, Tailwind 3, Recharts, lucide-react</li>
              <li><b>Livrables</b> : openpyxl (GOLD .xlsx), python-pptx (rapport)</li>
              <li><b>Déploiement</b> : Cloudflare Pages (statique)</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Méthodologie de modélisation</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3 text-left font-semibold">Choix</th><th className="px-5 py-3 text-left font-semibold">Décision</th><th className="px-5 py-3 text-left font-semibold">Justification</th></tr>
            </thead>
            <tbody>
              {METHODO.map((r, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900 whitespace-nowrap">{r[0]}</td>
                  <td className="px-5 py-3 text-slate-700">{r[1]}</td>
                  <td className="px-5 py-3 text-slate-500">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lignage des données</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 font-mono leading-relaxed bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            01_destinations + 02_signaux + 04_facteurs → harmonisation (casse, clés, USA) → GOLD (pays + destination, 8 dérivées)
            → modélisation (prévision pays) + scoring (destination) → recommandation sous contraintes. Sources 03/05/06 écartées, tracées au journal qualité.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

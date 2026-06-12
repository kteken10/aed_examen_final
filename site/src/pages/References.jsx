import { GitBranch, Download } from 'lucide-react'
import { asset } from '../lib/asset'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, PageHeader, Button } from '../components/ui'

const GITHUB_URL = 'https://github.com/kteken10/aed_examen_final'

const METHODO = [
  ['Type de problème', 'Prévision série temporelle (pays) + scoring (destination)', 'Deux granularités distinctes — ne pas confondre'],
  ['Validation', 'Split temporel + multi-pas + Time Series CV (12 plis) + split 3-way', 'Sélection sur validation, test intact ; pas de fuite'],
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
              <Button variant="secondary" as="a" href={asset("files/01_pipeline_tourisme.ipynb")} download><Download className="w-4 h-4" /> Notebook .ipynb</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pile technique</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm text-slate-700 space-y-2">
              <li><b>Data / ML</b> : Python, pandas, scikit-learn, statsmodels (SARIMAX)</li>
              <li><b>Modèles</b> : régression linéaire, Random Forest, SARIMA, SARIMAX</li>
              <li><b>Restitution</b> : React, Vite, Tailwind 3, Recharts, lucide-react</li>
              <li><b>Livrables</b> : openpyxl (GOLD .xlsx), python-pptx (rapport)</li>
              <li><b>Déploiement</b> : GitHub Pages (CI) — statique</li>
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

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Validation temporelle — Time Series Cross-Validation & split 3-way</CardTitle>
          <CardDescription>Aucun split aléatoire. TSCV à origine glissante (12 plis) + sélection du modèle sur une validation distincte du test.</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="overflow-x-auto border-r border-slate-100">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr><th className="px-5 py-3 text-left font-semibold">Méthode (TSCV 12 plis)</th><th className="px-5 py-3 text-right font-semibold">MAE moyen</th><th className="px-5 py-3 text-right font-semibold">± écart-type</th></tr>
              </thead>
              <tbody>
                {data.tscv.map(r => {
                  const best = r.m.includes('linéaire')
                  return (
                    <tr key={r.m} className={'border-t border-slate-100 ' + (best ? 'bg-accent-50/40' : 'hover:bg-slate-50')}>
                      <td className={'px-5 py-3 ' + (best ? 'font-semibold text-slate-900' : 'text-slate-700')}>{r.m}{best ? ' ✓' : ''}</td>
                      <td className={'px-5 py-3 text-right tabular-nums font-mono ' + (best ? 'text-accent-700 font-bold' : 'text-slate-600')}>{r.mean}</td>
                      <td className="px-5 py-3 text-right tabular-nums font-mono text-slate-500">±{r.std}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Split 3-way (train ≤ 2023-12 / validation 2024-H1 / test 2024-H2)</p>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-2 text-left font-semibold">Méthode</th><th className="py-2 text-right font-semibold">Valid.</th><th className="py-2 text-right font-semibold">Test</th></tr></thead>
              <tbody>
                {data.split3.map(r => {
                  const best = r.m === data.best_val
                  return (
                    <tr key={r.m} className="border-t border-slate-100">
                      <td className={'py-2 ' + (best ? 'font-semibold text-slate-900' : 'text-slate-600')}>{r.m}</td>
                      <td className={'py-2 text-right tabular-nums font-mono ' + (best ? 'text-accent-700 font-bold' : 'text-slate-500')}>{r.val}</td>
                      <td className="py-2 text-right tabular-nums font-mono text-slate-500">{r.test}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-[13px] text-slate-700">
              Modèle choisi <b>sur la validation</b> : {data.best_val}. Confirmé sur le <b>test jamais utilisé</b> pour la sélection → généralise, pas de fuite. SARIMA : MAE moyen instable (forte variance) sur séries courtes.
            </div>
          </div>
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

import { AlertTriangle, ExternalLink, Check } from 'lucide-react'
import { asset } from '../lib/asset'
import { Card, CardContent, CardHeader, CardTitle, PageHeader, Button } from '../components/ui'

const IMAGES = [
  ['img_France_market_v2.png', 'France'], ['img_Italy_market_v2.png', 'Italy'],
  ['img_Japan_market_v2.png', 'Japan'], ['img_Morocco_market_v2.png', 'Morocco'],
  ['img_Portugal_market_v2.png', 'Portugal'], ['img_Spain_market_v2.png', 'Spain'],
]

const READS = [
  ['Demande par période', 'Confirme visuellement la saisonnalité et le momentum (YoY) calculés sur 02_signaux — cohérent avec notre cadrage série temporelle.'],
  ['Positionnement coût / demande', 'Aucune relation nette coût↔demande → conforte le traitement du coût via value_for_money, et non comme moteur de demande.'],
  ['Niveaux d’attractivité (top destinations)', 'Motive le poids de l’attractivité dans le score composite de recommandation.'],
]

export default function Annexes() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analyse visuelle des marchés"
        description="Six synthèses visuelles fournies (4 panneaux par pays). Exploitées en validation croisée de l'analyse chiffrée — et non comme source quantitative."
      />

      <Card>
        <CardHeader><CardTitle>Ce que les images apportent (validation croisée)</CardTitle></CardHeader>
        <CardContent className="space-y-2.5">
          {READS.map(([t, d]) => (
            <div key={t} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex w-5 h-5 rounded-md bg-accent-50 text-accent-700 items-center justify-center flex-shrink-0"><Check className="w-3.5 h-3.5" /></span>
              <p className="text-sm text-slate-700"><b className="text-slate-900">{t}</b> — {d}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-900">
          <b>Limites documentées (pourquoi pas une entrée du modèle).</b> Destinations <b>anonymisées</b> (D1…D10 ≠ City_X), axes non mappables au référentiel,
          <b> 6 pays sur 8</b> (ni Germany ni USA), et non extractibles au pixel sans inventer des données. → <b>support qualitatif</b>, jamais une source quantitative.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {IMAGES.map(([f, c]) => (
          <Card key={f} className="overflow-hidden">
            <img src={asset(`img/${f}`)} alt={`Synthèse marché ${c}`} loading="lazy" className="w-full block" />
            <div className="px-5 py-3 border-t border-slate-100 text-xs font-mono text-slate-500">{c} — synthèse visuelle de marché</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Dashboard HTML autonome (version « double-clic »)</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-slate-500 flex-1">Version statique d'origine, ouvrable sans serveur. La présente plateforme React en est l'évolution.</p>
          <Button variant="outline" as="a" href={asset("files/04_Dashboard_demande_tourisme.html")} target="_blank" rel="noreferrer">Ouvrir le HTML <ExternalLink className="w-4 h-4" /></Button>
        </CardContent>
      </Card>
    </div>
  )
}

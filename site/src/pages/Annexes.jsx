import { AlertTriangle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, PageHeader, Button } from '../components/ui'

const IMAGES = [
  ['img_France_market_v2.png', 'France'], ['img_Italy_market_v2.png', 'Italy'],
  ['img_Japan_market_v2.png', 'Japan'], ['img_Morocco_market_v2.png', 'Morocco'],
  ['img_Portugal_market_v2.png', 'Portugal'], ['img_Spain_market_v2.png', 'Spain'],
]

export default function Annexes() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Annexes & visualisations"
        description="Synthèses visuelles de marché fournies avec le sujet, exploitées de façon critique, et accès au dashboard HTML autonome."
      />

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-900">
          <b>Limites de provenance.</b> Ces synthèses ne couvrent que <b>6 pays sur 8</b> (ni Germany ni USA), sur une fenêtre partielle, suffixe « v2 » non documenté.
          Elles sont <b>illustratives</b> — jamais une preuve quantitative ni une source de jointure. Aucune décision ne repose dessus seule.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {IMAGES.map(([f, c]) => (
          <Card key={f} className="overflow-hidden">
            <img src={`/img/${f}`} alt={`Synthèse marché ${c}`} loading="lazy" className="w-full block" />
            <div className="px-5 py-3 border-t border-slate-100 text-xs font-mono text-slate-500">{c} — synthèse visuelle de marché (illustratif)</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Dashboard HTML autonome (version « double-clic »)</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-slate-500 flex-1">Version statique d'origine, ouvrable sans serveur. La présente plateforme React en est l'évolution.</p>
          <Button variant="outline" as="a" href="/files/04_Dashboard_demande_tourisme.html" target="_blank" rel="noreferrer">Ouvrir le HTML <ExternalLink className="w-4 h-4" /></Button>
        </CardContent>
      </Card>
    </div>
  )
}

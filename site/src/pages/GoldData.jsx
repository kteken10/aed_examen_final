import { useState } from 'react'
import { asset } from '../lib/asset'
import { Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, PageHeader, Button, Badge } from '../components/ui'

const fmt = n => n.toLocaleString('fr-FR')

export default function GoldData({ data }) {
  const [country, setCountry] = useState(data.gold_country[0].country)
  const dest = data.dest[country]
  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Gold — base analytique fiabilisée"
        description={`Deux grains : pays (demande annuelle, momentum, prévision) et pays × destination (${data.stats.n_destinations} lignes, 8 variables dérivées dont le score ajusté météo).`}
        actions={<Button variant="accent" as="a" href={asset("files/GOLD_DATA_tourisme.xlsx")} download><Download className="w-4 h-4" /> GOLD .xlsx</Button>}
      />
      <Badge tone="neutral">5 feuilles : README · Quality_Log · Gold_Country · Gold_Destination · Data_Dictionary</Badge>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Grain pays — demande, momentum & prévision</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Pays</th>
                <th className="px-5 py-3 text-right font-semibold">2022</th>
                <th className="px-5 py-3 text-right font-semibold">2023</th>
                <th className="px-5 py-3 text-right font-semibold">2024</th>
                <th className="px-5 py-3 text-right font-semibold">YoY %</th>
                <th className="px-5 py-3 text-right font-semibold">Prév. S1-25</th>
                <th className="px-5 py-3 text-left font-semibold">Signal</th>
              </tr>
            </thead>
            <tbody>
              {data.gold_country.map(r => (
                <tr key={r.country} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{r.country}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{r.demand_2022}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{r.demand_2023}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{r.demand_2024}</td>
                  <td className={'px-5 py-3 text-right tabular-nums font-mono ' + (r.yoy > 0 ? 'text-accent-700 font-bold' : 'text-rose-600')}>{r.yoy > 0 ? '+' : ''}{r.yoy}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.forecast}</td>
                  <td className="px-5 py-3"><Badge tone={r.yoy > 0 ? 'accent' : 'danger'}>{r.signal}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between flex">
          <CardTitle>Grain pays × destination</CardTitle>
          <select value={country} onChange={e => setCountry(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20">
            {data.countries.map(c => <option key={c}>{c}</option>)}
          </select>
        </CardHeader>
        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 sticky top-0">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Destination</th>
                <th className="px-5 py-3 text-right font-semibold">Attract.</th>
                <th className="px-5 py-3 text-right font-semibold">Coût €</th>
                <th className="px-5 py-3 text-right font-semibold">Note</th>
                <th className="px-5 py-3 text-right font-semibold">Visiteurs</th>
                <th className="px-5 py-3 text-right font-semibold">Val/€</th>
                <th className="px-5 py-3 text-right font-semibold">Score brut</th>
                <th className="px-5 py-3 text-right font-semibold">Pén. météo</th>
                <th className="px-5 py-3 text-right font-semibold">Score ajusté</th>
                <th className="px-5 py-3 text-left font-semibold">Vol</th>
                <th className="px-5 py-3 text-left font-semibold">Météo</th>
              </tr>
            </thead>
            <tbody>
              {dest.map((r, i) => (
                <tr key={r.dest} className={'border-t border-slate-100 ' + (i < 5 ? 'bg-accent-50/30' : 'hover:bg-slate-50')}>
                  <td className="px-5 py-3 font-medium text-slate-900">{r.dest}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.attr}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{fmt(r.cost)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.rating}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{fmt(r.vis)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{r.vfm}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-500">{r.score_raw}</td>
                  <td className={'px-5 py-3 text-right tabular-nums ' + (r.wpen < 0 ? 'text-rose-600' : 'text-slate-400')}>{r.wpen}</td>
                  <td className={'px-5 py-3 text-right tabular-nums font-mono ' + (i < 5 ? 'text-accent-700 font-bold' : 'text-slate-600')}>{r.score}</td>
                  <td className="px-5 py-3 text-slate-600">{r.fp}</td>
                  <td className={'px-5 py-3 ' + (r.we === 'bad' ? 'text-rose-600 font-medium' : 'text-slate-600')}>{r.we}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

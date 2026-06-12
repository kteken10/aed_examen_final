import { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Target, Gauge, ArrowUpRight, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, PageHeader, MiniStat } from '../components/ui'

const fmt = n => n.toLocaleString('fr-FR')
const AX = { fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#64748b' }

export default function Dashboard({ data }) {
  const ordered = Object.entries(data.country_kpi).sort((a, b) => b[1].yoy - a[1].yoy)
  const [fcC, setFcC] = useState(ordered[0][0])
  const [recoC, setRecoC] = useState(ordered[0][0])
  const top = ordered[0]
  const maxAbs = Math.max(...ordered.map(([, k]) => Math.abs(k.yoy)))
  const nUp = ordered.filter(([, k]) => k.yoy > 0).length

  const fcData = [
    ...data.months.map((m, i) => ({ m, hist: data.series[fcC][i], fc: null })),
  ]
  const last = data.series[fcC].length - 1
  fcData[last].fc = data.series[fcC][last]
  data.fc_months.forEach((m, i) => fcData.push({ m, hist: null, fc: data.forecasts[fcC][i] }))

  const reco = data.dest[recoC]
  const k = data.country_kpi[recoC]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard de décision"
        description="De la dynamique des marchés à la sélection des destinations à promouvoir. Entonnoir : marché porteur → fiabilité → prévision → destinations concrètes."
      />

      {/* Hero + lecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-slate-900 border-slate-900 text-white overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-accent-500/20 blur-2xl" />
          <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-accent-500/10 blur-xl" />
          <CardContent className="py-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">Marché le plus porteur · momentum YoY</div>
                <div className="text-5xl font-bold mt-1 tabular-nums">{top[0]}</div>
                <div className="text-sm text-white/70 mt-1">croissance demande {top[1].yoy > 0 ? '+' : ''}{top[1].yoy}% · prév. S1-25 {top[1].fc}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 text-slate-900 px-3 py-1.5 text-xs font-semibold shadow-sm shadow-accent-500/40">
                {nUp}/{ordered.length} marchés en hausse <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-[11px] text-white/60 mb-1.5">
                <span>Part des marchés porteurs</span><span className="font-medium text-white/90 tabular-nums">{Math.round(nUp / ordered.length * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full" style={{ width: `${nUp / ordered.length * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Lecture executive</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Les niveaux d'indice ne sont <b className="text-slate-900">pas comparables entre pays</b>. Seule la <b className="text-slate-900">dynamique intra-pays (YoY)</b> sert à prioriser.</p>
            <p className="text-slate-500">Marchés porteurs : Spain, Germany, Italy.</p>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-[13px]">
              Aucune cible de reco fournie : la sélection est un <b>arbitrage humain</b> sous contraintes (météo, coût, max 5/pays), pas une prédiction.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MiniStats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat icon={TrendingUp} label="Marchés en hausse" value={`${nUp}/${ordered.length}`} accent />
        <MiniStat icon={Target} label="Destinations notées" value={data.stats.n_destinations} />
        <MiniStat icon={Gauge} label="Meilleur MAE (prévision)" value={data.stats.best_mae} sub={data.stats.best_model} />
        <MiniStat icon={Database} label="Sources auditées" value={`${data.stats.n_sources} · ${data.stats.n_quality} anomalies`} />
      </div>

      {/* Momentum + forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Momentum — YoY 2024/2023</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {ordered.map(([c, kp], i) => (
                <li key={c} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-mono">{c}</span>
                    <span className={kp.yoy > 0 ? 'text-accent-700 font-medium tabular-nums' : 'text-rose-600 tabular-nums'}>{kp.yoy > 0 ? '+' : ''}{kp.yoy}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={kp.yoy > 0 ? 'h-full bg-accent-500 rounded-full' : 'h-full bg-rose-400 rounded-full'} style={{ width: `${Math.abs(kp.yoy) / maxAbs * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between flex">
            <div><CardTitle>Indice de demande — historique + prévision S1-2025</CardTitle></div>
            <select value={fcC} onChange={e => setFcC(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20">
              {data.countries.map(c => <option key={c}>{c}</option>)}
            </select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={fcData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#EEEDE6" vertical={false} />
                <XAxis dataKey="m" tick={AX} interval={5} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={AX} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Line type="monotone" dataKey="hist" name="Historique" stroke="#0f172a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fc" name="Prévision" stroke="#65a30d" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Models */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader><CardTitle>Deux familles comparées — prévision multi-pas (juil.–déc. 2024)</CardTitle>
            <CardDescription>SARIMAX bat SARIMA, mais la régression globale (mutualise 8 séries courtes) bat la famille statistique univariate.</CardDescription>
          </CardHeader>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Méthode</th>
                <th className="px-5 py-3 text-left font-semibold">Famille</th>
                <th className="px-5 py-3 text-right font-semibold">MAE</th>
                <th className="px-5 py-3 text-right font-semibold">RMSE</th>
                <th className="px-5 py-3 text-right font-semibold">MAPE</th>
                <th className="px-5 py-3 text-right font-semibold">R²</th>
              </tr>
            </thead>
            <tbody>
              {data.metrics.map(m => {
                const best = m.m.includes('linéaire')
                return (
                  <tr key={m.m} className={'border-t border-slate-100 ' + (best ? 'bg-accent-50/40' : 'hover:bg-slate-50')}>
                    <td className={'px-5 py-3 ' + (best ? 'font-semibold text-slate-900' : 'text-slate-700')}>{m.m}{best ? ' ✓' : ''}</td>
                    <td className="px-5 py-3"><Badge tone={m.family === 'ML' ? 'accent' : m.family === 'Statistique' ? 'neutral' : 'neutral'}>{m.family}</Badge></td>
                    <td className={'px-5 py-3 text-right tabular-nums font-mono ' + (best ? 'text-accent-700 font-bold' : 'text-slate-600')}>{m.mae}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-mono text-slate-600">{m.rmse}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-mono text-slate-600">{m.mape}%</td>
                    <td className="px-5 py-3 text-right tabular-nums font-mono text-slate-600">{m.r2}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader><CardTitle>MAE par méthode</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.metrics.map(m => ({ name: m.m.replace(/ \(.*\)/, ''), mae: m.mae, best: m.m.includes('linéaire') }))} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#EEEDE6" vertical={false} />
                <XAxis dataKey="name" tick={{ ...AX, fontSize: 9 }} interval={0} angle={-30} textAnchor="end" height={70} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={AX} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Bar dataKey="mae" radius={[4, 4, 0, 0]}>
                  {data.metrics.map((m, i) => <Cell key={i} fill={m.m.includes('linéaire') ? '#84cc16' : '#94a3b8'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reco */}
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between flex">
          <div>
            <CardTitle>Destinations candidates — score ajusté météo</CardTitle>
            <CardDescription>{recoC} · <Badge tone={k.yoy > 0 ? 'accent' : 'danger'}>{k.yoy > 0 ? 'marché prioritaire' : 'à surveiller'}</Badge> · YoY {k.yoy > 0 ? '+' : ''}{k.yoy}% · top 5 surligné</CardDescription>
          </div>
          <select value={recoC} onChange={e => setRecoC(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20">
            {ordered.map(([c]) => <option key={c}>{c}</option>)}
          </select>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">#</th>
                <th className="px-5 py-3 text-left font-semibold">Destination</th>
                <th className="px-5 py-3 text-right font-semibold">Attract.</th>
                <th className="px-5 py-3 text-right font-semibold">Coût €</th>
                <th className="px-5 py-3 text-right font-semibold">Note</th>
                <th className="px-5 py-3 text-right font-semibold">Visiteurs</th>
                <th className="px-5 py-3 text-right font-semibold">Score brut</th>
                <th className="px-5 py-3 text-right font-semibold">Score ajusté</th>
                <th className="px-5 py-3 text-left font-semibold">Vol</th>
                <th className="px-5 py-3 text-left font-semibold">Météo</th>
              </tr>
            </thead>
            <tbody>
              {reco.map((r, i) => (
                <tr key={r.dest} className={'border-t border-slate-100 ' + (i < 5 ? 'bg-accent-50/30' : 'hover:bg-slate-50')}>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{r.dest}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.attr}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{fmt(r.cost)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.rating}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">{fmt(r.vis)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-500">{r.score_raw}</td>
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

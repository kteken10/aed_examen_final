import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertOctagon, AlertTriangle, ShieldCheck, ListChecks } from 'lucide-react'
import { Card, CardHeader, CardTitle, PageHeader, MiniStat } from '../components/ui'

const SEV = {
  CRITIQUE: { fill: '#e11d48', cls: 'bg-rose-600' },
  ELEVEE: { fill: '#f59e0b', cls: 'bg-amber-500' },
  'ÉLEVÉE': { fill: '#f59e0b', cls: 'bg-amber-500' },
  MOYENNE: { fill: '#94a3b8', cls: 'bg-slate-400' },
  FAIBLE: { fill: '#cbd5e1', cls: 'bg-slate-300' },
}

export default function QualityLog({ data }) {
  const rows = data.quality
  const cols = Object.keys(rows[0])
  const sevKey = cols.find(c => c.toLowerCase().startsWith('sever'))
  const counts = rows.reduce((a, r) => { a[r[sevKey]] = (a[r[sevKey]] || 0) + 1; return a }, {})
  const donut = Object.entries(counts).map(([k, v]) => ({ name: k, value: v, fill: (SEV[k] || SEV.MOYENNE).fill }))
  const crit = counts['CRITIQUE'] || 0
  const high = (counts['ÉLEVÉE'] || 0) + (counts['ELEVEE'] || 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal de qualité des données"
        description={`${rows.length} anomalies recensées sur ${data.stats.n_sources} sources hétérogènes. Principe : on ne suppose jamais qu'une donnée est correcte, et on refuse plutôt que d'imputer une source non fiable.`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat icon={AlertOctagon} label="Anomalies critiques" value={crit} />
        <MiniStat icon={AlertTriangle} label="Sévérité élevée" value={high} />
        <MiniStat icon={ShieldCheck} label="Sources écartées" value={3} accent />
        <MiniStat icon={ListChecks} label="Anomalies tracées" value={rows.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Répartition par sévérité</CardTitle></CardHeader>
          <div className="px-5 py-4 flex items-center gap-4">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={30} outerRadius={52} paddingAngle={2}>
                  {donut.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex-1 space-y-1.5">
              {donut.map(d => (
                <li key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-slate-500 flex-1">{d.name}</span>
                  <span className="font-medium text-slate-900 tabular-nums">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader><CardTitle>Anomalies & décisions de traitement</CardTitle></CardHeader>
          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 sticky top-0">
                <tr>{cols.map(c => <th key={c} className="px-5 py-3 text-left font-semibold whitespace-nowrap">{c}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 align-top">
                    {cols.map(c => c === sevKey ? (
                      <td key={c} className="px-5 py-3">
                        <span className={'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold text-white ' + (SEV[r[c]] || SEV.MOYENNE).cls}>{r[c]}</span>
                      </td>
                    ) : (
                      <td key={c} className={c === cols[1] ? 'px-5 py-3 font-mono text-xs text-slate-700 whitespace-nowrap' : 'px-5 py-3 text-slate-600'}>{String(r[c])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

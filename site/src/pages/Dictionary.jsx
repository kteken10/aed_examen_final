import { Download } from 'lucide-react'
import { asset } from '../lib/asset'
import { Card, PageHeader, Button, Badge } from '../components/ui'

export default function Dictionary({ data }) {
  const rows = data.dictionary
  const cols = Object.keys(rows[0])
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dictionnaire de données"
        description={`${rows.length} variables documentées — définition métier, type, unité, source, règle qualité, data owner et points de vigilance. Grain : (pays, destination) et (pays, mois).`}
        actions={<Button variant="accent" as="a" href={asset("files/03_Dictionnaire_de_donnees.xlsx")} download><Download className="w-4 h-4" /> Dictionnaire .xlsx</Button>}
      />
      <div className="flex items-center gap-2">
        <Badge tone="accent">{rows.length} variables</Badge>
        <span className="text-xs text-slate-500">aligné sur la GOLD DATA</span>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto max-h-[640px]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 sticky top-0">
              <tr>{cols.map(c => <th key={c} className="px-5 py-3 text-left font-semibold whitespace-nowrap">{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 align-top">
                  {cols.map(c => (
                    <td key={c} className={c === cols[0] ? 'px-5 py-3 font-mono text-xs text-slate-700 font-semibold whitespace-nowrap' : 'px-5 py-3 text-slate-600'}>{String(r[c])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

import { cn } from '../../lib/cn'

export function MiniStat({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className={cn('p-2 rounded-lg', accent ? 'bg-accent-50 text-accent-700' : 'bg-slate-100 text-slate-700')}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider leading-tight">{label}</div>
        <div className="text-xl font-bold text-slate-900 leading-tight mt-0.5 tabular-nums">{value}</div>
        {sub && <div className="text-[11px] text-slate-400 leading-tight">{sub}</div>}
      </div>
    </div>
  )
}

import { cn } from '../../lib/cn'

const COLORS = {
  pos: 'bg-accent-500', neg: 'bg-rose-500', neutral: 'bg-slate-400',
  crit: 'bg-rose-600', high: 'bg-amber-500', med: 'bg-amber-400', low: 'bg-emerald-500',
}

export function StatusDot({ status = 'neutral', label, className }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', COLORS[status] || COLORS.neutral)} />
      {label && <span className="text-xs text-slate-600">{label}</span>}
    </span>
  )
}

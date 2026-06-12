import { useState } from 'react'
import { Menu, X, Compass } from 'lucide-react'
import { cn } from '../lib/cn'

function SidebarLink({ item, active, onSelect }) {
  const Icon = item.icon
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={cn(
        'group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-accent-500 text-slate-900 shadow-sm shadow-accent-500/30'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{item.label}</span>
    </button>
  )
}

function SidebarContent({ sections, active, onSelect, stats }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Compass className="w-4.5 h-4.5 text-accent-400" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-slate-900">Tourisme<span className="text-accent-600"> Core</span></div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Plateforme de décision</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map(sec => (
          <div key={sec.label}>
            <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{sec.label}</p>
            <div className="space-y-0.5">
              {sec.items.map(it => <SidebarLink key={it.id} item={it} active={active === it.id} onSelect={onSelect} />)}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-4 py-4">
        <div className="text-[11px] text-slate-400 uppercase tracking-wider">Périmètre</div>
        <div className="text-xs text-slate-600 mt-1 font-mono tabular-nums">
          {stats.n_countries} marchés · {stats.n_destinations} destinations
        </div>
        <div className="text-xs text-slate-500 mt-0.5">Modèle : {stats.best_model} (MAE {stats.best_mae})</div>
      </div>
    </>
  )
}

export function DashboardLayout({ sections, active, onSelect, stats, children }) {
  const [open, setOpen] = useState(false)
  const activeLabel = sections.flatMap(s => s.items).find(i => i.id === active)?.label
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200">
        <SidebarContent sections={sections} active={active} onSelect={onSelect} stats={stats} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col">
            <button className="absolute right-3 top-4 text-slate-400 hover:text-slate-700" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
            <SidebarContent sections={sections} active={active} onSelect={(id) => { onSelect(id); setOpen(false) }} stats={stats} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button onClick={() => setOpen(true)} className="text-slate-700"><Menu className="w-5 h-5" /></button>
          <span className="font-semibold text-slate-900">{activeLabel}</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}

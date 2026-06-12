import { cn } from '../../lib/cn'

const variants = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400',
  accent: 'bg-accent-500 text-slate-900 hover:bg-accent-400 disabled:bg-accent-200',
  secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 hover:border-slate-400',
  outline: 'bg-transparent border border-slate-300 text-slate-700 hover:border-accent-500 hover:text-accent-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-accent-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300',
}
const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-11 px-5 text-base', icon: 'h-9 w-9' }

export function Button({ variant = 'primary', size = 'md', className, as, ...props }) {
  const Comp = as || 'button'
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed',
        variants[variant], sizes[size], className,
      )}
      {...props}
    />
  )
}

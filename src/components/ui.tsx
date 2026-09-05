import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Card({ children, className = '', as: As = 'div' }: { children: ReactNode; className?: string; as?: any }) {
  return <As className={`card p-5 ${className}`}>{children}</As>;
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-ink">{children}</h2>
      {sub && <p className="mt-0.5 text-sm text-ink-faint">{sub}</p>}
    </div>
  );
}

export function ProgressBar({ pct, className = '', tone = 'brand' }: { pct: number; className?: string; tone?: 'brand' | 'ok' | 'accent' }) {
  const bar = tone === 'ok' ? 'bg-ok' : tone === 'accent' ? 'bg-accent' : 'bg-brand';
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-bg-soft ${className}`}>
      <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'ok' | 'warn' | 'bad' | 'accent' | 'brand' }) {
  const map: Record<string, string> = {
    default: 'border-line bg-bg-soft text-ink-soft',
    ok: 'border-ok/30 bg-ok/10 text-ok',
    warn: 'border-warn/30 bg-warn/10 text-warn',
    bad: 'border-bad/30 bg-bad/10 text-bad',
    accent: 'border-accent/30 bg-accent/10 text-accent',
    brand: 'border-brand/30 bg-brand/10 text-brand-soft',
  };
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}>{children}</span>;
}

export function Callout({ kind = 'note', title, children }: { kind?: 'note' | 'warn' | 'tip' | 'danger'; title?: string; children: ReactNode }) {
  const map = {
    note: { b: 'border-accent/40', bg: 'bg-accent/5', label: title ?? 'Note', c: 'text-accent' },
    tip: { b: 'border-ok/40', bg: 'bg-ok/5', label: title ?? 'Tip', c: 'text-ok' },
    warn: { b: 'border-warn/40', bg: 'bg-warn/5', label: title ?? 'Watch out', c: 'text-warn' },
    danger: { b: 'border-bad/40', bg: 'bg-bad/5', label: title ?? 'Danger', c: 'text-bad' },
  }[kind];
  return (
    <div className={`my-4 rounded-lg border ${map.b} ${map.bg} p-4 text-sm text-ink-soft`}>
      <div className={`mb-1 text-xs font-semibold uppercase tracking-wide ${map.c}`}>{map.label}</div>
      {children}
    </div>
  );
}

export function EmptyState({ icon = '·', title, hint, action }: { icon?: string; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 text-3xl opacity-60">{icon}</div>
      <div className="text-sm font-medium text-ink">{title}</div>
      {hint && <div className="mt-1 max-w-sm text-sm text-ink-faint">{hint}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-faint">{sub}</div>}
    </div>
  );
}

export function LinkButton({ to, children, primary = false }: { to: string; children: ReactNode; primary?: boolean }) {
  return (
    <Link to={to} className={primary ? 'btn-primary' : 'btn-ghost'}>
      {children}
    </Link>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

export function OfficialLink({ href, children, official }: { href: string; children: ReactNode; official?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
      {official && <span className="chip !border-ok/30 !text-ok">OFFICIAL</span>}
      {children}
      <span className="opacity-50 transition-opacity group-hover:opacity-100">↗</span>
    </a>
  );
}

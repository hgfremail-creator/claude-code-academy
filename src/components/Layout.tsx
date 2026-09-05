import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { levelProgress } from '../lib/xp';
import { RANKS } from '../content/levels';
import SearchModal from './SearchModal';

const NAV: { to: string; label: string; icon: string }[] = [
  { to: '/', label: 'Dashboard', icon: '◉' },
  { to: '/learn', label: 'Learn', icon: '▤' },
  { to: '/practice', label: 'Practice', icon: '◈' },
  { to: '/projects', label: 'Projects', icon: '⬡' },
  { to: '/simulator', label: 'Simulator', icon: '▸_' },
  { to: '/prompt-lab', label: 'Prompt Lab', icon: '⚗' },
  { to: '/challenges', label: 'Challenges', icon: '⚑' },
  { to: '/reference', label: 'Reference', icon: '❯' },
  { to: '/troubleshooting', label: 'Troubleshooting', icon: '⚙' },
  { to: '/progress', label: 'Progress', icon: '▚' },
];

const SECONDARY: { to: string; label: string }[] = [
  { to: '/glossary', label: 'Glossary' },
  { to: '/map', label: 'Knowledge map' },
  { to: '/docs', label: 'Latest docs' },
  { to: '/certification', label: 'Certification' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { state } = useProgress();
  const lp = levelProgress(state.xp);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => setMobileOpen(false), [loc.pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-full">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 border-r border-line bg-bg-soft transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2.5 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-dim font-mono text-brand">❯_</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-ink">Claude Code</div>
              <div className="text-xs text-ink-faint">Academy</div>
            </div>
          </div>

          <div className="mx-3 mb-3 rounded-lg border border-line bg-bg-card p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-ink-faint">Level {lp.level}</span>
              <span className="text-xs text-ink-faint">{state.xp} XP</span>
            </div>
            <div className="mt-0.5 text-sm font-medium text-ink">{RANKS[lp.level]}</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-soft">
              <div className="h-full rounded-full bg-brand" style={{ width: `${lp.pct}%` }} />
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <span className="w-5 text-center font-mono text-xs text-ink-faint">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
            <div className="my-2 border-t border-line" />
            {SECONDARY.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                <span className="w-5" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => setSearchOpen(true)}
            className="mx-3 mb-4 flex items-center gap-2 rounded-lg border border-line bg-bg-card px-3 py-2 text-xs text-ink-faint hover:bg-bg-hover"
          >
            <span>⌕</span> Search <span className="ml-auto"><kbd className="kbd">/</kbd></span>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur lg:px-8">
          <button className="btn-ghost btn-sm lg:hidden" onClick={() => setMobileOpen(true)} aria-label="menu">☰</button>
          <div className="flex items-center gap-1.5 text-xs text-ink-faint">
            <span className="flex items-center gap-1 rounded-md border border-line bg-bg-soft px-2 py-1">
              🔥 <span className="font-medium text-ink">{state.streak.current}</span> day streak
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="btn-ghost btn-sm">
              ⌕ <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>

        <footer className="border-t border-line px-4 py-4 text-center text-xs text-ink-faint lg:px-8">
          Claude Code Academy · an interactive course. Content is an <span className="text-ink-soft">Academy explanation</span> — always
          verify specifics against the{' '}
          <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noreferrer" className="link">
            official Claude Code documentation
          </a>
          .
        </footer>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

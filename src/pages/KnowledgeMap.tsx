import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRAPH_NODES, GRAPH_EDGES, GRAPH_GROUPS } from '../content/knowledgeGraph';
import { LESSON_BY_ID } from '../content/lessons';

const W = 920;
const ROW_H = 132;
const groupOrder = ['core', 'skill', 'config', 'agentic', 'safety'];

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const [hover, setHover] = useState<string | null>(null);

  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    groupOrder.forEach((g, gi) => {
      const nodes = GRAPH_NODES.filter((n) => n.group === g);
      const gap = W / (nodes.length + 1);
      nodes.forEach((n, i) => {
        pos[n.id] = { x: gap * (i + 1), y: gi * ROW_H + 70 };
      });
    });
    return pos;
  }, []);

  const H = groupOrder.length * ROW_H + 40;
  const connected = new Set<string>();
  if (hover) {
    GRAPH_EDGES.forEach((e) => {
      if (e.from === hover) connected.add(e.to);
      if (e.to === hover) connected.add(e.from);
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Knowledge Map</h1>
        <p className="mt-1 text-sm text-ink-faint">How the concepts relate. Click a node to open its lesson; hover to highlight connections.</p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        {groupOrder.map((g) => (
          <span key={g} className="flex items-center gap-1.5 text-ink-soft">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: GRAPH_GROUPS[g].color }} />
            {GRAPH_GROUPS[g].label}
          </span>
        ))}
      </div>

      <div className="card overflow-x-auto p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[820px]" style={{ height: H }}>
          {GRAPH_EDGES.map((e, i) => {
            const a = positions[e.from];
            const b = positions[e.to];
            if (!a || !b) return null;
            const active = hover && (e.from === hover || e.to === hover);
            return (
              <line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={active ? '#d97757' : '#232a34'}
                strokeWidth={active ? 1.8 : 1}
                opacity={hover && !active ? 0.25 : 0.9}
              />
            );
          })}
          {GRAPH_NODES.map((n) => {
            const p = positions[n.id];
            if (!p) return null;
            const g = GRAPH_GROUPS[n.group];
            const dim = hover && hover !== n.id && !connected.has(n.id);
            const hasLesson = !!(n.lesson && LESSON_BY_ID[n.lesson]);
            return (
              <g
                key={n.id}
                transform={`translate(${p.x},${p.y})`}
                opacity={dim ? 0.3 : 1}
                style={{ cursor: hasLesson ? 'pointer' : 'default' }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => hasLesson && navigate(`/learn/${n.lesson}`)}
              >
                <circle r={hover === n.id ? 8 : 6} fill={g.color} />
                <text
                  y={-12}
                  textAnchor="middle"
                  className="fill-ink-soft"
                  style={{ fontSize: 11, fontWeight: hover === n.id ? 700 : 500 }}
                >
                  {n.label}
                </text>
                {hasLesson && <text y={20} textAnchor="middle" style={{ fontSize: 8 }} className="fill-ink-faint">open lesson</text>}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="card p-4 font-mono text-xs text-ink-soft">
        <div className="mb-2 text-[11px] uppercase text-ink-faint">Outline</div>
        <div>Claude Code</div>
        {['Sessions', 'Context', 'Tools', 'Commands', 'CLAUDE.md', 'Subagents', 'MCP', 'Hooks', 'Skills', 'Git', 'Testing', 'Security', 'Automation', 'Autonomy'].map((x) => (
          <div key={x}>├── {x}</div>
        ))}
      </div>
    </div>
  );
}

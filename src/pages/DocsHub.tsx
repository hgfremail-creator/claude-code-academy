import { DOC_LINKS, DOC_SECTIONS } from '../content/docLinks';
import { Callout, OfficialLink } from '../components/ui';

export default function DocsHub() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Latest Documentation</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Curated links into the official Claude Code docs, each with an Academy note on where it fits.
        </p>
      </div>

      <Callout kind="note" title="Official documentation vs Academy explanation">
        Everything under <strong>OFFICIAL</strong> is Anthropic's documentation — the source of truth. The Academy's lessons
        <em> teach and summarize</em>; they never reproduce docs verbatim, and they can lag a release. When they disagree, the docs
        win — and please tell us.
      </Callout>

      {DOC_SECTIONS.map((section) => (
        <div key={section} className="card p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{section}</div>
          <ul className="space-y-2.5">
            {DOC_LINKS.filter((d) => d.section === section).map((d) => (
              <li key={d.url}>
                <OfficialLink href={d.url} official>{d.title}</OfficialLink>
                <p className="mt-0.5 text-xs text-ink-faint">{d.academyNote}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="card p-4 text-sm text-ink-soft">
        <div className="mb-1 text-xs font-semibold uppercase text-ink-faint">Keeping content current</div>
        The curriculum is data — <code>src/content/*</code>. Commands, examples, and links live in structured modules, not in
        components, so updating for a new Claude Code version is an edit to data files, not a rewrite. Lessons that depend on
        version-specific behavior are tagged <span className="chip !border-warn/30 !text-warn">version-sensitive</span>.
      </div>
    </div>
  );
}

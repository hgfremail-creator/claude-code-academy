import { useEffect, useState } from 'react';
import { useProgress } from '../store/progress';
import { earnedBadges } from '../engine/badges';

export default function BadgeWatcher() {
  const { state, dispatch } = useProgress();
  const [toast, setToast] = useState<{ label: string; icon: string }[]>([]);

  useEffect(() => {
    const earned = earnedBadges(state);
    const fresh = earned.filter((b) => !state.seenBadges.includes(b.id));
    if (fresh.length) {
      setToast(fresh.map((b) => ({ label: b.label, icon: b.icon })));
      dispatch({ type: 'badges/markSeen', ids: fresh.map((b) => b.id) });
      const t = setTimeout(() => setToast([]), 6000);
      return () => clearTimeout(t);
    }
  }, [state, dispatch]);

  if (!toast.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2">
      {toast.map((b, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-brand/40 bg-bg-card px-4 py-3 shadow-xl">
          <span className="text-2xl">{b.icon}</span>
          <div>
            <div className="text-xs uppercase tracking-wide text-brand-soft">Badge earned</div>
            <div className="text-sm font-semibold text-ink">{b.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

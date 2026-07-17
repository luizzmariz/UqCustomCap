import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Mobile controls container: a collapsible sheet anchored to the bottom of the
 * screen so the cap stays visible while the user adjusts it.
 */
export function BottomSheet({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 rounded-t-2xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]',
        'transition-[max-height] duration-300 ease-out',
        expanded ? 'max-h-[68vh]' : 'max-h-[52px]',
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full flex-col items-center gap-1 py-3"
        aria-label={expanded ? 'Recolher' : 'Expandir'}
        aria-expanded={expanded}
      >
        <span className="h-1.5 w-10 rounded-full bg-slate-300" />
      </button>
      <div className="max-h-[calc(68vh-52px)] overflow-y-auto px-4 pb-8">{children}</div>
    </div>
  );
}

import {DAYS_OF_WEEK, TIMES_OF_DAY} from '@/data/mockData';
import type {TimeSlot} from '@/types/models';

interface WeekScheduleGridProps {
  title: string;
  selectedSlots: TimeSlot[];
  onToggle: (slot: TimeSlot) => void;
  tone: 'primary' | 'secondary';
}

export default function WeekScheduleGrid({title, selectedSlots, onToggle, tone}: WeekScheduleGridProps) {
  const accentColor = tone === 'primary' ? 'primary' : 'secondary';

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-on-surface">{title}</p>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr>
              <th className="w-16 border-b border-r border-outline-variant/15 bg-surface-container-low/60 px-2 py-2.5 text-center text-[11px] font-black uppercase tracking-wider text-on-surface-variant" />
              {DAYS_OF_WEEK.map(({key, label}) => (
                <th
                  key={key}
                  className="border-b border-r border-outline-variant/15 bg-surface-container-low/60 px-1 py-2.5 text-center text-[11px] font-black uppercase tracking-wider text-on-surface-variant last:border-r-0"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES_OF_DAY.map(({key: time, label: timeLabel}, rowIndex) => (
              <tr key={time} className={rowIndex < TIMES_OF_DAY.length - 1 ? 'border-b border-outline-variant/15' : ''}>
                <td className="border-r border-outline-variant/15 bg-surface-container-low/30 px-2 py-2 text-center text-[11px] font-bold text-on-surface-variant">
                  {timeLabel}
                </td>
                {DAYS_OF_WEEK.map(({key: day, label: dayLabel}) => {
                  const slot = `${time} ${day}` as TimeSlot;
                  const selected = selectedSlots.includes(slot);

                  return (
                    <td key={day} className="border-r border-outline-variant/15 p-1 last:border-r-0">
                      <button
                        type="button"
                        aria-label={`${timeLabel} ${dayLabel}`}
                        aria-pressed={selected}
                        onClick={() => onToggle(slot)}
                        className={`flex h-9 w-full items-center justify-center rounded-xl transition-all ${
                          selected
                            ? accentColor === 'primary'
                              ? 'bg-primary/15 ring-1 ring-primary/40'
                              : 'bg-secondary/15 ring-1 ring-secondary/40'
                            : 'bg-transparent hover:bg-surface-container-high/60'
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                            selected
                              ? accentColor === 'primary'
                                ? 'border-primary bg-primary'
                                : 'border-secondary bg-secondary'
                              : 'border-outline-variant/40 bg-surface'
                          }`}
                        >
                          {selected && (
                            <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 4l3 3 5-6" />
                            </svg>
                          )}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

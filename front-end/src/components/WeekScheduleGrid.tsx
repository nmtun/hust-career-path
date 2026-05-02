import {DAYS_OF_WEEK, TIMES_OF_DAY} from '@/data/mockData';
import type {DayOfWeek, TimeOfDay, TimeSlot} from '@/types/models';

interface WeekScheduleGridProps {
  title: string;
  selectedSlots: TimeSlot[];
  onToggle: (slot: TimeSlot) => void;
  onToggleEntireRow: (time: TimeOfDay) => void;
  onToggleEntireColumn: (day: DayOfWeek) => void;
  onToggleEntireGrid: () => void;
  tone: 'primary' | 'secondary';
}

type HeaderColumn =
  | {kind: 'day'; key: DayOfWeek; label: string}
  | {kind: 'all-days'; label: string};

const HEADER_COLUMNS: HeaderColumn[] = [
  ...DAYS_OF_WEEK.map((d) => ({kind: 'day' as const, key: d.key, label: d.label})),
  {kind: 'all-days', label: 'Tất cả'},
];

function slotsSelected(slots: TimeSlot[], selectedSlots: TimeSlot[]) {
  return slots.length > 0 && slots.every((s) => selectedSlots.includes(s));
}

export default function WeekScheduleGrid({
  title,
  selectedSlots,
  onToggle,
  onToggleEntireRow,
  onToggleEntireColumn,
  onToggleEntireGrid,
  tone,
}: WeekScheduleGridProps) {
  const accentColor = tone === 'primary' ? 'primary' : 'secondary';

  const rowAllSlots = (time: TimeOfDay): TimeSlot[] =>
    DAYS_OF_WEEK.map(({key}) => `${time} ${key}` as TimeSlot);

  const columnAllSlots = (day: DayOfWeek): TimeSlot[] =>
    TIMES_OF_DAY.map(({key}) => `${key} ${day}` as TimeSlot);

  const renderCheckboxButton = (
    selected: boolean,
    ariaLabel: string,
    onClick: () => void,
    variant: 'cell' | 'bulk' = 'cell',
  ) => {
    const bulkRing = variant === 'bulk' ? 'ring-1 ring-outline-variant/30' : '';
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        aria-pressed={selected}
        onClick={onClick}
        className={`flex h-9 w-full items-center justify-center rounded-xl transition-all ${bulkRing} ${
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
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-on-surface">{title}</p>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              <th className="w-16 border-b border-r border-outline-variant/15 bg-surface-container-low/60 px-2 py-2.5 text-center text-[11px] font-black uppercase tracking-wider text-on-surface-variant" />
              {HEADER_COLUMNS.map((col) => (
                <th
                  key={col.kind === 'day' ? col.key : 'all-days'}
                  className="border-b border-r border-outline-variant/15 bg-surface-container-low/60 px-1 py-2.5 text-center text-[11px] font-black uppercase tracking-wider text-on-surface-variant last:border-r-0"
                >
                  {col.label}
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
                {HEADER_COLUMNS.map((col) => {
                  if (col.kind === 'all-days') {
                    const rowSlots = rowAllSlots(time);
                    const selected = slotsSelected(rowSlots, selectedSlots);
                    return (
                      <td key="all-days" className="border-r border-outline-variant/15 bg-surface-container-low/20 p-1">
                        {renderCheckboxButton(selected, `Chọn tất cả các ngày cho ${timeLabel}`, () => onToggleEntireRow(time), 'bulk')}
                      </td>
                    );
                  }

                  const slot = `${time} ${col.key}` as TimeSlot;
                  const selected = selectedSlots.includes(slot);
                  return (
                    <td key={col.key} className="border-r border-outline-variant/15 p-1 last:border-r-0">
                      {renderCheckboxButton(selected, `${timeLabel} ${col.label}`, () => onToggle(slot))}
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr className="border-t-2 border-outline-variant/20 bg-surface-container-low/30">
              <td className="border-r border-outline-variant/15 px-2 py-2 text-center text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
                Tất cả
              </td>
              {HEADER_COLUMNS.map((col) => {
                if (col.kind === 'all-days') {
                  const allSlots = DAYS_OF_WEEK.flatMap(({key: day}) => TIMES_OF_DAY.map(({key: t}) => `${t} ${day}` as TimeSlot));
                  const selected = slotsSelected(allSlots, selectedSlots);
                  return (
                    <td key="all-corner" className="border-r border-outline-variant/15 p-1">
                      {renderCheckboxButton(selected, 'Chọn toàn bộ lưới thời gian', onToggleEntireGrid, 'bulk')}
                    </td>
                  );
                }

                const colSlots = columnAllSlots(col.key);
                const selected = slotsSelected(colSlots, selectedSlots);
                return (
                  <td key={col.key} className="border-r border-outline-variant/15 p-1 last:border-r-0">
                    {renderCheckboxButton(selected, `Chọn tất cả khung giờ cho ${col.label}`, () => onToggleEntireColumn(col.key), 'bulk')}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

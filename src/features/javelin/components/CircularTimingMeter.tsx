import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { TimingQuality } from '../game/types';

type HotZone = {
  start: number;
  end: number;
  kind: 'good' | 'perfect';
};

type CircularTimingMeterProps = {
  labelKey: string;
  phase01: number;
  hotZones: HotZone[];
  active?: boolean;
  hitFeedback?: TimingQuality | null;
  valueText?: string;
  size?: number;
};

const TAU = Math.PI * 2;

const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

const pointOnCircle = (cx: number, cy: number, r: number, phase01: number): { x: number; y: number } => {
  const angle = wrap01(phase01) * TAU - Math.PI / 2;
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r
  };
};

const arcPath = (cx: number, cy: number, r: number, start01: number, end01: number): string => {
  const start = pointOnCircle(cx, cy, r, start01);
  const end = pointOnCircle(cx, cy, r, end01);
  const span = (wrap01(end01) - wrap01(start01) + 1) % 1;
  const largeArc = span > 0.5 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const renderZonePath = (
  cx: number,
  cy: number,
  r: number,
  start01: number,
  end01: number
): string[] => {
  const start = wrap01(start01);
  const end = wrap01(end01);
  if (start <= end) {
    return [arcPath(cx, cy, r, start, end)];
  }
  return [arcPath(cx, cy, r, start, 1), arcPath(cx, cy, r, 0, end)];
};

export const CircularTimingMeter = ({
  labelKey,
  phase01,
  hotZones,
  active = true,
  hitFeedback = null,
  valueText = '',
  size = 128
}: CircularTimingMeterProps): ReactElement => {
  const { t } = useI18n();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 16;
  const cursor = pointOnCircle(cx, cy, radius, phase01);

  return (
    <div className={`timing-meter ${active ? 'is-active' : ''} feedback-${hitFeedback ?? 'none'}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${t(labelKey)} ${valueText}`.trim()}
      >
        <circle className="timing-track" cx={cx} cy={cy} r={radius} />
        {hotZones.flatMap((zone) =>
          renderZonePath(cx, cy, radius, zone.start, zone.end).map((path, index) => (
            <path
              key={`${zone.kind}-${zone.start}-${zone.end}-${index}`}
              d={path}
              className={`timing-zone zone-${zone.kind}`}
            />
          ))
        )}
        <circle className="timing-cursor" cx={cursor.x} cy={cursor.y} r={6} />
      </svg>
      <div className="timing-meter-meta">
        <span>{t(labelKey)}</span>
        {valueText && <strong>{valueText}</strong>}
        {hitFeedback && <small>{t(`hud.${hitFeedback}`)}</small>}
      </div>
    </div>
  );
};

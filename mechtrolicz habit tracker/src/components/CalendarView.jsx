import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Minus, Calendar } from 'lucide-react';
import { formatDate } from '../utils/storage';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarView({ data }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Build day cells
  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDate(new Date(viewYear, viewMonth, d));
      const completions = data.habits.map(h => {
        const key = `${h.id}_${dateStr}`;
        const c = data.completions[key];
        return { habit: h, status: c?.status || 'none' };
      });
      const total = completions.length;
      const done = completions.filter(c => c.status === 'completed').length;
      const skipped = completions.filter(c => c.status === 'skipped').length;
      const pct = total > 0 ? Math.round((done / total) * 100) : null;
      arr.push({ d, dateStr, completions, total, done, skipped, pct });
    }
    return arr;
  }, [viewYear, viewMonth, data]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  };

  const getDotColor = (pct) => {
    if (pct === null) return 'transparent';
    if (pct === 100) return '#10b981';
    if (pct >= 60) return '#f59e0b';
    if (pct > 0) return '#ef4444';
    return '#e2e8f0';
  };

  const selectedCell = cells.find(c => c && c.dateStr === selectedDate);

  return (
    <div className="animate-fade" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Habit Calendar</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tap a day to see your completion history</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, fontSize: '0.76rem', fontWeight: 600 }}>
            {[['#10b981','100%'],['#f59e0b','60–99%'],['#ef4444','<60%'],['#e2e8f0','0%']].map(([col, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: col }} />
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDate ? '1fr 340px' : '1fr', gap: 24 }}>
        {/* Calendar Grid */}
        <div className="card" style={{ padding: 24 }}>
          {/* Month navigator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <button onClick={prevMonth} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer' }}>
              <ChevronLeft size={18} />
            </button>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <button onClick={nextMonth} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {DAY_LABELS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} />;
              const isToday = cell.dateStr === formatDate(today);
              const isSelected = cell.dateStr === selectedDate;
              const isFuture = new Date(cell.dateStr) > today;
              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : cell.dateStr)}
                  disabled={isFuture}
                  style={{
                    background: isSelected ? 'var(--primary)' : isToday ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface-elevated)',
                    border: isToday ? '2px solid var(--primary)' : isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: '8px 4px',
                    cursor: isFuture ? 'default' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    opacity: isFuture ? 0.3 : 1,
                    transition: 'all 0.15s',
                    minHeight: 52,
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: isToday ? 800 : 600, color: isSelected ? '#fff' : isToday ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {cell.d}
                  </span>
                  {!isFuture && cell.total > 0 && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : getDotColor(cell.pct) }} />
                  )}
                  {!isFuture && cell.total > 0 && (
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                      {cell.done}/{cell.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Monthly summary strip */}
          <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Perfect Days', value: cells.filter(c => c && c.pct === 100).length, color: '#10b981' },
              { label: 'Partial Days', value: cells.filter(c => c && c.pct !== null && c.pct > 0 && c.pct < 100).length, color: '#f59e0b' },
              { label: 'Missed Days', value: cells.filter(c => c && c.total > 0 && c.done === 0 && new Date(c.dateStr) <= today).length, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--bg-surface-elevated)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Detail Panel */}
        {selectedCell && (
          <div className="card animate-fade" style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Calendar size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.05rem' }}>
                  {new Date(selectedCell.dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.76rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                  ✓ {selectedCell.done} Done
                </span>
                {selectedCell.total - selectedCell.done > 0 && (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.76rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                    ✗ {selectedCell.total - selectedCell.done} Missed
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto', overscrollBehavior: 'contain' }}>
              {selectedCell.completions.map(({ habit, status }) => (
                <div key={habit.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  background: status === 'completed' ? '#f0fdf4' : status === 'skipped' ? '#fffbeb' : '#fafafa',
                  border: `1px solid ${status === 'completed' ? '#bbf7d0' : status === 'skipped' ? '#fde68a' : '#e2e8f0'}`
                }}>
                  {status === 'completed'
                    ? <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                    : status === 'skipped'
                    ? <Minus size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    : <XCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{habit.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{habit.category} · {habit.target} {habit.unit}</div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700,
                    color: status === 'completed' ? '#15803d' : status === 'skipped' ? '#92400e' : '#b91c1c',
                    textTransform: 'uppercase'
                  }}>{status === 'none' ? 'Missed' : status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

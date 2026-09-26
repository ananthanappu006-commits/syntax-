import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Zap, CheckCircle2, Award } from 'lucide-react';
import { getPastDates, getTodayDate } from '../utils/storage';

export default function AnalyticsView({ data }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const past35Days = getPastDates(35);
  const today = getTodayDate();

  // Calculate consistency stats
  let totalTracked = 0;
  let totalCompleted = 0;

  past35Days.forEach(dateStr => {
    data.habits.forEach(habit => {
      const rec = data.completions[`${habit.id}_${dateStr}`];
      totalTracked++;
      if (rec && rec.status === 'completed') {
        totalCompleted++;
      }
    });
  });

  const overallConsistency = totalTracked > 0 ? Math.round((totalCompleted / totalTracked) * 100) : 0;

  // Day of week completion aggregation
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayStats = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const dayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  past35Days.forEach(dateStr => {
    const dayName = daysOfWeek[new Date(dateStr).getDay()];
    data.habits.forEach(habit => {
      dayCounts[dayName]++;
      const rec = data.completions[`${habit.id}_${dateStr}`];
      if (rec && rec.status === 'completed') {
        dayStats[dayName]++;
      }
    });
  });

  const dayPercentages = daysOfWeek.map(d => {
    const count = dayCounts[d] || 1;
    const completed = dayStats[d] || 0;
    return {
      day: d,
      percent: Math.round((completed / count) * 100)
    };
  });

  // Category counts
  const categoryCounts = {};
  data.habits.forEach(h => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const categoryEntries = Object.entries(categoryCounts);

  return (
    <div className="analytics-page animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Productivity Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Historical habit consistency, patterns, and behavioral trends
        </p>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', width: '50px', height: '50px' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {overallConsistency}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              35-Day Consistency Score
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div className="card-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', width: '50px', height: '50px' }}>
            <Zap size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {data.user.longestStreak} Days
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Longest Unbroken Streak
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', width: '50px', height: '50px' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {totalCompleted}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Habits Checked
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Heatmap Card */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="card-title">Habit Consistency Heatmap</h3>
              <p className="card-subtitle">Daily activity intensity over the last 5 weeks</p>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Less</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.05)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(16, 185, 129, 0.3)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(16, 185, 129, 0.6)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10b981' }} />
            <span>More</span>
          </div>
        </div>

        <div className="heatmap-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="heatmap-grid">
            {past35Days.map(dateStr => {
              // Count completed habits on this date
              let done = 0;
              data.habits.forEach(h => {
                const rec = data.completions[`${h.id}_${dateStr}`];
                if (rec && rec.status === 'completed') done++;
              });

              let lvlClass = 'heatmap-lvl-0';
              if (done >= 4) lvlClass = 'heatmap-lvl-4';
              else if (done === 3) lvlClass = 'heatmap-lvl-3';
              else if (done === 2) lvlClass = 'heatmap-lvl-2';
              else if (done >= 1) lvlClass = 'heatmap-lvl-1';

              const d = new Date(dateStr);
              const dayNum = d.getDate();

              return (
                <div
                  key={dateStr}
                  className={`heatmap-cell ${lvlClass}`}
                  onMouseEnter={() => setHoveredCell({ date: dateStr, done })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          {/* Hover Tooltip display */}
          <div style={{ minHeight: '24px', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '8px' }}>
            {hoveredCell ? (
              <span>
                <strong>{hoveredCell.date}</strong>: {hoveredCell.done} habits completed
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Hover over any day square to inspect completion volume</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Day of Week Trend & Category Breakdown */}
      <div className="grid-2">
        {/* Day of Week Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="card-title">Day-of-Week Consistency</h3>
                <p className="card-subtitle">Performance breakdown across the week</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', gap: '12px' }}>
            {dayPercentages.map(item => (
              <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {item.percent}%
                </span>
                <div style={{ width: '100%', maxWidth: '36px', height: '130px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${item.percent}%`,
                      background: 'var(--gradient-primary)',
                      borderRadius: '6px',
                      transition: 'height 0.6s ease'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Award size={20} />
              </div>
              <div>
                <h3 className="card-title">Category Balance</h3>
                <p className="card-subtitle">Distribution of active habits</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {categoryEntries.map(([category, count]) => {
              const share = Math.round((count / data.habits.length) * 100);
              return (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{category}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {count} habit{count > 1 ? 's' : ''} ({share}%)
                    </span>
                  </div>
                  <div className="goal-progress-bar-bg" style={{ height: '8px' }}>
                    <div
                      className="goal-progress-bar-fill"
                      style={{
                        width: `${share}%`,
                        background: category === 'Health' ? '#06b6d4' : (category === 'Work' ? '#6366f1' : (category === 'Fitness' ? '#10b981' : '#f59e0b'))
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

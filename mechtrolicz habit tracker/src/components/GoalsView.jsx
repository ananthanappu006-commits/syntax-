import React from 'react';
import { Plus, Target, Calendar, Award, CheckCircle2, Trash2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function GoalsView({
  data,
  onOpenAddGoal,
  onUpdateGoalProgress,
  onDeleteGoal
}) {
  return (
    <div className="goals-page animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Goals & Milestones</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Transform ambitious aspirations into daily achievable habit milestones
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddGoal}>
          <Plus size={18} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Grid of goals */}
      <div className="grid-2">
        {data.goals.map(goal => {
          const percent = Math.min(100, Math.round((goal.currentProgress / goal.target) * 100));
          const isComplete = percent >= 100 || goal.status === 'completed';

          return (
            <div key={goal.id} className="goal-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      className="badge-tag"
                      style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)' }}
                    >
                      {goal.category}
                    </span>
                    {isComplete && (
                      <span className="badge-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                        Completed 🏆
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{goal.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {goal.description}
                  </p>
                </div>

                <button
                  className="icon-action-btn"
                  style={{ color: 'var(--accent-rose)', width: '32px', height: '32px' }}
                  title="Delete Goal"
                  onClick={() => onDeleteGoal(goal.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Progress Bar & Indicators */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Progress</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                    {goal.currentProgress} / {goal.target} {goal.unit} ({percent}%)
                  </span>
                </div>
                <div className="goal-progress-bar-bg" style={{ height: '10px' }}>
                  <div
                    className="goal-progress-bar-fill"
                    style={{
                      width: `${percent}%`,
                      background: isComplete ? 'var(--gradient-emerald)' : 'var(--gradient-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Quick Update Progress Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} />
                  <span>Target: {goal.deadline}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    onClick={() => onUpdateGoalProgress(goal.id, -1)}
                    disabled={goal.currentProgress <= 0}
                  >
                    - 1
                  </button>
                  <button
                    className="btn-primary"
                    style={{ padding: '4px 14px', fontSize: '0.8rem' }}
                    onClick={() => onUpdateGoalProgress(goal.id, 1)}
                  >
                    + 1 {goal.unit}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

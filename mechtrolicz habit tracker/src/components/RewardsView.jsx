import React from 'react';
import { Trophy, Award, Flame, Crown, Footprints, Sunrise, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/audio';

export default function RewardsView({ data }) {
  const triggerConfettiCelebration = () => {
    soundEffects.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Footprints': return <Footprints size={26} />;
      case 'Flame': return <Flame size={26} fill="#f97316" />;
      case 'Sunrise': return <Sunrise size={26} />;
      case 'Crown': return <Crown size={26} />;
      case 'Trophy': return <Trophy size={26} />;
      default: return <Award size={26} />;
    }
  };

  const xpPercent = Math.min(100, Math.round((data.user.currentXP / data.user.nextLevelXP) * 100));

  return (
    <div className="rewards-page animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Rewards & Gamification</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Earn experience points, unlock achievement badges, and level up your consistency
          </p>
        </div>

        <button className="btn-primary" onClick={triggerConfettiCelebration}>
          <Sparkles size={18} />
          <span>Celebrate Streak 🎉</span>
        </button>
      </div>

      {/* Main XP Status Card */}
      <div className="card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-light)', letterSpacing: '0.05em' }}>
              CURRENT RANK
            </span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Level {data.user.level}: {data.user.levelTitle}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {data.user.nextLevelXP - data.user.currentXP} XP remaining to unlock Level {data.user.level + 1}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
              {data.user.totalPoints}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Accumulated Score Points
            </div>
          </div>
        </div>

        <div className="xp-bar-bg" style={{ height: '12px' }}>
          <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          <span>{data.user.currentXP} XP</span>
          <span>{data.user.nextLevelXP} XP Target</span>
        </div>
      </div>

      {/* Points System Explanation */}
      <div className="card" style={{ marginBottom: '28px', padding: '18px 24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Points & Rewards Breakdown</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>+10 pts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Each habit completed</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6366f1' }}>+25 pts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>100% daily routine completed</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f97316' }}>+50 pts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Maintain 7-day streak</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>+100 pts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Achieve a major goal</div>
          </div>
        </div>
      </div>

      {/* Badges Trophy Grid */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Trophy Showcase</h3>
      <div className="trophy-grid">
        {data.badges.map(badge => (
          <div
            key={badge.id}
            className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="badge-icon-box">
              {getBadgeIcon(badge.icon)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{badge.title}</h4>
                {badge.unlocked && <span style={{ fontSize: '0.85rem' }}>✨</span>}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 6px' }}>
                {badge.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>
                  +{badge.points} pts
                </span>
                {badge.unlocked && (
                  <span style={{ fontSize: '0.72rem', color: '#10b981' }}>
                    • Unlocked on {badge.unlockedAt}
                  </span>
                )}
                {!badge.unlocked && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    • Locked
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

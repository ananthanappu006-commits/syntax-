import React, { useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/audio';

export default function CelebrationModal({ isOpen, onClose, title, message, points }) {
  useEffect(() => {
    if (isOpen) {
      soundEffects.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-pop"
        style={{ textAlign: 'center', maxWidth: '420px', padding: '36px 28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#fff',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
          }}
        >
          <Award size={38} />
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
          {title || 'Milestone Achieved!'}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
          {message || 'You have made outstanding consistency progress today! Keep up the momentum.'}
        </p>

        {points && (
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontWeight: 800,
              fontSize: '1.1rem',
              padding: '6px 18px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '24px'
            }}
          >
            +{points} Points Earned ✨
          </div>
        )}

        <div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
            Awesome, Let's Keep Going!
          </button>
        </div>
      </div>
    </div>
  );
}

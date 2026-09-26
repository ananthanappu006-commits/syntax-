import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ScheduleModal({ isOpen, onClose, onSave, habits }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [duration, setDuration] = useState(30);
  const [category, setCategory] = useState('Work');
  const [linkedHabitId, setLinkedHabitId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: `sch-${Date.now()}`,
      title: title.trim(),
      time,
      duration: Number(duration) || 30,
      category,
      status: 'pending',
      linkedHabitId: linkedHabitId || null
    });

    setTitle('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Routine Activity</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Title *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Focus Session, Yoga Practice"
              required
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Mins)</label>
              <input
                type="number"
                min="5"
                step="5"
                className="form-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Health">Health</option>
                <option value="Work">Work</option>
                <option value="Fitness">Fitness</option>
                <option value="Study">Study</option>
                <option value="Personal Development">Personal Development</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Link to Habit (Optional)</label>
              <select
                className="form-select"
                value={linkedHabitId}
                onChange={(e) => setLinkedHabitId(e.target.value)}
              >
                <option value="">None (Independent)</option>
                {habits.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

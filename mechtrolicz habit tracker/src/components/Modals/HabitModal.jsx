import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function HabitModal({ isOpen, onClose, onSave, editingHabit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Health');
  const [frequency, setFrequency] = useState('Daily');
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState('times');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [priority, setPriority] = useState('Medium');
  const [color, setColor] = useState('#6366f1');

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name || '');
      setDescription(editingHabit.description || '');
      setCategory(editingHabit.category || 'Health');
      setFrequency(editingHabit.frequency || 'Daily');
      setTarget(editingHabit.target || 1);
      setUnit(editingHabit.unit || 'times');
      setReminderTime(editingHabit.reminderTime || '08:00');
      setPriority(editingHabit.priority || 'Medium');
      setColor(editingHabit.color || '#6366f1');
    } else {
      setName('');
      setDescription('');
      setCategory('Health');
      setFrequency('Daily');
      setTarget(1);
      setUnit('times');
      setReminderTime('08:00');
      setPriority('Medium');
      setColor('#6366f1');
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: editingHabit ? editingHabit.id : `h-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      frequency,
      target: Number(target) || 1,
      unit,
      reminderTime,
      priority,
      color,
      createdAt: editingHabit ? editingHabit.createdAt : new Date().toISOString().slice(0, 10),
      isActive: true,
      streak: editingHabit ? editingHabit.streak : 0
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Habit Name *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning 20-min Jog, Drink 2L Water"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Routine Cue</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this matter? What is the trigger?"
            />
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
                <option value="Fitness">Fitness</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal Development">Personal Development</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Target Quantity</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <input
                type="text"
                className="form-input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="mins, pages, ml, times"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select
                className="form-select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="Daily">Daily</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Custom">Custom Days</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reminder Time</label>
              <input
                type="time"
                className="form-input"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span>{editingHabit ? 'Save Changes' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

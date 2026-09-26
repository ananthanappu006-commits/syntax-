import React, { useState } from 'react';
import {
  Plus,
  Check,
  Clock,
  Calendar,
  Trash2,
  FastForward,
  Sparkles,
  Sunrise,
  Sun,
  Moon,
  Timer,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function ScheduleView({
  data,
  onCompleteScheduleItem,
  onOpenAddSchedule,
  onDeleteScheduleItem,
  onPostponeScheduleItem
}) {
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Sort schedule items by time ascending
  const sortedSchedule = [...data.schedule].sort((a, b) => a.time.localeCompare(b.time));

  const filteredSchedule = sortedSchedule.filter(item => {
    if (filterPeriod === 'morning') return item.time < '12:00';
    if (filterPeriod === 'afternoon') return item.time >= '12:00' && item.time < '18:00';
    if (filterPeriod === 'evening') return item.time >= '18:00';
    return true;
  });

  const totalBlocks = data.schedule.length;
  const completedBlocks = data.schedule.filter(s => s.status === 'completed').length;
  const totalMinutes = data.schedule.reduce((acc, curr) => acc + (curr.duration || 30), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Next upcoming item
  const nextPending = sortedSchedule.find(s => s.status !== 'completed');

  const filterTabs = [
    { id: 'all', label: 'All Day', icon: Calendar },
    { id: 'morning', label: 'Morning (06:00 - 12:00)', icon: Sunrise },
    { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)', icon: Sun },
    { id: 'evening', label: 'Evening (18:00 - 23:59)', icon: Moon },
  ];

  return (
    <div className="schedule-view-container animate-fade">
      {/* Top Header Row */}
      <div className="schedule-header-row">
        <div>
          <h2 className="editorial-title">Daily Routine & Schedule</h2>
          <p className="editorial-subtitle">Structured 24-hour block planning and routine execution</p>
        </div>

        <button className="navbar-cta-btn" onClick={onOpenAddSchedule}>
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Routine Block</span>
        </button>
      </div>

      {/* Pastel Metric Snapshot Row (Matching Reference UI Style) */}
      <div className="schedule-stats-row">
        <div className="schedule-stat-pill pill-mint">
          <div className="stat-pill-icon">
            <CheckCircle2 size={18} className="text-emerald-700" />
          </div>
          <div>
            <span className="stat-pill-val">{completedBlocks} of {totalBlocks}</span>
            <span className="stat-pill-lbl">Completed Blocks</span>
          </div>
        </div>

        <div className="schedule-stat-pill pill-peach">
          <div className="stat-pill-icon">
            <Timer size={18} className="text-orange-700" />
          </div>
          <div>
            <span className="stat-pill-val">{totalHours} hrs</span>
            <span className="stat-pill-lbl">Total Planned Time</span>
          </div>
        </div>

        <div className="schedule-stat-pill pill-sky">
          <div className="stat-pill-icon">
            <Clock size={18} className="text-cyan-700" />
          </div>
          <div>
            <span className="stat-pill-val">{nextPending ? nextPending.time : 'All Done!'}</span>
            <span className="stat-pill-lbl">{nextPending ? nextPending.title : 'Day Complete'}</span>
          </div>
        </div>
      </div>

      {/* Time of Day Filter Pills */}
      <div className="schedule-filter-bar">
        {filterTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = filterPeriod === tab.id;
          return (
            <button
              key={tab.id}
              className={`schedule-filter-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                soundEffects.playClick();
                setFilterPeriod(tab.id);
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Schedule Timeline List */}
      <div className="schedule-timeline-wrapper">
        {filteredSchedule.length === 0 ? (
          <div className="schedule-empty-card">
            <div className="empty-icon-circle">
              <Calendar size={32} className="text-slate-400" />
            </div>
            <h4 className="empty-title">No Activities Scheduled</h4>
            <p className="empty-desc">There are no routine blocks planned for this time window. Click below to add one!</p>
            <button className="navbar-cta-btn" onClick={onOpenAddSchedule} style={{ marginTop: '12px' }}>
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Block</span>
            </button>
          </div>
        ) : (
          <div className="timeline-blocks-list">
            {filteredSchedule.map((item, index) => {
              const isDone = item.status === 'completed';

              return (
                <div key={item.id} className={`timeline-block-row ${isDone ? 'is-completed' : ''}`}>
                  {/* Left Column: Time & Node */}
                  <div className="timeline-time-col">
                    <div className={`time-pill-badge ${isDone ? 'time-done' : ''}`}>
                      <Clock size={13} />
                      <span>{item.time}</span>
                    </div>
                    {index < filteredSchedule.length - 1 && (
                      <div className="timeline-connector-line"></div>
                    )}
                  </div>

                  {/* Right Column: Porcelain Liquid Card (Appointment-Style) */}
                  <div className={`timeline-routine-card ${isDone ? 'card-done' : ''}`}>
                    <div className="routine-card-main">
                      <div className="routine-title-row">
                        <h4 className={`routine-title ${isDone ? 'strike' : ''}`}>
                          {item.title}
                        </h4>
                        
                        {/* Soft Pastel Specialty Pill (From reference image) */}
                        <div className="routine-category-pill">
                          <Tag size={12} />
                          <span>{item.category || 'General'}</span>
                        </div>
                      </div>

                      <div className="routine-meta-row">
                        <span className="routine-duration-chip">⏱️ {item.duration} mins</span>
                        {item.linkedHabitId && (
                          <span className="routine-linked-chip">🔗 Linked Habit</span>
                        )}
                        {item.macros && (
                          <span className="routine-macros-chip">
                            🔥 {item.macros.calories} kcal • {item.macros.protein}g protein
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Matching Reference Circular Midnight Buttons */}
                    <div className="routine-actions-group">
                      {/* Postpone Button (+30m) */}
                      {!isDone && (
                        <button
                          className="routine-action-btn postpone-btn"
                          title="Postpone 30 minutes"
                          onClick={() => {
                            soundEffects.playClick();
                            onPostponeScheduleItem(item.id);
                          }}
                        >
                          <FastForward size={15} />
                          <span className="action-hover-lbl">+30m</span>
                        </button>
                      )}

                      {/* Complete Check Button */}
                      <button
                        className={`routine-action-btn check-toggle-btn ${isDone ? 'btn-checked' : ''}`}
                        title={isDone ? 'Mark as Incomplete' : 'Complete Activity (+15 XP)'}
                        onClick={() => {
                          onCompleteScheduleItem(item.id);
                        }}
                      >
                        <Check size={18} strokeWidth={isDone ? 3 : 2.4} />
                      </button>

                      {/* Delete Button */}
                      <button
                        className="routine-action-btn delete-btn"
                        title="Delete Routine Block"
                        onClick={() => {
                          soundEffects.playClick();
                          onDeleteScheduleItem(item.id);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

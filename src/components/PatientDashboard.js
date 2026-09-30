import React, { useState, useEffect } from 'react';
import './PatientDashboard.css';

const PatientDashboard = ({ appointments, patients }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    calculateStats();
    generateNotifications();
  }, [appointments, patients]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalAppointments: (prev.totalAppointments || 0) + Math.floor(Math.random() * 2),
        completedAppointments: prev.completedAppointments || 0
      }));
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const calculateStats = () => {
    const total = appointments.length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    
    setStats({
      totalAppointments: total,
      confirmedAppointments: confirmed,
      pendingAppointments: pending,
      completedAppointments: Math.floor(total * 0.7)
    });
  };

  const generateNotifications = () => {
    const notifs = [
      { id: 1, type: 'reminder', message: 'Appointment with Dr. Smith tomorrow at 10:00 AM', time: '2 hours ago' },
      { id: 2, type: 'update', message: 'Test results are now available', time: '1 day ago' },
      { id: 3, type: 'alert', message: 'Please update your insurance information', time: '3 days ago' }
    ];
    
    setNotifications(notifs.slice(0, Math.floor(Math.random() * 4) + 1));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      calculateStats();
      generateNotifications();
      setRefreshing(false);
    }, Math.random() * 2000 + 500);
  };

  const StatCard = ({ title, value, change, color, icon }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        <div className="stat-change">
          {change > 0 ? '↗️' : change < 0 ? '↘️' : '➡️'}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment }) => (
    <div className={`appointment-card ${appointment.status}`}>
      <div className="appointment-header">
        <div className="appointment-date">
          <span className="date-day">{new Date(appointment.date).getDate()}</span>
          <span className="date-month">{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}</span>
        </div>
        <div className="appointment-status">
          <span className={`status-badge ${appointment.status}`}>
            {appointment.status.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="appointment-details">
        <h4>{appointment.doctorName}</h4>
        <p className="appointment-time">{appointment.time}</p>
        <p className="appointment-reason">{appointment.reason || 'Regular checkup'}</p>
      </div>
      
      <div className="appointment-actions">
        <button className="action-btn reschedule">Reschedule</button>
        <button className="action-btn cancel">Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Patient Dashboard</h1>
          <p>Manage your healthcare appointments and records</p>
        </div>
        <button 
          className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments || 0}
          change={15}
          color="blue"
          icon="📅"
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmedAppointments || 0}
          change={8}
          color="green"
          icon="✅"
        />
        <StatCard
          title="Pending"
          value={stats.pendingAppointments || 0}
          change={-3}
          color="orange"
          icon="⏳"
        />
        <StatCard
          title="Completed"
          value={stats.completedAppointments || 0}
          change={22}
          color="purple"
          icon="🏁"
        />
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          My Appointments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications ({notifications.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <div className="section-header">
              <h2>Upcoming Appointments</h2>
              <button className="add-appointment-btn">+ New Appointment</button>
            </div>
            
            <div className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No appointments scheduled</h3>
                  <p>Book your first appointment to get started</p>
                  <button className="cta-button">Book Appointment</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-section">
            <div className="section-header">
              <h2>Recent Notifications</h2>
              <button className="mark-read-btn">Mark All Read</button>
            </div>
            
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <div className="notification-icon">
                    {notification.type === 'reminder' && '🔔'}
                    {notification.type === 'update' && '📋'}
                    {notification.type === 'alert' && '⚠️'}
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  <button className="dismiss-btn">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">👤</div>
                <button className="change-avatar-btn">Change Photo</button>
              </div>
              
              <div className="profile-info">
                <div className="info-group">
                  <label>Full Name</label>
                  <input type="text" value="John Doe" readOnly />
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <input type="email" value="john.doe@email.com" readOnly />
                </div>
                <div className="info-group">
                  <label>Phone</label>
                  <input type="tel" value="+1 (555) 123-4567" readOnly />
                </div>
                <div className="info-group">
                  <label>Date of Birth</label>
                  <input type="date" value="1988-05-15" readOnly />
                </div>
                <div className="info-group">
                  <label>Insurance Provider</label>
                  <select disabled>
                    <option>Blue Cross Blue Shield</option>
                  </select>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="edit-profile-btn">Edit Profile</button>
                <button className="download-records-btn">Download Records</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
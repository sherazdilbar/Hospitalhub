import React, { useState, useEffect } from 'react';
import './DoctorList.css';

const DoctorList = ({ doctors }) => {
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    let filtered = doctors;
    
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'specialty':
          return a.specialty.localeCompare(b.specialty);
        case 'availability':
          return b.available - a.available;
        default:
          return 0;
      }
    });
    
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedSpecialty, sortBy]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * doctors.length);
      const randomDoctor = doctors[randomIndex];
      if (randomDoctor) {
        setLoadingStates(prev => ({
          ...prev,
          [randomDoctor.id]: !prev[randomDoctor.id]
        }));
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [doctors]);

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  const handleBookAppointment = (doctorId) => {
    setLoadingStates(prev => ({
      ...prev,
      [doctorId]: true
    }));
    
    setTimeout(() => {
      setLoadingStates(prev => ({
        ...prev,
        [doctorId]: false
      }));
      alert(`Appointment request sent to doctor ID: ${doctorId}`);
    }, Math.random() * 3000 + 1000);
  };

  const DoctorCard = ({ doctor }) => (
    <div className={`doctor-card ${!doctor.available ? 'unavailable' : ''} ${loadingStates[doctor.id] ? 'loading' : ''}`}>
      <div className="doctor-avatar">
        <div className="avatar-placeholder">
          {doctor.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className={`availability-indicator ${doctor.available ? 'available' : 'unavailable'}`}>
          <span className="status-dot"></span>
        </div>
      </div>
      
      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        
        <div className="doctor-stats">
          <div className="stat">
            <span className="stat-label">Experience</span>
            <span className="stat-value">{Math.floor(Math.random() * 20) + 5} years</span>
          </div>
          <div className="stat">
            <span className="stat-label">Rating</span>
            <span className="stat-value">
              {(4 + Math.random()).toFixed(1)} ⭐
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Patients</span>
            <span className="stat-value">{Math.floor(Math.random() * 500) + 100}+</span>
          </div>
        </div>

        <div className="doctor-schedule">
          <h4>Available Times</h4>
          <div className="time-slots">
            {['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'].map((time, index) => (
              <span 
                key={index} 
                className={`time-slot ${Math.random() > 0.6 ? 'booked' : 'available'}`}
              >
                {time}
              </span>
            ))}
          </div>
        </div>
        
        <button 
          className="book-button"
          onClick={() => handleBookAppointment(doctor.id)}
          disabled={!doctor.available || loadingStates[doctor.id]}
        >
          {loadingStates[doctor.id] ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              Processing...
            </div>
          ) : (
            doctor.available ? 'Book Appointment' : 'Currently Unavailable'
          )}
        </button>
      </div>
      
      {loadingStates[doctor.id] && (
        <div className="card-overlay">
          <div className="overlay-content">
            <div className="loading-animation"></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="doctor-list-container">
      <div className="list-header">
        <h2>Our Medical Professionals</h2>
        <p>Find and book appointments with our qualified doctors</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>

        <div className="filter-controls">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="filter-select"
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="specialty">Sort by Specialty</option>
            <option value="availability">Sort by Availability</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className={`doctors-container ${viewMode}`}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">👨‍⚕️</div>
            <h3>No doctors found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <div className="emergency-section">
        <div className="emergency-card">
          <h3>🚨 Emergency Services</h3>
          <p>For urgent medical attention, please call our emergency hotline</p>
          <button className="emergency-button">Call Emergency: 911</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
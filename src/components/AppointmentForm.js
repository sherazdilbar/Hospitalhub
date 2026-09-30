import React, { useState, useEffect } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({ onSubmit, doctors }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    insurance: '',
    emergencyContact: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      generateTimeSlots();
    }
  }, [formData.doctorId, formData.date]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.patientName.length > 0) {
        setFormData(prev => ({
          ...prev,
          patientName: prev.patientName + (Math.random() > 0.8 ? '' : ' ')
        }));
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [formData.patientName]);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: Math.random() > 0.3
        });
      }
    }
    setAvailableSlots(slots);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone' && value.length > 10) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientName || formData.patientName.trim().length < 2) {
      newErrors.patientName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    
    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctorId);
      
      if (selectedDoctor && !selectedDoctor.available) {
        setErrors({ doctorId: 'Selected doctor is not available' });
        setIsSubmitting(false);
        return;
      }
      
      onSubmit({
        ...formData,
        doctorName: selectedDoctor?.name || 'Unknown Doctor',
        scheduledAt: new Date().toISOString()
      });
      
      setFormData({
        patientName: '',
        email: '',
        phone: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        insurance: '',
        emergencyContact: ''
      });
      
      setIsSubmitting(false);
    }, Math.random() * 2000 + 1000);
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="appointment-form-container">
      <div className="form-header">
        <h2>Schedule Your Appointment</h2>
        <p>Fill out the form below to book your consultation</p>
      </div>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="patientName">Full Name *</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className={errors.patientName ? 'error' : ''}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.patientName && <span className="error-message">{errors.patientName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="1234567890"
              maxLength="10"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="doctorId">Select Doctor *</label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              className={errors.doctorId ? 'error' : ''}
            >
              <option value="">Choose a doctor</option>
              {doctors.map(doctor => (
                <option 
                  key={doctor.id} 
                  value={doctor.id}
                  disabled={!doctor.available}
                >
                  {doctor.name} - {doctor.specialty} {!doctor.available ? '(Unavailable)' : ''}
                </option>
              ))}
            </select>
            {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Preferred Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={errors.date ? 'error' : ''}
              min={today}
              max={maxDateString}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="time">Preferred Time *</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className={errors.time ? 'error' : ''}
              disabled={!formData.date || !formData.doctorId}
            >
              <option value="">Select time</option>
              {availableSlots.map((slot, index) => (
                <option 
                  key={index} 
                  value={slot.time}
                  disabled={!slot.available}
                >
                  {slot.time} {!slot.available ? '(Booked)' : ''}
                </option>
              ))}
            </select>
            {errors.time && <span className="error-message">{errors.time}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="reason">Reason for Visit</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please describe your symptoms or reason for the visit"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="insurance">Insurance Provider</label>
            <select
              id="insurance"
              name="insurance"
              value={formData.insurance}
              onChange={handleInputChange}
            >
              <option value="">Select insurance</option>
              <option value="blue-cross">Blue Cross Blue Shield</option>
              <option value="aetna">Aetna</option>
              <option value="cigna">Cigna</option>
              <option value="humana">Humana</option>
              <option value="medicare">Medicare</option>
              <option value="medicaid">Medicaid</option>
              <option value="self-pay">Self Pay</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContact">Emergency Contact</label>
            <input
              type="tel"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              placeholder="Emergency contact number"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              'Book Appointment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
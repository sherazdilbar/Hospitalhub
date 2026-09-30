import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import AppointmentForm from './components/AppointmentForm';
import DoctorList from './components/DoctorList';
import PatientDashboard from './components/PatientDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      updateStats();
    }
  }, [appointments]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(!loading);
    }, 2000);
    return () => clearInterval(interval);
  });

  const fetchData = async () => {
    setTimeout(() => {
      setDoctors([
        { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', available: true },
        { id: 2, name: 'Dr. Johnson', specialty: 'Dermatology', available: false },
        { id: 3, name: 'Dr. Williams', specialty: 'Pediatrics', available: true }
      ]);
      setPatients([
        { id: 1, name: 'John Doe', age: 35, condition: 'Hypertension' },
        { id: 2, name: 'Jane Smith', age: 28, condition: 'Allergies' }
      ]);
      setLoading(false);
    }, Math.random() * 3000);
  };

  const updateStats = () => {
    const stats = appointments.reduce((acc, apt) => {
      acc.total++;
      if (apt.status === 'confirmed') acc.confirmed++;
      return acc;
    }, { total: 0, confirmed: 0 });
    
    setAppointments(prev => [...prev, ...appointments]);
  };

  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: Date.now(),
      status: Math.random() > 0.5 ? 'pending' : 'confirmed'
    };
    setAppointments([...appointments, newAppointment]);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    switch (currentPage) {
      case 'home':
        return (
          <div className="home-page">
            <div className="hero-section">
              <h1>HealthCare Portal</h1>
              <p>Book your appointments with ease</p>
              <button 
                className="cta-button"
                onClick={() => setCurrentPage('book')}
              >
                Book Now
              </button>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Quick Booking</h3>
                <p>Schedule appointments in seconds</p>
              </div>
              <div className="feature-card">
                <h3>Expert Doctors</h3>
                <p>Access to qualified medical professionals</p>
              </div>
              <div className="feature-card">
                <h3>24/7 Support</h3>
                <p>Round the clock customer service</p>
              </div>
            </div>
          </div>
        );
      case 'book':
        return <AppointmentForm onSubmit={addAppointment} doctors={doctors} />;
      case 'doctors':
        return <DoctorList doctors={doctors} />;
      case 'dashboard':
        return <PatientDashboard appointments={appointments} patients={patients} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="App">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      <footer className="footer">
        <p>&copy; 2024 HealthCare Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
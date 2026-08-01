import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import Header from './components/Header';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      if (response.data && response.data.success) {
        setStudents(response.data.data);
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
        showNotification('danger', 'Failed to fetch student data.');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setIsBackendConnected(false);
      showNotification(
        'danger',
        'Could not connect to backend server. Make sure Flask API is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    // Periodic health check ping every 10 seconds to update backend status
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
        if (response.status === 200) {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (err) {
        setIsBackendConnected(false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleAddStudent = async (studentData, resetFormCallback) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/students`, studentData);
      if (response.data && response.data.success) {
        setIsBackendConnected(true);
        showNotification('success', 'Student registered successfully in MySQL database!');
        resetFormCallback();
        fetchStudents();
      } else {
        showNotification('danger', response.data.error || 'Error submitting student data.');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setIsBackendConnected(false);
      const errMsg =
        err.response?.data?.error ||
        'Failed to connect to backend server. Please try again.';
      showNotification('danger', errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/students/${id}`);
      if (response.data && response.data.success) {
        setIsBackendConnected(true);
        showNotification('success', `Student #${id} deleted successfully from MySQL database.`);
        fetchStudents();
      } else {
        showNotification('danger', response.data.error || 'Failed to delete student.');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      setIsBackendConnected(false);
      const errMsg =
        err.response?.data?.error || 'Failed to connect to backend server to delete student.';
      showNotification('danger', errMsg);
    }
  };

  return (
    <>
      <Header isConnected={isBackendConnected} />

      <main className="app-container">
        {/* Notification Alert Banner */}
        {notification && (
          <div className={`alert alert-${notification.type}`}>
            <div className="alert-content">
              {notification.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Student Form Section */}
        <StudentForm
          onAddStudent={handleAddStudent}
          isSubmitting={isSubmitting}
        />

        {/* Student Table Section */}
        <StudentTable
          students={students}
          isLoading={isLoading}
          onDeleteStudent={handleDeleteStudent}
        />
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} CloudBlitz Student Management System — 3-Tier Web Application</p>
      </footer>
    </>
  );
}

export default App;

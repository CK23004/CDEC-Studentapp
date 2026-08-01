import React, { useState } from 'react';
import { UserPlus, User, Mail, Phone, BookOpen, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const StudentForm = ({ onAddStudent, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number (7-15 digits)';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAddStudent(formData, () => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: ''
        });
        setErrors({});
      });
    }
  };

  return (
    <div className="card">
      <div className="section-tag">
        • ENROLLMENT FORM
      </div>
      <div className="card-header-flex">
        <div className="card-icon-title">
          <div className="icon-box icon-box-orange">
            <UserPlus size={22} />
          </div>
          <div>
            <h2 className="card-title">Add New Student</h2>
            <p className="card-subtitle">Register a new student into the MySQL database</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Student Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Student Name *
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error-border' : ''}`}
              />
            </div>
            {errors.name && (
              <span className="error-text">
                <AlertCircle size={13} /> {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. rahul.sharma@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error-border' : ''}`}
              />
            </div>
            {errors.email && (
              <span className="error-text">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number *
            </label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={18} />
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error-border' : ''}`}
              />
            </div>
            {errors.phone && (
              <span className="error-text">
                <AlertCircle size={13} /> {errors.phone}
              </span>
            )}
          </div>

          {/* Course */}
          <div className="form-group">
            <label className="form-label" htmlFor="course">
              Course *
            </label>
            <div className="input-wrapper">
              <BookOpen className="input-icon" size={18} />
              <input
                type="text"
                id="course"
                name="course"
                placeholder="e.g. DevOps & Cloud Architecture"
                value={formData.course}
                onChange={handleChange}
                className={`form-input ${errors.course ? 'error-border' : ''}`}
              />
            </div>
            {errors.course && (
              <span className="error-text">
                <AlertCircle size={13} /> {errors.course}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-gradient"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spin-icon" /> Submitting...
                </>
              ) : (
                <>
                  Submit Student Data <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;

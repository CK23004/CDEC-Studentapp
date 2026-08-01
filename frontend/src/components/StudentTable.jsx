import React, { useState, useMemo } from 'react';
import { GraduationCap, Mail, Phone, BookOpen, Hash, Loader2, Inbox, ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';

const StudentTable = ({ students, isLoading, onDeleteStudent }) => {
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [deletingId, setDeletingId] = useState(null);
  
  // State for controlling the custom theme delete confirmation modal
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    return [...students].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();

      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortColumn, sortDirection]);

  // Open modal for selected student
  const openDeleteModal = (student) => {
    setSelectedStudentForDelete(student);
    setIsModalOpen(true);
  };

  // Close modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedStudentForDelete(null);
  };

  // Confirm delete handler called from modal
  const handleConfirmDelete = async (id) => {
    setDeletingId(id);
    await onDeleteStudent(id);
    setDeletingId(null);
    closeDeleteModal();
  };

  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown size={14} className="sort-icon-inactive" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className="sort-icon-active" />
    ) : (
      <ArrowDown size={14} className="sort-icon-active" />
    );
  };

  return (
    <>
      <div className="card">
        <div className="section-tag">
          • DATABASE RECORDS
        </div>
        <div className="card-header-flex">
          <div className="card-icon-title">
            <div className="icon-box icon-box-purple">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="card-title">Registered Students List</h2>
              <p className="card-subtitle">
                Showing {students.length} student{students.length === 1 ? '' : 's'} • Click table headers to sort
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <div className="empty-state-icon-box">
              <Loader2 size={28} className="spin-icon" />
            </div>
            <p>Fetching student records from MySQL database...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon-box">
              <Inbox size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)' }}>No Student Records Found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Add a student using the form above to populate the database.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable-header">
                    <div className="header-cell-content">
                      <span>ID</span>
                      {renderSortIcon('id')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable-header">
                    <div className="header-cell-content">
                      <span>Student Name</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('email')} className="sortable-header">
                    <div className="header-cell-content">
                      <span>Email Address</span>
                      {renderSortIcon('email')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('phone')} className="sortable-header">
                    <div className="header-cell-content">
                      <span>Phone Number</span>
                      {renderSortIcon('phone')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('course')} className="sortable-header">
                    <div className="header-cell-content">
                      <span>Course</span>
                      {renderSortIcon('course')}
                    </div>
                  </th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="badge-id">
                        <Hash size={12} /> {student.id}
                      </span>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{getInitials(student.name)}</div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={14} style={{ color: 'var(--text-light)' }} />
                        {student.email}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Phone size={14} style={{ color: 'var(--text-light)' }} />
                        {student.phone}
                      </span>
                    </td>
                    <td>
                      <span className="course-pill">
                        <BookOpen size={13} /> {student.course}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => openDeleteModal(student)}
                        className="btn-delete"
                        disabled={deletingId === student.id}
                        title={`Delete ${student.name}`}
                      >
                        {deletingId === student.id ? (
                          <Loader2 size={14} className="spin-icon" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Theme Delete Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        student={selectedStudentForDelete}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        isDeleting={Boolean(deletingId)}
      />
    </>
  );
};

export default StudentTable;

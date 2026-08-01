import React from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

const DeleteModal = ({ isOpen, student, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-box">
          <AlertTriangle size={28} />
        </div>

        <h3 className="modal-title">Confirm Deletion</h3>
        <p className="modal-text">
          Are you sure you want to delete student <strong>"{student.name}"</strong> (ID: #{student.id})? This will permanently remove the record from the MySQL database.
        </p>

        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(student.id)}
            className="btn-danger-confirm"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin-icon" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} /> Delete Record
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

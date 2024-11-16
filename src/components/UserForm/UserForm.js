import { useState } from 'react';
import { LoadingSpinner } from '../Loading/LoadingSpinner';
import { showSuccess, showError } from '../../utils/toast';
import api from '../../utils/axiosConfig';

export const UserForm = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(user || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/users', formData);
      showSuccess('User saved successfully!');
      onSuccess?.(response.data);
    } catch (error) {
      showError(error.response?.data?.message || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-label="User Form">
      {/* Form fields here */}
      <button 
        type="submit" 
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <LoadingSpinner size="small" />
            <span className="ml-2">Saving...</span>
          </>
        ) : 'Save User'}
      </button>
    </form>
  );
}; 
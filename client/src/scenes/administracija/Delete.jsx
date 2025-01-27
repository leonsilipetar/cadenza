import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavTopAdministracija';
import DeleteConfirmModal from './DeleteConfirmModal';
import ApiConfig from '../../components/apiConfig';
import '../../styles/Delete.css';
import { notifikacija } from '../../components/Notifikacija';

const Delete = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'students' ? '/api/all-students' : '/api/mentori';
      const response = await axios.get(`${ApiConfig.baseUrl}${endpoint}`);

      if (activeTab === 'students') {
        setUsers(response.data.students || []);
      } else {
        setUsers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      notifikacija('Greška pri dohvaćanju korisnika', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (confirmedOib) => {
    if (!selectedUser || confirmedOib !== selectedUser.oib) {
      notifikacija('Netočan OIB. Brisanje nije uspjelo.', 'error');
      return;
    }

    try {
      await axios.delete(`${ApiConfig.baseUrl}/api/delete-user/${selectedUser._id}`, {
        data: { userType: activeTab === 'students' ? 'student' : 'mentor' }
      });

      notifikacija('Korisnik uspješno obrisan', 'success');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      notifikacija('Greška pri brisanju korisnika', 'error');
    }
  };

  return (
    <>
      <NavigacijaAdmin otvoreno="delete" />
      <NavTopAdministracija naslov="Administracija - Brisanje korisnika" />

      <div className="main">
        <div className="delete-tabs">
          <button
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Učenici
          </button>
          <button
            className={`tab ${activeTab === 'mentors' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentors')}
          >
            Mentori
          </button>
        </div>

        <div className="tablica">
          <div className="tr naziv">
            <div className="th">Korisničko ime</div>
            <div className="th">OIB</div>
            <div className="th"></div>
          </div>

          {loading ? (
            <div className="loading">Učitavanje...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div className="tr redak" key={user._id}>
                <div className="th">{user.korisnickoIme}</div>
                <div className="th">{user.oib}</div>
                <div className="th">
                  <button
                    className="action-btn abDelete"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Icon icon="solar:trash-bin-trash-broken" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">Nema pronađenih korisnika</div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          user={selectedUser}
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
};

export default Delete;
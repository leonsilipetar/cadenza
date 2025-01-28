import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavTopAdmin.jsx';
import DodajProgram from './DodajProgram';
import ApiConfig from '../../components/apiConfig';
import ProgramDetalji from './ProgramDetalji';
import Notification from '../../components/Notifikacija';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [odabranoDodajProgram, setOdabranoDodajProgram] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showDetalji, setShowDetalji] = useState(false);
  const otvoreno = 'programi';
  const [user, setUser] = useState(null);
  const [deleteProgram, setDeleteProgram] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchPrograms = async () => {
    try {
      // First get user
      const userRes = await axios.get(`${ApiConfig.baseUrl}/api/user`, { 
        withCredentials: true 
      });
      setUser(userRes.data.user);

      // Then get programs with user's school
      const programsRes = await axios.get(
        `${ApiConfig.baseUrl}/api/programs?school=${userRes.data.user.school}`, 
        { withCredentials: true }
      );
      
      setPrograms(Array.isArray(programsRes.data) ? programsRes.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDeleteProgram = async (programId) => {
    try {
      await axios.delete(`${ApiConfig.baseUrl}/api/programs/${programId}`, {
        withCredentials: true,
      });
      setPrograms(programs.filter((program) => program._id !== programId));
      setNotification({
        type: 'success',
        message: 'Program uspješno obrisan!'
      });
      setDeleteProgram(null);
    } catch (err) {
      console.error('Error deleting program:', err);
      setNotification({
        type: 'error',
        message: 'Greška pri brisanju programa'
      });
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setShowDetalji(true);
  };

  const handleUpdateProgram = (updatedProgram) => {
    setPrograms(programs.map(p => 
      p._id === updatedProgram._id ? updatedProgram : p
    ));
    setShowDetalji(false);
    setSelectedProgram(null);
  };

  return (
    <>
      <NavigacijaAdmin otvoreno={otvoreno} />
      <NavTopAdministracija naslov={'Administracija - Programi'} />
      {showDetalji && selectedProgram && (
        <ProgramDetalji
          program={selectedProgram}
          onClose={() => {
            setShowDetalji(false);
            setSelectedProgram(null);
          }}
          onUpdate={handleUpdateProgram}
        />
      )}
      {odabranoDodajProgram && user && (
        <DodajProgram
          onDodajProgram={() => {
            fetchPrograms();
            setOdabranoDodajProgram(false);
            setSelectedProgram(null);
          }}
          onCancel={() => {
            setOdabranoDodajProgram(false);
            setSelectedProgram(null);
          }}
          programToEdit={selectedProgram}
          user={user}
        />
      )}
      {deleteProgram && (
        <div className="popup">
          <div className="karticaZadatka">
            <h3>Potvrda brisanja</h3>
            <p>Jeste li sigurni da želite obrisati ovaj program?</p>
            <div className="div-radio">
              <button
                className="gumb action-btn zatvoriBtn"
                onClick={() => setDeleteProgram(null)}
              >
                Odustani
              </button>
              <button
                className="gumb action-btn abDelete"
                onClick={() => handleDeleteProgram(deleteProgram._id)}
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="main">
        <div className="sbtwn">
          <div
            className="gumb action-btn abEdit"
            onClick={() => setOdabranoDodajProgram(true)}
          >
            <Icon icon="solar:add-circle-broken" fontSize="large" /> Dodaj program
          </div>
        </div>
        <div className="tablica">
          <div className="tr naziv">
            <div className="th">Naziv programa</div>
            <div className="th"></div>
          </div>
          {programs.map((program) => (
            <div className="tr redak" key={program._id}>
              <div className="th">{program.naziv}</div>
              <div className="th">
                <button
                  className="gumb action-btn"
                  onClick={() => handleEditProgram(program)}
                >
                  <Icon icon="solar:pen-broken" />
                </button>
                <button
                  className="gumb action-btn btn delete-btn"
                  onClick={() => setDeleteProgram(program)}
                >
                  <Icon icon="solar:trash-bin-trash-broken" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
        />
      )}
    </>
  );
};

export default Programs;

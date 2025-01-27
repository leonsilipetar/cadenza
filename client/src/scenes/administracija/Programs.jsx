import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavTopAdministracija';
import DodajProgram from './DodajProgram';
import ApiConfig from '../../components/apiConfig';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [odabranoDodajProgram, setOdabranoDodajProgram] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const otvoreno = 'programi';

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/programs`, { withCredentials: true });
      setPrograms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching programs:', err);
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
    } catch (err) {
      console.error('Error deleting program:', err);
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setOdabranoDodajProgram(true);
  };

  return (
    <>
      <NavigacijaAdmin otvoreno={otvoreno} />
      <NavTopAdministracija naslov={'Administracija - Programi'} />
      {odabranoDodajProgram && (
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
        />
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
            <div className="th">Akcije</div>
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
                  className="gumb delete-btn"
                  onClick={() => handleDeleteProgram(program._id)}
                >
                  <Icon icon="solar:trash-bin-trash-broken" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Programs;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import ApiConfig from '../../components/apiConfig';
import DodajProgram from './DodajProgram';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';

const Programs = () => {
  const [odabranoDodajProgram, setOdabranoDodajProgram] = useState(false);
  const [programi, setProgrami] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'programs';

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/programs`);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleDodajProgram = () => {
    setOdabranoDodajProgram(true);
  };

  const handleCancelDodajProgram = () => {
    setOdabranoDodajProgram(false);
  };

  const handleDeleteProgram = async (id) => {
    try {
      await axios.delete(`${ApiConfig.baseUrl}/api/programs/${id}`);
      const updatedPrograms = await fetchPrograms();
      setProgrami(updatedPrograms);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrograms().then((data) => {
      setProgrami(data);
    });
  }, []);

  return (
    <>
      <NavigacijaAdmin otvoreno={otvoreno} />
      <NavTopAdministracija naslov={'Administracija - Programi'} />
      {odabranoDodajProgram && (
        <DodajProgram
          onDodajProgram={() => {
            fetchPrograms().then((data) => setProgrami(data));
            setOdabranoDodajProgram(false);
          }}
          onCancel={handleCancelDodajProgram}
        />
      )}
      <div className="main">
        <div className="sbtwn">
          <div className="gumb action-btn abEdit" onClick={handleDodajProgram}>
            <Icon icon="solar:plus-circle-broken" fontSize="large" /> Dodaj program
          </div>
        </div>
        <div className="tablica">
          <div className="tr naziv">
            <div className="th">Naziv programa</div>
            <div className="th">Cijena</div>
            <div className="th">Tip</div>
            <div className="th"></div>
          </div>
          {programi.length > 0 ? (
            programi.map((program) => (
              <div
                className={`tr redak ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                key={program._id}
              >
                <div className="th">{program.naziv}</div>
                <div className="th">{program.cijena} kn</div>
                <div className="th">{program.tip}</div>
                <div className="th">
                  <div
                    className={`action-btn btn abDelete ${isHovered ? 'hovered' : ''}`}
                    onClick={() => handleDeleteProgram(program._id)}
                    data-text="Obriši"
                  >
                    <Icon icon="solar:trash-broken" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="karticaZadatka">
              <p>Nema programa u bazi!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Programs;

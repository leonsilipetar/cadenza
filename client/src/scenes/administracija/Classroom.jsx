import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavTopAdministracija';
import DodajClassroom from './DodajClassroom';
import ApiConfig from '../../components/apiConfig';

axios.defaults.withCredentials = true;

const Classrooms = () => {
  const [odabranoDodajClassroom, setOdabranoDodajClassroom] = useState(false);
  const [classroomDetaljiOtvoreno, setClassroomDetaljiOtvoreno] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'classrooms';

  const sendRequestClassrooms = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/classrooms`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequestSchools = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/schools`, {
        withCredentials: true,
      });
      setSchools(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDodajClassroom = () => {
    setOdabranoDodajClassroom(true);
  };

  const handleCancelDodajClassroom = () => {
    setOdabranoDodajClassroom(false);
  };

  const handleDeleteClassroom = async (id) => {
    try {
      await axios.delete(`${ApiConfig.baseUrl}/api/classrooms/${id}`, {
        withCredentials: true,
      });
      const updatedClassrooms = await sendRequestClassrooms();
      setClassrooms(updatedClassrooms);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSchoolFilterChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  useEffect(() => {
    sendRequestClassrooms().then((data) => {
      setClassrooms(data);
    });
    sendRequestSchools();
  }, []);

  // Filter classrooms by selected school
  const filteredClassrooms = classrooms.filter((classroom) =>
    selectedSchool ? classroom.school === selectedSchool : true
  );

  return (
    <>
      <NavigacijaAdmin otvoreno={otvoreno} />
      <NavTopAdministracija naslov={'Administracija - Učionice'} />
      {odabranoDodajClassroom && (
        <DodajClassroom
          onDodajClassroom={() => {
            sendRequestClassrooms().then((data) => setClassrooms(data));
            setOdabranoDodajClassroom(false);
          }}
          onCancel={handleCancelDodajClassroom}
        />
      )}
      <div className="main">
        <div className="sbtwn">
          <div
            className="gumb action-btn abEdit"
            onClick={handleDodajClassroom}
          >
            <Icon icon="solar:plus-circle-broken" fontSize="large" /> Dodaj učionicu
          </div>
          <div className="filter">
            <select
              id="school-filter"
              className="input-login-signup"
              value={selectedSchool}
              onChange={handleSchoolFilterChange}
            >
              <option value="">Sve škole</option>
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="tablica">
          <div className="tr naziv">
            <div className="th">Naziv učionice</div>
            <div className="th">Škola</div>
            <div className="th"></div>
          </div>
          {filteredClassrooms.length > 0 ? (
            filteredClassrooms.map((classroom) => {
              const school = schools.find((school) => school._id === classroom.school);
              return (
                <div
                  className={`tr redak ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  key={classroom._id}
                >
                  <div className="th">{classroom.name}</div>
                  <div className="th">{school ? school.name : 'N/A'}</div>
                  <div className="th">
                    <div
                      className={`action-btn btn abDelete ${isHovered ? 'hovered' : ''}`}
                      onClick={() => handleDeleteClassroom(classroom._id)}
                      data-text="Obriši"
                    >
                      <Icon icon="solar:trash-broken" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="karticaZadatka">
              <p>Nema učionica u bazi!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Classrooms;

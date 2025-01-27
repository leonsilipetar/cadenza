import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavTopAdministracija.jsx';
import DodajRacun from './DodajRacun';
import RenderPDF from '../../components/RenderPDF';
import ApiConfig from '../../components/apiConfig';
import InvoiceSettings from './InvoiceSettings';

axios.defaults.withCredentials = true;

const RacuniAdmin = () => {
  const [odabranoDodajRacun, setOdabranoDodajRacun] = useState(false);
  const [racuni, setRacuni] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [school, setSchool] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const otvoreno = 'racuni';

  const fetchData = async () => {
    try {
      const [studentsRes, programsRes, racuniRes, schoolRes] = await Promise.all([
        axios.get(`${ApiConfig.baseUrl}/api/all-students`, { withCredentials: true }),
        axios.get(`${ApiConfig.baseUrl}/api/programs`, { withCredentials: true }),
        axios.get(`${ApiConfig.baseUrl}/api/racuni`, { withCredentials: true }),
        axios.get(`${ApiConfig.baseUrl}/api/school`, { withCredentials: true })
      ]);

      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setPrograms(Array.isArray(programsRes.data) ? programsRes.data : []);
      setRacuni(Array.isArray(racuniRes.data) ? racuniRes.data : []);
      setSchool(schoolRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateInvoice = async (data) => {
    try {
      const res = await axios.post(
        `${ApiConfig.baseUrl}/api/invoices/generate`,
        data,
        { withCredentials: true }
      );
      await fetchData(); // Refresh all data
      setOdabranoDodajRacun(false);
    } catch (err) {
      console.error("Error generating invoice:", err);
    }
  };

  const handleAddInvoiceClick = () => {
    setShowSettings(true);
  };

  const handleSettingsSaved = () => {
    setShowSettings(false);
    setOdabranoDodajRacun(true);
  };

  return (
    <>
      <NavigacijaAdmin otvoreno={otvoreno} />
      <NavTopAdministracija naslov={'Administracija - Računi'} />
      
      {showSettings && (
        <InvoiceSettings
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSaved}
        />
      )}

      {odabranoDodajRacun && (
        <div className="popup">
          <div className="popup-content">
            <DodajRacun
              students={students}
              programs={programs}
              onSubmit={handleGenerateInvoice}
              onCancel={() => setOdabranoDodajRacun(false)}
            />
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="popup" onClick={() => setSelectedInvoice(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Pregled računa</h3>
              <button className="close-btn" onClick={() => setSelectedInvoice(null)}>
                <Icon icon="solar:close-circle-broken" />
              </button>
            </div>
            <div className="popup-body">
              <RenderPDF 
                invoice={selectedInvoice}
                school={school}
                student={students.find(s => s._id === selectedInvoice.studentId)}
                program={programs.find(p => p._id === selectedInvoice.programId)}
              />
              <div className="popup-footer">
                <PDFDownloadLink
                  document={
                    <RenderPDF 
                      invoice={selectedInvoice}
                      school={school}
                      student={students.find(s => s._id === selectedInvoice.studentId)}
                      program={programs.find(p => p._id === selectedInvoice.programId)}
                    />
                  }
                  fileName={`Racun-${selectedInvoice.invoiceNumber}.pdf`}
                  className="gumb"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? 'Učitavanje...' : <><Icon icon="solar:file-download-broken" /> Preuzmi</>
                  }
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="main">
        <div className="sbtwn">
          <div className="gumb-group">
            <div
              className="gumb action-btn abEdit"
              onClick={handleAddInvoiceClick}
            >
              <Icon icon="solar:file-plus-broken" fontSize="large" /> Dodaj račun
            </div>
          </div>
        </div>
        <div className="tablica">
          <div className="tr naziv">
            <div className="th">Broj računa</div>
            <div className="th">Datum</div>
            <div className="th">Student</div>
            <div className="th mobile-none">Program</div>
            <div className="th mobile-none">Iznos</div>
            <div className="th">Akcije</div>
          </div>
          {Array.isArray(racuni) && racuni.length > 0 ? (
            racuni.map((racun) => (
              <div className="tr redak" key={racun._id}>
                <div className="th">{racun.invoiceNumber}</div>
                <div className="th">{new Date(racun.issueDate).toLocaleDateString()}</div>
                <div className="th">{`${racun.studentId?.ime} ${racun.studentId?.prezime}`}</div>
                <div className="th mobile-none">{racun.programId?.naziv}</div>
                <div className="th mobile-none">{racun.amount} EUR</div>
                <div className="th">
                  <button 
                    onClick={() => setSelectedInvoice(racun)}
                    className="gumb action-btn"
                  >
                    <Icon icon="solar:eye-broken" /> Pregledaj
                  </button>
                  <PDFDownloadLink
                    document={
                      <RenderPDF 
                        invoice={racun}
                        school={school}
                        student={students.find(s => s._id === racun.studentId)}
                        program={programs.find(p => p._id === racun.programId)}
                      />
                    }
                    fileName={`Racun-${racun.invoiceNumber}.pdf`}
                    className="gumb action-btn"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? 'Učitavanje...' : <><Icon icon="solar:file-download-broken" /> Preuzmi</>
                    }
                  </PDFDownloadLink>
                </div>
              </div>
            ))
          ) : (
            <div className="karticaZadatka">
              <p>Nema računa u bazi!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RacuniAdmin;

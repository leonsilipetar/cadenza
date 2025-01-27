import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Navigacija from './navigacija/index';
import NavTop from './nav-top/index';
import ApiConfig from '../components/apiConfig';
import RenderPDF from '../components/RenderPDF';
import InvoiceTemplate from '../components/InvoiceTemplate';

const Racuni = () => {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [school, setSchool] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'racuni';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, schoolRes, programsRes] = await Promise.all([
          axios.get(`${ApiConfig.baseUrl}/api/user`, { withCredentials: true }),
          axios.get(`${ApiConfig.baseUrl}/api/school`, { withCredentials: true }),
          axios.get(`${ApiConfig.baseUrl}/api/programs`, { withCredentials: true })
        ]);

        setUser(userRes.data.user);
        setSchool(schoolRes.data);
        setPrograms(programsRes.data);

        // If user is a student, fetch their invoices from the user data
        if (userRes.data.user.isStudent) {
          setInvoices(userRes.data.user.racuni || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleNewInvoice = (student) => {
    const studentProgram = programs.find(p => student.program?.includes(p._id));
    const selectedType = studentProgram.tipovi.find(t => t.tip === student.selectedType);

    const invoiceData = {
      studentId: student.ucenikId,
      programId: studentProgram?._id,
      month: new Date().toLocaleString('hr-HR', { month: 'long' }).toLowerCase(),
      year: new Date().getFullYear(),
      amount: selectedType ? selectedType.cijena : 0,
    };

    setPreviewInvoice({
      ...invoiceData,
      student: student,
      program: studentProgram
    });
  };

  const handleGenerateInvoice = async (data) => {
    try {
      const res = await axios.post(
        `${ApiConfig.baseUrl}/api/invoices/generate`,
        data,
        { withCredentials: true }
      );
      setInvoices(prev => [res.data, ...prev]);
      setPreviewInvoice(null);
    } catch (err) {
      console.error("Error generating invoice:", err);
    }
  };

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={"Računi"} />
      <div className="main">
        {user?.isMentor && (
          <div className="tablica">
            <div className="tr naziv">
            <div className="th">Učenik</div>
            <div></div>
          </div>
            {Array.isArray(user.students) && user.students.map((student) => (
              <div key={student._id} className={`tr redak ${isHovered ? 'hovered' : ''}`}>
                <div className="th">
                  {student.ime} {student.prezime}
                </div>
                <div className="th">
                <button 
                  className="gumb action-btn"
                  onClick={() => handleNewInvoice(student)}
                >
                  <Icon icon="solar:add-circle-broken" fontSize="large"/> Novi račun
                </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
        
        <div className="karticaZadatka">
          <div className="ikona_ime_kartica">
            {Array.isArray(invoices) && invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div className="karticaZadatka" key={invoice._id}>
                  <div className="th">Račun br. {invoice.invoiceNumber}</div>
                  <div className="th">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                  <div className="th mobile-none">{invoice.amount} EUR</div>
                  <div className="buttons">
                    <button 
                      onClick={() => setSelectedInvoice(invoice)}
                      className="gumb action-btn"
                    >
                      <Icon icon="solar:eye-broken" /> Pregledaj
                    </button>
                    <PDFDownloadLink
                      document={
                        <RenderPDF 
                          invoice={invoice}
                          school={school}
                          student={user.isStudent ? user : invoice.student}
                          program={programs.find(p => p._id === invoice.programId)}
                        />
                      }
                      fileName={`Racun-${invoice.invoiceNumber}.pdf`}
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
              <p>Nema dostupnih računa.</p>
            )}
          </div>
        </div>
      </div>

      {previewInvoice && (
        <InvoiceTemplate
          invoice={previewInvoice}
          school={school}
          student={previewInvoice.student}
          program={previewInvoice.program}
          onSend={() => handleGenerateInvoice(previewInvoice)}
          onCancel={() => setPreviewInvoice(null)}
        />
      )}

      {selectedInvoice && (
        <div className="popup" onClick={() => setSelectedInvoice(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <RenderPDF 
              invoice={selectedInvoice}
              school={school}
              student={user.isStudent ? user : selectedInvoice.student}
              program={programs.find(p => p._id === selectedInvoice.programId)}
            />
            <button 
              className="gumb cancel"
              onClick={() => setSelectedInvoice(null)}
            >
              <Icon icon="solar:close-circle-broken" /> Zatvori
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Racuni;

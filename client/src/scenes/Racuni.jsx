import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Navigacija from './navigacija/index';
import NavTop from './nav-top/index';
import ApiConfig from '../components/apiConfig';
import RenderPDF from '../components/RenderPDF';
import InvoiceTemplate from '../components/InvoiceTemplate';
import Notification from '../components/Notifikacija';

// Move UploadInvoiceModal outside main component
const UploadInvoiceModal = ({ onUpload, onCancel, selectedFile, setSelectedFile }) => (
  <div className="popup">
    <div className="div">
      <form onSubmit={onUpload}>
        <div className="form-group">
          <label>Odaberi PDF datoteku:</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              console.log('File selected:', file);
              setSelectedFile(file || null);
            }}
            required
          />
          {selectedFile && (
            <div className="selected-file">
              Odabrana datoteka: {selectedFile.name}
            </div>
          )}
        </div>
        <div className="div-radio">
          <button 
            type="button" 
            className="gumb action-btn zatvoriBtn"
            onClick={onCancel}
          >
            <Icon icon="solar:close-circle-broken" /> Odustani
          </button>
          <button 
            type="submit" 
            className="gumb action-btn spremiBtn primary-btn"
            disabled={!selectedFile}
          >
            <Icon icon="solar:upload-broken" /> Učitaj
          </button>
        </div>
      </form>
    </div>
  </div>
);

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const Racuni = () => {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [school, setSchool] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'racuni';
  const [notification, setNotification] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingStudent, setUploadingStudent] = useState(null);
  const [selectedStudentInvoices, setSelectedStudentInvoices] = useState(null);

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

        // If user is a student, fetch their invoices
        if (userRes.data.user.isStudent) {
          const invoicesRes = await axios.get(
            `${ApiConfig.baseUrl}/api/invoices/user/${userRes.data.user._id}`,
            { withCredentials: true }
          );
          setInvoices(invoicesRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleNewInvoice = (student) => {
    const studentProgram = programs.find(p => student.program?.includes(p._id));
    
    if (!studentProgram) {
      setNotification({
        type: 'error',
        message: 'Učenik nema dodijeljen program'
      });
      return;
    }

    // Initialize with basic data, price will be set when type is selected
    const invoiceData = {
      studentId: student.ucenikId,
      programId: studentProgram._id,
      month: new Date().toLocaleString('hr-HR', { month: 'long' }).toLowerCase(),
      year: new Date().getFullYear(),
      amount: 0,
    };

    setPreviewInvoice({
      ...invoiceData,
      student: student,
      program: studentProgram
    });
  };

  const handleProgramTypeSelect = (type) => {
    const program = previewInvoice.program;
    const selectedTypeData = program.tipovi.find(t => t.tip === type);
    
    if (selectedTypeData) {
      setSelectedType(type);
      setPreviewInvoice(prev => ({
        ...prev,
        amount: selectedTypeData.cijena,
        programType: type
      }));
    }
  };

  const handleGenerateInvoice = async (data) => {
    try {
      if (!data.programType) {
        setNotification({
          type: 'error',
          message: 'Molimo odaberite tip programa'
        });
        return;
      }

      const res = await axios.post(
        `${ApiConfig.baseUrl}/api/invoices/generate`,
        data,
        { withCredentials: true }
      );
      setInvoices(prev => [res.data, ...prev]);
      setPreviewInvoice(null);
      setSelectedType(null);
      setNotification({
        type: 'success',
        message: 'Račun uspješno generiran'
      });
    } catch (err) {
      console.error("Error generating invoice:", err);
      setNotification({
        type: 'error',
        message: 'Greška pri generiranju računa'
      });
    }
  };

  const handleFileUpload = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadingStudent) {
      console.log('Missing file or student:', { selectedFile, uploadingStudent });
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    formData.append('studentId', uploadingStudent.ucenikId);
    formData.append('month', new Date().toLocaleString('hr-HR', { month: 'long' }).toLowerCase());
    formData.append('year', new Date().getFullYear().toString());

    try {
      console.log('Uploading file...', selectedFile);
      const response = await axios.post(
        `${ApiConfig.baseUrl}/api/invoices/upload-pdf-invoice`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload response:', response.data);
      setInvoices(prev => [response.data, ...prev]);
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadingStudent(null);
      setNotification({
        type: 'success',
        message: 'Račun uspješno učitan'
      });
    } catch (error) {
      console.error('Error uploading invoice:', error);
      setNotification({
        type: 'error',
        message: 'Greška pri učitavanju računa'
      });
    }
  }, [selectedFile, uploadingStudent]);

  const handleCancelUpload = useCallback(() => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadingStudent(null);
  }, []);

  const handleViewPdf = (invoice) => {
    if (invoice.pdfData && invoice.pdfData.data) {
      const base64 = arrayBufferToBase64(invoice.pdfData.data.data);
      const blob = new Blob(
        [Uint8Array.from(atob(base64), c => c.charCodeAt(0))],
        { type: invoice.pdfData.contentType }
      );
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      // Fall back to generated PDF
      setSelectedInvoice(invoice);
    }
  };

  const fetchStudentInvoices = async (studentId) => {
    try {
      const response = await axios.get(
        `${ApiConfig.baseUrl}/api/invoices/user/${studentId}`,
        { withCredentials: true }
      );
      setSelectedStudentInvoices({
        student: user.students.find(s => s.ucenikId === studentId),
        invoices: response.data
      });
    } catch (error) {
      console.error('Error fetching student invoices:', error);
      setNotification({
        type: 'error',
        message: 'Greška pri dohvaćanju računa'
      });
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
                  <div className="div-radio">
                    <button
                      className="gumb action-btn spremiBtn"
                      onClick={() => {
                        setUploadingStudent(student);
                        setShowUploadModal(true);
                      }}
                    >
                      <Icon icon="solar:upload-broken" /> Učitaj
                    </button>
                    <button
                      className="gumb action-btn"
                      onClick={() => fetchStudentInvoices(student.ucenikId)}
                    >
                      <Icon icon="solar:document-broken" /> Računi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {user && user.isStudent && (
          <div className='karticaZadatka'>
          <div className="tablica">
            <div className="tr naziv">
              <div className="th">Račun</div>
              <div></div>
            </div>
            {Array.isArray(invoices) && invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div className="tr redak" key={invoice._id}>
                  <div className="th">Račun br. {invoice.invoiceNumber}</div>
                  <div className="th">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                  <div className="th mobile-none">{invoice.amount} EUR</div>
                  <div className="th">
                    <button 
                      onClick={() => handleViewPdf(invoice)}
                      className="gumb action-btn spremiBtn"
                    >
                      <Icon icon="solar:eye-broken" /> Pregledaj
                    </button>
                    {invoice.pdfData && invoice.pdfData.data ? (
                      <a
                        href={`data:${invoice.pdfData.contentType};base64,${arrayBufferToBase64(invoice.pdfData.data.data)}`}
                        download={invoice.pdfData.originalName || `Racun-${invoice.invoiceNumber}.pdf`}
                        className="gumb action-btn"
                      >
                        <Icon icon="solar:file-download-broken" /> Preuzmi
                      </a>
                    ) : (
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
                        {({ loading }) => 
                          loading ? 'Učitavanje...' : <><Icon icon="solar:file-download-broken" /> Preuzmi</>
                        }
                      </PDFDownloadLink>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Nema dostupnih računa.</p>
            )}
        </div>
        </div>
        )}
        
      </div>

      {previewInvoice && (
        <InvoiceTemplate
          invoice={previewInvoice}
          school={school}
          student={previewInvoice.student}
          program={previewInvoice.program}
          selectedType={selectedType}
          onTypeSelect={handleProgramTypeSelect}
          onSend={() => handleGenerateInvoice(previewInvoice)}
          onCancel={() => {
            setPreviewInvoice(null);
            setSelectedType(null);
          }}
        />
      )}

      {selectedInvoice && (
        <div className="popup" onClick={() => setSelectedInvoice(null)}>
          <div className="div-radio" onClick={e => e.stopPropagation()}>
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

      {showUploadModal && (
        <UploadInvoiceModal
          onUpload={handleFileUpload}
          onCancel={handleCancelUpload}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}

      {selectedStudentInvoices && (
        <div className="popup">
          <div className="div div-racun">
            <div className="div-radio">
              <h3>Računi - {selectedStudentInvoices.student.ime} {selectedStudentInvoices.student.prezime}</h3>
            <button className="gumb action-btn zatvoriBtn" onClick={() => setSelectedStudentInvoices(null)}>
                <Icon icon="solar:close-circle-broken" />
                Zatvori
              </button>
            </div>
            
            <div className="tablica">
            <div className="tr naziv">
              <div className="th">Račun</div>
              <div></div>
            </div>
              {selectedStudentInvoices.invoices.length > 0 ? (
                selectedStudentInvoices.invoices.map((invoice) => (
                  <div className="tr redak" key={invoice._id}>
                    <div className="th">Račun br. {invoice.invoiceNumber}</div>
                    <div className="th">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                    <div className="th">
                      <button 
                        onClick={() => handleViewPdf(invoice)}
                        className="gumb action-btn zatvoriBtn"
                      >
                        <Icon icon="solar:eye-broken" /> Pregledaj
                      </button>
                      {invoice.pdfData && invoice.pdfData.data ? (
                        <a
                          href={`data:${invoice.pdfData.contentType};base64,${arrayBufferToBase64(invoice.pdfData.data.data)}`}
                          download={invoice.pdfData.originalName || `Racun-${invoice.invoiceNumber}.pdf`}
                          className="gumb action-btn"
                        >
                          <Icon icon="solar:file-download-broken" /> Preuzmi
                        </a>
                      ) : (
                        <PDFDownloadLink
                          document={
                            <RenderPDF 
                              invoice={invoice}
                              school={school}
                              student={selectedStudentInvoices.student}
                              program={programs.find(p => p._id === invoice.programId)}
                            />
                          }
                          fileName={`Racun-${invoice.invoiceNumber}.pdf`}
                          className="gumb action-btn"
                        >
                          {({ loading }) => 
                            loading ? 'Učitavanje...' : <><Icon icon="solar:file-download-broken" /> Preuzmi</>
                          }
                        </PDFDownloadLink>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className='div'><p>Nema dostupnih računa :().</p></div>
              )}
            </div>
            
          </div>
            
        </div>
      )}

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
        />
      )}
    </>
  );
};

export default Racuni;

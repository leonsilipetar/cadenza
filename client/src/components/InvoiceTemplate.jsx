import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Icon } from '@iconify/react';

const InvoiceTemplate = ({ invoice, school, student, program, onSend, onCancel }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <h3>Pregled računa</h3>
          <button className="close-btn" onClick={onCancel}>
            <Icon icon="solar:close-circle-broken" />
          </button>
        </div>
        <div className="popup-body">
          <div className="preview-container">
            {/* Preview of the invoice */}
            <div className="invoice-preview">
              <div className="header">
                <div className="school-info">
                  <h4>{school?.naziv}</h4>
                  <p>{school?.adresa}</p>
                  <p>OIB: {school?.oib}</p>
                </div>
                <div className="invoice-info">
                  <h4>RAČUN br. {invoice.invoiceNumber}</h4>
                  <p>Datum: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="student-info">
                <h4>{student?.ime} {student?.prezime}</h4>
                <p>{student?.adresa?.ulica} {student?.adresa?.kucniBroj}</p>
                <p>{student?.adresa?.mjesto}</p>
                <p>OIB: {student?.oib}</p>
              </div>
              <div className="program-info">
                <table>
                  <thead>
                    <tr>
                      <th>Program</th>
                      <th>Razdoblje</th>
                      <th>Iznos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{program?.naziv}</td>
                      <td>{invoice.month}/{invoice.year}</td>
                      <td>{program?.cijena} EUR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="popup-footer">
            <button className="gumb" onClick={onSend}>
              <Icon icon="solar:file-check-broken" /> Pošalji
            </button>
            <button className="gumb cancel" onClick={onCancel}>
              <Icon icon="solar:close-circle-broken" /> Odustani
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate; 
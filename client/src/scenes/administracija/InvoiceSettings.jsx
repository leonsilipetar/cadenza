import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import ApiConfig from '../../components/apiConfig';

const InvoiceSettings = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nazivObrta: '',
    oib: '',
    iban: '',
    brojRacuna: '',
    dodatneInformacije: '',
    adresa: {
      ulica: '',
      kucniBroj: '',
      mjesto: '',
      postanskiBroj: ''
    }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${ApiConfig.baseUrl}/api/invoice-settings`,
          { withCredentials: true }
        );
        if (response.data) {
          setFormData(prevData => ({
            ...prevData,
            ...response.data,
            adresa: response.data.adresa || {
              ulica: '',
              kucniBroj: '',
              mjesto: '',
              postanskiBroj: ''
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching invoice settings:', err);
        setError('Greška pri dohvaćanju postavki računa');
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        `${ApiConfig.baseUrl}/api/invoice-settings`,
        formData,
        { withCredentials: true }
      );

      if (response.data) {
        onSave(response.data);
      }
    } catch (err) {
      console.error('Error saving invoice settings:', err);
      setError(err.response?.data?.error || 'Greška pri spremanju postavki računa');
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <h2>Postavke računa</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="div">
          <label>Naziv obrta:</label>
          <input
            className="input-login-signup"
            type="text"
            value={formData.nazivObrta}
            onChange={(e) => setFormData({ ...formData, nazivObrta: e.target.value })}
            required
          />
        </div>

        <div className="div">
          <label>OIB:</label>
          <input
            className="input-login-signup"
            type="text"
            value={formData.oib}
            onChange={(e) => setFormData({ ...formData, oib: e.target.value })}
            required
          />
        </div>

        <div className="div">
          <label>IBAN:</label>
          <input
            className="input-login-signup"
            type="text"
            value={formData.iban}
            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
            required
          />
        </div>

        <div className="div">
          <label>Adresa:</label>
          <input
            className="input-login-signup"
            type="text"
            placeholder="Ulica"
            value={formData.adresa.ulica}
            onChange={(e) => setFormData({
              ...formData,
              adresa: { ...formData.adresa, ulica: e.target.value }
            })}
            required
          />
        </div>

        <div className="div">
          <label>Kućni broj:</label>
          <input
            className="input-login-signup"
            type="text"
            value={formData.adresa.kucniBroj}
            onChange={(e) => setFormData({
              ...formData,
              adresa: { ...formData.adresa, kucniBroj: e.target.value }
            })}
            required
          />
        </div>

        <div className="div">
          <label>Mjesto:</label>
          <input
            className="input-login-signup"
            type="text"
            value={formData.adresa.mjesto}
            onChange={(e) => setFormData({
              ...formData,
              adresa: { ...formData.adresa, mjesto: e.target.value }
            })}
            required
          />
        </div>

        <div className="div">
          <label>Poštanski broj:</label>
          <input
            className="input-login-signup"
            type="text"
            value={formData.adresa.postanskiBroj}
            onChange={(e) => setFormData({
              ...formData,
              adresa: { ...formData.adresa, postanskiBroj: e.target.value }
            })}
            required
          />
        </div>

        <div className="div">
          <label>Dodatne informacije:</label>
          <textarea
            className="input-login-signup"
            value={formData.dodatneInformacije}
            onChange={(e) => setFormData({ ...formData, dodatneInformacije: e.target.value })}
            rows={4}
            placeholder="Npr. Način plaćanja, rok plaćanja, napomene..."
          />
        </div>

        <div className="div-radio">
          <button 
            type="button" 
            className="gumb action-btn zatvoriBtn" 
            onClick={onClose}
          >
            <Icon icon="solar:close-circle-broken" /> Odustani
          </button>
          <button 
            type="submit" 
            className="gumb action-btn spremiBtn"
          >
            <Icon icon="solar:disk-circle-broken" /> Spremi
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceSettings; 
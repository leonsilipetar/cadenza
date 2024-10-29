import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import ApiConfig from '../components/apiConfig';

axios.defaults.withCredentials = true;

const Racuni = () => {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const otvoreno = 'racuni';

  // Funkcija za slanje zahteva
  const sendRequest = async () => {
    if (!user) {
      console.error("User is null, cannot fetch invoices");
      return []; // Vraćanje praznog niza ako user nije postavljen
    }

    try {
      const userId = user._id; // Ovo će raditi sada jer proveravamo user
      const res = await axios.get(`${ApiConfig.baseUrl}/api/users/${userId}/invoices`, {
        withCredentials: true,
      });

      if (!Array.isArray(res.data)) {
        console.error("Expected an array of invoices but got:", res.data);
        return []; // Vraćanje praznog niza ako je odgovor pogrešan
      }

      return res.data;
    } catch (err) {
      console.error("Error fetching invoices:", err);
      return []; // Vraćanje praznog niza ako dođe do greške
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
          withCredentials: true,
        });
        const userData = userRes.data.user; // Pravilno postavljanje korisnika
        console.log("Fetched user data:", userData); // Prikaz korisnika
        setUser(userData); // Postavljanje korisnika
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchData();
  }, []);

  // Novi useEffect za dohvat računa kada se korisnik postavi
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return; // Izbegavajte slanje zahteva ako user nije postavljen

      const invoicesData = await sendRequest();
      setInvoices(invoicesData);
    };

    fetchInvoices();
  }, [user]); // Praćenje promena `user`

  const openInvoice = (invoiceId) => {
    window.open(`${ApiConfig.baseUrl}/api/download/${invoiceId}`, '_blank');
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/download/${invoiceId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading invoice:", err);
    }
  };

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={"Računi"} />
      <div className="main">
        <div className="karticaZadatka">
          <div className="ikona_ime_kartica">
            {Array.isArray(invoices) && invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div className="karticaZadatka" key={invoice._id}>
                  <div className="th">Račun za {invoice.month}</div>
                  <div className="th">{new Date(invoice.date).toLocaleDateString()}</div>
                  <div className="th mobile-none">{invoice.total} EUR</div>
                  <div className="buttons">
                    <button onClick={() => openInvoice(invoice._id)} className="gumb action-btn">Otvori</button>
                    <button onClick={() => downloadInvoice(invoice._id)} className="gumb action-btn">Preuzmi</button>
                  </div>
                </div>
              ))
            ) : (
              <p>{invoices.length === 0 ? "Nema dostupnih računa." : "Greška pri dohvaćanju računa."}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Racuni;

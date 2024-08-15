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

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user/invoices`, {
        withCredentials: true
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
          withCredentials: true
        });
        const userData = userRes.data.user;
        setUser(userData);

        // Fetch invoices
        const invoicesData = await sendRequest();
        setInvoices(invoicesData);
      } catch (err) {
        console.error('Error fetching user or invoices:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={"Računi"} />
      <div className="main">
        <div className="karticaZadatka">
          <div className="ikona_ime_kartica">
          {Array.isArray(invoices) && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <div className="tr redak" key={invoice._id}>
                <div className="th">{invoice.invoiceNumber}</div>
                <div className="th">{new Date(invoice.date).toLocaleDateString()}</div>
                <div className="th mobile-none">{invoice.total}</div>
              </div>
            ))
          ) : (
            <div className="karticaZadatka">
              <p>Nema računa u bazi!</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Racuni;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from '../navigacija';
import NavTop from '../nav-top';
import ApiConfig from '../../components/apiConfig.js';

axios.defaults.withCredentials = true;

const Naslovna = () => {
  const [user, setUser] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  console.log(searchResults)

  const otvoreno = 'naslovna';

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
  
    // Check if query length is less than 2 characters
    if (query.length < 2) {
      setSearchResults([]); // Clear search results or keep previous results (based on desired behavior)
      return; // Exit the function to avoid making an API call
    }
  
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/users`, { query });
      setSearchResults(res.data.results);
    } catch (error) {
      console.error('Error searching users and mentors:', error);
      setSearchResults([]); // Set search results to an empty array in case of error
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
    });
  }, []);

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={'Naslovna'} />
      <div className="main">
        <div className="karticaZadatka">
          <input
            className="input-login-signup "
            type="text"
            placeholder="Pretraži korisnike..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults && searchResults.length > 0 && (
            searchResults.map((result) => (
              <div key={result._id} className="search-result-item">
                <div>
                <p>{result.ime} {result.prezime}</p>
                <p className='txt-min'>{result.uloga}</p>
                </div>
                <div>
                  <p>funkcije</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Naslovna;

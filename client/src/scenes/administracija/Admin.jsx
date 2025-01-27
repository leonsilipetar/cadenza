import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavTopAdministracija';
import ApiConfig from '../../components/apiConfig.js';


axios.defaults.withCredentials = true;
const Admin = () => {

  const [user, setUser] = useState();
  const otvoreno = "naslovna";

  const sendRequest = async () => {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
  }

  const refreshToken = async () => {
      const res = await axios
        .get(`${ApiConfig.baseUrl}/api/refresh`, {
          withCredentials: true,
        })
        .catch((err) => console.log(err));
  
      const data = await res.data;
      return data;
    };
    
    


    useEffect(() => {

      
        sendRequest().then((data) => {
          setUser(data.user)
        });

    }, []);
    
    return (
      <>
      <NavigacijaAdmin user={user} otvoreno={otvoreno}/>
      <NavTopAdministracija user={user} naslov={"Administracija - naslovna"}/>
      <div className="main">

  <div className="karticaZadatka">
    <div className="ikona_ime_kartica">
      <i className='acc'>
        Administracija aplikacije
      </i>

      <p className='p'>Administracija je dio aplikacije predviđen uvidu u bazu podataka aplikacije kao što su dodavanje novih učenika i mentora te uređivanje istih.</p>


      <i className='acc'>Dodavanje učenika i mentora:</i>

      <p className='p'>Trenutno se u formi za novog učenika nalaze polja koja su se nalazila na upisnici.</p>
      <div className="p">Polja i njihove vrijednosti se mogu naknadno uređivati, dodavati i micati po potrebi u samoj bazi podataka (<a className='acc' href="https://www.mongodb.com/atlas" target="_blank" rel="noopener noreferrer">MongoDB Atlas</a>). Neka polja, kao što su mentor i učenici, će imati svoje padajuće izbornike ili funkciju pretraživanja putem kojih će biti moguće dodati učenike u bazu podataka za pojedinog mentora i mentore u bazu učenika.</div>
      <div className="p">Dodavanje će biti moguće prilaganjem (uploadanjem) xml ili excel datoteke u kojoj su korisnici s određenim atributima već prisutni. Postojeću bazu podataka ili bazu u aplikaciji biti će potrebno prilagoditi stvarnim vrijednostima i atributima.</div>


      <i className='acc'>Uređivanje podataka:</i>

      <div className="p">Uređivanje podataka se obavlja pomoću forme za pregled i uređivanje koja je dostupna pored osnovnih podataka u tablici za učenike i tablici za mentore klikom na gumb "više".</div>
      <div className="p">Sama forma učitava postojeće podatke te omogućuje i promjenu te spremanje promjene.</div>
      <br />

      <i>Uloga u sutavu:</i>

      <div className="p">Uloga u sustavu predstavlja način osiguravanja pravilnog učitavanja i pregleda podataka u aplikcaiji kao i način osiguravanja dostupnosti pojedninih funkcionalnosti i podataka aplikacije.</div>
      <div className="p">
        <i>Učenici:</i><br></br>
        --Učenici mogu pregledavati glavno sučelje aplikacije te nemaju mogućnost pristupiti sučelju "Administracije". Oni mogu vidjeti svoje podatke u kartici Profil, pregledavati raspored (trenutno dostupna samo teorija), vidjeti račune (moguće dodati funkcionalnost), otvoriti Chat (u fazi izrade), te će moći vidjeti raspored za današnji dan (ukoliko postoji) i za dan koji slijedi uz još opcionalnih funkcija u kartici Naslovna.
        <br></br>
        <br></br>
        <i>Mentori:</i><br />
        --Mentori mogu pristupiti glavnom sučelju aplikacije koja nalikuje na onu za učenike te će moći dodavati učenike u grupe za Chat i Raspored gdje će dodavati i uređivati raspored za svakog učenika te će i sami moći vidjeti raspored za cijeli tjedan.
      </div>
      <br></br>
      <i className='acc'>Atribut mentora - ADMINISTRATORA:</i>
      <br />
      Administrator (u bazi označen sa "isAdmin": true) može vidjeti sučelje Administracije, pristupiti učenicima i mentorima (njihovim podacima). Moguće je dodijeliti ulogu administratora (postaviti na "true") ili ju maknuti (postaviti na "false") tijekom dodavanja ili uređivanja mentora. Učenicima se atribut može dodati isključivo preko baze podataka (MongoDB Atlas).
    </div>
    <br />
    

    <i className='acc'>Brisanje korisnika:</i>

    <div className="p">Brisanje se trenutno vrši preko sučelja baze podataka <a className='acc' href="https://www.mongodb.com/atlas" target="_blank" rel="noopener noreferrer">MongoDB Atlas</a> u kojoj su podaci podijeljeni na tablice (users, mentors, ...). Funkcionalnost je moguće dodati i u samu aplikaciju.</div>
  </div>
</div>
      </>
    )
}

export default Admin;
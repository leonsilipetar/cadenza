import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";


axios.defaults.withCredentials = true;
const RasporedDan = () => {
    
    return (
        <div className='dan'>
            <div className="nazivDana">Ponedjeljak</div>
            <div className="termin">
              <div className="dvorana">učionica 1</div>
              <div className="vrijeme">08:00 - 09:00</div>
              <div className="rasporedMentor">Ime prezime</div>
            </div>
        </div>
    )
}

export default RasporedDan;
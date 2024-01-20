import { useState } from "react";
import '../../App.css';
import axios from 'axios';
import { Icon } from '@iconify/react';
axios.defaults.withCredentials = true;

const NavSideRaspored = () => {
    return (
        <>
        <div className="raspored-lista">
            {/*Gumb dodaj učenika */}
            <div className="sbtwn">
                <div
                className="gumb action-btn abEdit"
                >
                    <Icon icon="solar:user-plus-broken" fontSize="large" /> Dodaj učenika
                </div>
            </div>
            {/*POPIS rasporeda učenika */}
            <div className="rl-items">
                <div className="rl">Učenik1</div>
                <div className="rl">Učenik2</div>
                <div className="rl">Učenik3</div>
            </div>
        </div>
        </>
    )
}

export default NavSideRaspored;
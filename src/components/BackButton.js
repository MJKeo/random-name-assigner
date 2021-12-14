import React from 'react';
import { useNavigate } from 'react-router';
import '../css/Button.css';
import BackBtn from "../images/back-arrow.png";

export const BackButton = () => {
    let navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <img className="back-btn" src={BackBtn} alt="back" onClick={goBack} />
    )
}
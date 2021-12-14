import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

export const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="fill centered flex-column">
            <h1 className="title black no-margin login-title">Random Name Picker</h1>
            <PrimaryButton className="login-btn" text="Join Room" onClick={() => navigate("/join-room")}/>
            <SecondaryButton className="login-btn" text="Create Room" onClick={() => navigate("/create-room")}/>
        </div>
    );
}
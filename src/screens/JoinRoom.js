import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Room.css';
import { TextBox } from '../components/TextBox';
import { PrimaryButton } from '../components/PrimaryButton';
import { joinRoom } from '../backend/client.js';
import { BackButton } from '../components/BackButton';

export const JoinRoom = () => {
    let [ name, setName ] = useState("");
    let [ roomCode, setCode ] = useState("");
    const navigate = useNavigate();

    function codeUpdated(newCode) {
        // code must be up to 6 digits
        if (newCode.length > 6) {
            return;
        }
        // all letters will be capitalized, and only accepts alphanumeric
        let adjustedCode = newCode.toUpperCase().replaceAll(new RegExp('[^A-Z0-9]', 'g'), "");
        // save it
        setCode(adjustedCode)
    }

    function nameDidChange(newName) {
        // name can be up to 15 digits
        if (newName.length > 15) {
            return;
        }
        // all letters will be capitalized, and only accepts alphanumeric
        let adjustedName = newName.toUpperCase().replaceAll(new RegExp('[^A-Z ]', 'g'), "");
        setName(adjustedName);
    }

    function joinRoomClicked() {
        console.log("Attempting to join room with code " + roomCode);
        joinRoom(roomCode, name);
        navigate("/lobby");
    }

    return (
        <div className="fill centered flex-column">
            <BackButton />
            <h1 className="title black no-margin room-title">Join a Room</h1>
            <TextBox className="room-textbox" text={name} title="Name" placeholder="Enter your name" onChange={nameDidChange}/>
            <TextBox className="room-textbox" text={roomCode} title="Room Code" placeholder="Enter 6-digit code" onChange={codeUpdated}/>
            <PrimaryButton className="room-btn" isActive={name.length > 0 && roomCode.length === 6} text="Join Room" onClick={joinRoomClicked}/>
        </div>
    );
}
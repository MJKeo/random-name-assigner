import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Room.css';
import { TextBox } from '../components/TextBox';
import { PrimaryButton } from '../components/PrimaryButton';
import { createRoom } from '../backend/client.js';
import { BackButton } from '../components/BackButton';

export const CreateRoom = () => {
    let [ name, setName ] = useState("");
    const navigate = useNavigate();

    function nameDidChange(newName) {
        // name can be up to 15 digits
        if (newName.length > 15) {
            return;
        }
        // all letters will be capitalized, and only accepts alphanumeric
        let adjustedName = newName.toUpperCase().replaceAll(new RegExp('[^A-Z ]', 'g'), "");
        setName(adjustedName);
    }

    function createRoomClicked() {
        console.log("Attempting to create room");
        createRoom(name);
        navigate("/lobby");
    }

    return (
        <div className="fill centered flex-column">
            <BackButton />
            <h1 className="title black no-margin room-title">Create a Room</h1>
            <TextBox className="room-textbox" text={name} title="Name" placeholder="Enter your name" onChange={nameDidChange}/>
            <PrimaryButton className="room-btn" isActive={name.length > 0} text="Create Room" onClick={createRoomClicked}/>
        </div>
    );
}
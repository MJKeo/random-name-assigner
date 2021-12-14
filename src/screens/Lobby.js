import React, { useEffect, useState } from 'react';
import '../css/Lobby.css';
import { PrimaryButton } from '../components/PrimaryButton';
import gameState from '../backend/gameState';
import { leaveRoom } from '../backend/client';
import { useNavigate } from 'react-router';
import { BackButton } from '../components/BackButton';
import { startRoom } from '../backend/client.js';

export const Lobby = () => {
    let [ clients, setClients ] = useState([]);
    let navigate = useNavigate();

    // this is for mounting
    useEffect(() => {
        gameState.onUpdate = () => {
            // check if room has been ended
            if (gameState.roomState === null) {
                // leave back to main page
                navigate("/");
            } else if (gameState.assignedName !== null) {
                // we have been assigned a name so let's go to the next page
                navigate("/assign-name")
            } else {
                // update rooms
                setClients(gameState.roomState?.clients ?? []);
            }
        }
    });

    // unmounting
    useEffect(() => {
        return function cleanup() {
            leaveRoom();
        }
    }, []);

    function start() {
        startRoom();
    }

    const content = gameState?.isHost 
        ? <PrimaryButton className="lobby-start-btn" isActive={gameState.roomState?.clients?.length > 2} text={"Start"} onClick={start} />
        : <h1 className="text-large black lobby-waiting-text">{gameState.isHost ? "Host" : "Waiting for host..."}</h1>
    return (
        <div className="fill centered flex-column">
            <BackButton />
            <h1 className="lobby-code subtitle center-text black">Room Code: {gameState.roomState?.id}</h1>
            <div className="lobby-player-div">
                <h1 className="indented subtitle no-margin black">Players</h1>
                <div className="lobby-player-underline"></div>
                {
                    clients.map(client => {
                        return <h1 key={client.name} className="text-large no-margin blue lobby-player">{client.name}</h1>;
                    })
                }
            </div>
            {content}
        </div>
    );
}
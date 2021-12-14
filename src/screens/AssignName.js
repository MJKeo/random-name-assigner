import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PrimaryButton } from '../components/PrimaryButton';
import '../css/AssignName.css';
import Hat from "../images/santa-hat.png";
import gameState from '../backend/gameState';

export const AssignName = () => {
    let [ animationStarted, setAnimationStarted ] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        setTimeout(startAnimation, 1000);
    })

    function startAnimation() {
        setAnimationStarted(true);
    }

    function leave() {
        gameState.assignedName = null;
        navigate("/")
    }

    return (
        <div className="fill centered flex-column an-main-div">
            <h1 className={`text-large black an-text ${animationStarted ? "appear" : "" }`}>{gameState.assignedName ?? "Error"}</h1>
            <img id="santa-hat" className={`santa-hat ${animationStarted ? "flip-move-down" : "" }`} src={Hat} alt="ho ho ho" />
            <PrimaryButton className={`an-back ${animationStarted ? "appear-delayed" : "" }`} text="Back to Home" 
                onClick={leave}/>
        </div>
    );
}
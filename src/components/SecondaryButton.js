import React from 'react';
import '../css/Button.css';

export const SecondaryButton = (props) => {
    return (
        <div className={`${props.className} btn secondary${(props.isActive ?? true) ? " clickable white-bg blue" : "-inactive light-gray-bg dark-gray"} `}
            onClick={() => {
                if ((props.isActive ?? true) && props.onClick !== undefined) {
                    props.onClick();
                }
            }}>
            <h1 className="text-medium no-margin">{props.text}</h1>
        </div>
    )
}
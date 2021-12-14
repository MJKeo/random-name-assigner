import React from 'react';
import '../css/Button.css';

export const PrimaryButton = (props) => {
    return (
        <div className={`${props.className} btn ${(props.isActive ?? true) ? "clickable white blue-bg" : "light-gray dark-gray-bg"}`}
            onClick={() => {
                if ((props.isActive ?? true) && props.onClick !== undefined) {
                    props.onClick();
                }
            }}>
            <h1 className="text-medium no-margin">{props.text}</h1>
        </div>
    )
}
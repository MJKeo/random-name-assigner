import React from 'react';
import '../css/TextBox.css';

export const TextBox = (props) => {

    return (
        <div className={`${props.className} flex-column`}>
            <h1 className="no-margin textbox-title">{props.title}</h1>
            <input className="textbox-main text-large" type="text" value={props.text} placeholder={props.placeholder} 
                    onChange={(e) => props.onChange(e.target.value)} />
        </div>
    )
}
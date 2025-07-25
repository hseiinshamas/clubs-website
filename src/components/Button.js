import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';


const STYLES = ['btn--primary', 'btn--outline']; // this is an array of styles
const SIZES = ['btn--medium', 'btn--large'];  // this is an array of sizes
export const Button = ({children, type, onClick, buttonStyle, buttonSize, to}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        <Link to={to} className='btn-mobile'>
        <button
            className={`btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick}
            type ={type}
            >

        {children}
        </button>

        </Link> 
    )
    
};
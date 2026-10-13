import React from "react";

const ButtonOne = ({ children, className, onClick }) => {
    return (
        <button className={`${className} btn-gold`} onClick={onClick}>
            {children}
        </button>
    );
};

export default ButtonOne;

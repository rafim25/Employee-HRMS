import React from "react";

const ButtonThree = ({ children, className, onClick }) => {
    return (
        <button className={`${className} btn-outline`} onClick={onClick}>
            {children}
        </button>
    );
};

export default ButtonThree;

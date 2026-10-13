import React from "react";

const ButtonTwo = ({ children, className, onClick }) => {
    return (
        <button className={`${className} inline-flex items-center justify-center gap-2 rounded-full bg-danger py-2.5 px-8 text-center font-semibold text-white hover:bg-opacity-90`} onClick={onClick}>
            {children}
        </button>
    );
};

export default ButtonTwo;

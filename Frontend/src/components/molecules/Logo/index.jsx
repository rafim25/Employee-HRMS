import React from 'react';
import logoImage from '../../../Assets/images/logo.png'; // Make sure to add the logo image to this path

const Logo = () => {
    return (
        <div className="flex items-center justify-center">
            <img 
                src={logoImage} 
                alt="Raghav Elite Projects Logo" 
                className="h-20 object-contain"
                style={{ maxWidth: '300px' }}
            />
        </div>
    );
};

export default Logo; 
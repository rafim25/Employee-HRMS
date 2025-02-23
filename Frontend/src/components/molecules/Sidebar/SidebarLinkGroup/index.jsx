import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarLinkGroup = ({ children, activeCondition }) => {
    const location = useLocation();
    const [open, setOpen] = useState(activeCondition);

    useEffect(() => {
        setOpen(activeCondition);
    }, [activeCondition, location]);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <li>
            {children(handleClick, open)}
        </li>
    );
};

export default SidebarLinkGroup;

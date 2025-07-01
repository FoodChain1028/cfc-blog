import React from 'react';

const Tag = ({ name, color, onClick, isSelected = false }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(name);
        }
    };

    return (
        <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 mr-2 mb-2 border ${isSelected
                ? 'bg-secondary text-primary border-secondary'
                : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                }`}
            onClick={handleClick}
        >
            {name}
        </span>
    );
};

export default Tag; 
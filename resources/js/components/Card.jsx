import React from 'react';

const Card = ({ title, value }) => (
    <div className="p-6 bg-white rounded-lg shadow-lg">
        <h6 className="font-semibold text-lg">{title}</h6>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

export default Card;

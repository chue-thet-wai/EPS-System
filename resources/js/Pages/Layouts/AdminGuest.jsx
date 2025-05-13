import React from 'react';

const AdminGest = ({ children }) => {
    return (
        <div className="gest-layout">
            <main>{children}</main>
        </div>
    );
};

export default AdminGest;

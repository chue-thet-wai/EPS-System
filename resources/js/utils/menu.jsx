import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { FaPassport, FaUser ,FaUserCheck  } from 'react-icons/fa';
import { BsBoxSeam, BsFillPersonBadgeFill  } from 'react-icons/bs';
import { RiDashboardLine } from 'react-icons/ri';

export const links = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'Dashboard',
                route: 'dashboard',
                icon: <RiDashboardLine />, 
            },
        ],
    },

    {
        title: 'Setup',
        links: [
            {
                name: 'Categories',
                route: 'categories',
                permission: 'View Categories',
                icon: <BsBoxSeam />, 
            }
        ],
    },
    {
        title: 'Management',
        links: [
            {
                name: 'Roles',
                route: 'roles',
                permission: 'View Roles',
                icon: <BsFillPersonBadgeFill  />,
            },
            {
                name: 'Users',
                route: 'users',
                permission: 'View Users',
                icon: <FiUsers />, 
            },
            {
                name: 'Services',
                route: 'services',
                permission: 'View Services',
                icon: <FaPassport  />, 
            },
            {
                name: 'Customers',
                route: 'customers',
                permission: 'View Customers',
                icon: <FaUser />,
            },
            {
                name: 'Customer Services',
                route: 'customer-services',
                permission: 'View Customer Services',
                icon: <FaUserCheck  />,
            },
        ],
    },
];

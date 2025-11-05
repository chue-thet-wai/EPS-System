import React from 'react';
import { FaPassport, FaUser, FaUserCheck, FaCogs } from 'react-icons/fa';
import { RiDashboardLine } from 'react-icons/ri';
import { MdSettings, MdCategory, MdSupportAgent } from 'react-icons/md';
import { BsFillPeopleFill } from "react-icons/bs";
import { PiCardholderFill } from "react-icons/pi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { BsPersonWorkspace } from 'react-icons/bs';

export const links = [
    {
        title: 'Dashboard',
        translationKey: 'dashboard',
        icon: <RiDashboardLine />,
        route: 'dashboard',
    },
    {
        title: 'Setup',
        translationKey: 'setup',
        icon: <MdSettings />, 
        links: [
            { name: 'Categories', translationKey: 'categories', route: 'categories', permission: 'View Categories' }
        ],
    },
    {
        title: 'Management',
        translationKey: 'management',
        icon: <MdOutlineManageAccounts />, 
        links: [
            { name: 'Roles', translationKey: 'roles', route: 'roles', permission: 'View Roles' },
            { name: 'Users', translationKey: 'users', route: 'users', permission: 'View Users' },
            { name: 'Agents', translationKey: 'agents', route: 'agents', permission: 'View Agents' },
        ],
    },
    {
        title: 'My Customers',
        translationKey: 'myCustomers',
        icon: <BsFillPeopleFill />, 
        links: [
            { name: 'All Customers', translationKey: 'allCustomers', route: 'customers', permission: 'View Customers' },
            {
                name: 'Customer Expirations',
                translationKey: 'customerExpirations',
                permission: 'View Customers',
                links: [
                    { name: 'Passport Expiry', translationKey: 'passportExpiry', route: 'customers/expiry/passport', permission: 'View Customers' },
                    { name: 'Visa Expiry', translationKey: 'visaExpiry', route: 'customers/expiry/visa', permission: 'View Customers' },
                    { name: 'Pink Card Expiry', translationKey: 'pinkCardExpiry', route: 'customers/expiry/pinkcard', permission: 'View Customers' },
                    { name: 'CI Card Expiry', translationKey: 'ciCardExpiry', route: 'customers/expiry/ci', permission: 'View Customers' },
                ]
            },
            { name: 'New Customers this Month', translationKey: 'newCustomersThisMonth', route: 'customers/new', permission: 'Create Customers' },
            { name: 'Active Service Activity', translationKey: 'activeServiceActivity', route: 'customer-services', permission: 'View Customer Services' },
            { name: 'Upload from Excel', translationKey: 'uploadFromExcel', route: 'customers/import', permission: 'View Customers' },
        ],
    },
    {
        title: 'My Service',
        translationKey: 'myServices',
        icon: <PiCardholderFill />, 
        links: [
            { name: 'All Services', translationKey: 'allServices', route: 'services', permission: 'View Services' },
            { name: 'Create Service', translationKey: 'createService', route: 'services/create', permission: 'Create Services' }
        ],
    },
    {
        title: 'Jobs',
        translationKey: 'jobs',
        icon: <BsPersonWorkspace />, 
        links: [
            { name: 'Jobs', translationKey: 'jobs', route: 'jobs', permission: 'View Jobs' },
            { name: 'Applicants', translationKey: 'applicants', route: 'applicants', permission: 'View Applicants' },
        ],
    },
];

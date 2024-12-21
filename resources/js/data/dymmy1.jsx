import React from 'react';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';



export const gridOrderStatus = (props) => (
    <button
        type="button"
        style={{ background: props.StatusBg }}
        className="text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
        {props.Status}
    </button>
);


export const links = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'dashboard',
                icon: <FiShoppingBag />,
            },
        ],
    },

    {
        title: 'Setup',
        links: [
            {
                name: 'categories',
                icon: <BsBoxSeam />,
            },
            {
                name: 'courses',
                icon: <FiStar />,
            },
            {
                name: 'cycles',
                icon: <FiPieChart />,
            },
        ],
    },
    {
        title: 'Management',
        links: [
            {
                name: 'roles',
                icon: <RiContactsLine />,
            },
            {
                name: 'users',
                icon: <IoMdContacts />,
            },
            {
                name: 'teachers',
                icon: <IoMdContacts />,
            },
        ],
    },
];
export const themeColors = [
    {
      name: 'blue-theme',
      color: '#1A97F5',
    },
    {
      name: 'green-theme',
      color: '#03C9D7',
    },
    {
      name: 'purple-theme',
      color: '#7352FF',
    },
    {
      name: 'red-theme',
      color: '#FF5C8E',
    },
    {
      name: 'indigo-theme',
      color: '#1E4DB7',
    },
    {
      color: '#FB9678',
      name: 'orange-theme',
    },
];

export const userProfileData = [
    {
        icon: <BsCurrencyDollar />,
        title: 'My Profile',
        desc: 'Account Settings',
        iconColor: '#03C9D7',
        iconBg: '#E5FAFB',
    },
    {
        icon: <BsShield />,
        title: 'My Inbox',
        desc: 'Messages & Emails',
        iconColor: 'rgb(0, 194, 146)',
        iconBg: 'rgb(235, 250, 242)',
    },
    {
        icon: <FiCreditCard />,
        title: 'My Tasks',
        desc: 'To-do and Daily Tasks',
        iconColor: 'rgb(255, 244, 229)',
        iconBg: 'rgb(254, 201, 15)',
    },
];

export const contextMenuItems = [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Copy',
    'Edit',
    'Delete',
    'Save',
    'Cancel',
    'PdfExport',
    'ExcelExport',
    'CsvExport',
    'FirstPage',
    'PrevPage',
    'LastPage',
    'NextPage',
];

export const earningData = [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: '39,354',
      percentage: '-4%',
      title: 'Customers',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <BsBoxSeam />,
      amount: '4,396',
      percentage: '+23%',
      title: 'Products',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <FiBarChart />,
      amount: '423,39',
      percentage: '+38%',
      title: 'Sales',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
  
      pcColor: 'green-600',
    },
    {
      icon: <HiOutlineRefresh />,
      amount: '39,354',
      percentage: '-12%',
      title: 'Refunds',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
  ];


import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { usePage, Link } from '@inertiajs/inertia-react';
import avatar from '../utils/avatar.jpg';
import useIsMobile from '@/utils/useIsMobile';
import { MdNotifications } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/lang';

const NavButton = ({ title, customFunc, color, icon, dotColor }) => (
    <div className="relative">
        <button
            type="button"
            onClick={customFunc}
            className="text-xl rounded-full p-3 hover:text-gray-900 hover:bg-light-gray"
            style={{ color }}
            data-tooltip-id={title + '-tooltip'}
        >
            {icon}
            {dotColor && (
                <span
                    style={{ backgroundColor: dotColor }}
                    className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
                />
            )}
        </button>
    </div>
);

const Navbar = () => {
    const { auth, pageTitle } = usePage().props;
    const user = auth.user;

    const {
        activeMenu,
        setactiveMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        currentColor,
    } = useStateContext();

    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const isMobile = useIsMobile();

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (screenSize <= 900) {
            setactiveMenu(false);
        } else {
            setactiveMenu(true);
        }
    }, [screenSize]);

    const renderMobile = () => (
        <div className='bg-white'>
            <div className="bg-white flex justify-between p-2 items-center relative">
                <div className="flex items-center space-x-4">
                    {pageTitle && (
                        <span className="text-sm font-semibold text-black">
                            {t[pageTitle] || pageTitle}
                        </span>
                    )}
                </div>

                <div className="flex items-center">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 text-sm font-medium bg-gray-200 rounded-lg mx-2"
                    >
                        {language === 'en' ? 'EN' : 'မြန်မာ'}
                    </button>
                    <Link href={route('customers.create')} title={t.addCustomer} className="text-xl mx-2">
                        <IoPersonAddOutline />
                    </Link>
                    <Link href={route('dashboard')} title={t.settings} className="text-xl mx-2">
                        <MdNotifications />
                    </Link>
                    <NavButton
                        title={t.menu}
                        customFunc={() => setactiveMenu(!activeMenu)}
                        color='#000'
                        icon={<AiOutlineMenu />}
                    />
                </div>
            </div>
            <div className="flex items-center ml-4">
                <div className="flex items-center gap-3 py-2">
                    <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={user?.avatar || avatar}
                        alt="User"
                    />
                    <div className="leading-tight">
                        <p className="font-medium text-gray-800">{user?.name || "Admin"}</p>
                        {user?.agent?.id && (
                            <p className="text-xs text-gray-800">{t.agentId} {user.agent.agent_id}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDesktop = () => (
        <div className="bg-primary-theme-color flex justify-between p-2 items-center relative">
            <div className="flex items-center space-x-4">
                <NavButton
                    title={t.menu}
                    customFunc={() => setactiveMenu(!activeMenu)}
                    color={currentColor}
                    icon={<AiOutlineMenu />}
                />
                {pageTitle && (
                    <span className="text-lg font-semibold text-white">
                        {t[pageTitle] || pageTitle}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => toggleLanguage(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white 
                                shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 
                                hover:border-blue-400 transition"
                    >
                        <option value="en">English</option>
                        <option value="mm">မြန်မာ</option>
                    </select>
                </div>

                <div
                    onClick={() => handleClick('userProfile')}
                    className="flex items-center gap-4 px-4 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition"
                >
                    <img
                        src={user?.avatar || avatar}
                        alt="user profile"
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <MdKeyboardArrowDown className="text-gray-600 text-sm" />
                </div>
                <Tooltip id="Profile-tooltip" place="bottom" content="Profile" />
                {isClicked.userProfile && <UserProfile user={user} />}
            </div>
        </div>
    );

    return isMobile ? renderMobile() : renderDesktop();
};

export default Navbar;

import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { usePage } from '@inertiajs/inertia-react';
import avatar from '../utils/avatar.jpg';

const NavButton = ({ title, customFunc, color, icon, dotColor }) => (
    <div className="relative">
        <button
            type="button"
            onClick={customFunc}
            className="text-xl rounded-full p-3 hover:text-gray-900 hover:bg-light-gray"
            style={{ color }}
            data-tooltip-id={title+"-tooltip"} 
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
    const { auth } = usePage().props; 
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

    return (
        <div className="bg-primary-theme-color flex justify-between p-2 relative">
            <NavButton
                title="Menu"
                customFunc={() => setactiveMenu(!activeMenu)}
                color={currentColor}
                icon={<AiOutlineMenu />}
            />

            <div className="flex">
                <div
                    className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                    onClick={() => handleClick('userProfile')}
                >
                    <img className="rounded-full w-8 h-8" src={user?.avatar || avatar} alt="Avatar" />
                    <p>
                        <span className="text-gray-800 text-14">Hi, </span>{' '}
                        <span className="text-gray-800 font-bold ml-1 text-14">
                            {user?.name || 'Guest'}
                        </span>
                    </p>
                    <MdKeyboardArrowDown className="text-gray-400 text-14" />
                </div>
                <Tooltip id="Profile-tooltip" place="bottom" content="Profile" />

                {/* Pass user data to UserProfile */}
                {isClicked.userProfile && <UserProfile user={user} />}
            </div>
        </div>
    );
};

export default Navbar;

import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Tooltip } from 'react-tooltip'; 
import avatar from '../data/avatar.jpg';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, color, icon, dotColor }) => (
    <div className="relative">
        <button
            type="button"
            onClick={customFunc}
            className="text-xl rounded-full p-3 hover:bg-light-gray"
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
        <Tooltip id={title + "-tooltip"} place="bottom" content={title} />
    </div>
);

const Navbar = () => {
    const {
        activeMenu,
        setactiveMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        currentColor,
        setThemeSettings, 
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
        <div
            className="flex justify-between p-2 relative shadow-md" 
        >
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
                    <img className="rounded-full w-8 h-8" src={avatar} alt="Avatar" />
                    <p>
                        <span className="text-gray-400 text-14">Hi, </span>{' '}
                        <span className="text-gray-400 font-bold ml-1 text-14">Admin</span>
                    </p>
                    <MdKeyboardArrowDown className="text-gray-400 text-14" />
                </div>
                <Tooltip id="Profile-tooltip" place="bottom" content="Profile" />

                {isClicked.userProfile && <UserProfile />}

            </div>
        </div>
    );
};

export default Navbar;

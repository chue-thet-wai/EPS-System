import React, { useEffect } from 'react';
import { FiSettings } from "react-icons/fi";
import { Tooltip } from 'react-tooltip'; // Modern tooltip component
import { Navbar, Footer, Sidebar, ThemeSettings } from "../../components";
import remembered, { themeParams } from '../../contexts/remembered';
import { useStateContext } from '../../contexts/ContextProvider';

const Main = ({ children }) => {
    const {
        activeMenu,
        setactiveMenu,
        themeSettings,
        setThemeSettings,
        currentColor,
        currentMode,
    } = useStateContext();
    const { themep, setThemep, setColor, setMode } = themeParams();

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <div className="flex relative dark:bg-main-dark-bg w-screen">

                {/* Sidebar */}
                {activeMenu ? (
                    <div className="w-72 fixed z-[1500] sidebar dark:bg-secondary-dark-bg bg-white">
                        <Sidebar />
                    </div>
                ) : (
                    <div className="w-0 dark:bg-secondary-dark-bg">
                        <Sidebar />
                    </div>
                )}

                {/* Main Content */}
                <div
                    className={`relative dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}
                >
                    <div className="sticky top-0 bg-main-bg dark:bg-main-dark-bg navbar">
                        <Navbar />
                    </div>

                    <div>
                        {themeSettings && <ThemeSettings />}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;

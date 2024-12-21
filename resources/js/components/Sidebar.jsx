import React from 'react';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { Tooltip } from 'react-tooltip'; // Ensure correct Tooltip import
import { links } from '../data/dymmy1';
import { Link, usePage } from "@inertiajs/inertia-react";
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
    const { activeMenu, setactiveMenu, screenSize, currentColor } = useStateContext();
    const { url } = usePage();

    const handleCloseSidebar = () => {
        if (activeMenu && screenSize <= 900) {
            setactiveMenu(false);
        }
    };

    const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
    const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

    return (
        <div className="ml-3 h-screen overflow-auto md:hover:overflow-auto pb-10">
            {activeMenu && (
                <>
                    <div className="flex justify-between items-center">
                        <Link
                            href="/"
                            onClick={handleCloseSidebar}
                            className="items-center sticky top-0 z-50 gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
                        >
                            <span>Learning Management</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setactiveMenu(!activeMenu)}
                            data-tooltip-id="menu-tooltip" // Updated tooltip
                            className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
                        >
                            <MdOutlineCancel />
                        </button>
                        <Tooltip id="menu-tooltip" place="bottom" content="Menu" />
                    </div>
                    <div className="mt-10">
                        {links.map((item) => (
                            <div key={item.title}>
                                <p className="text-gray-400 m-3 mt-4 uppercase">{item.title}</p>
                                {item.links.map((link) => (
                                    <Link
                                        href={`/${link.name}`}
                                        key={link.name}
                                        onClick={handleCloseSidebar}
                                        style={{ backgroundColor: url === `/${link.name}` ? currentColor : '' }}
                                        className={url === `/${link.name}` ? activeLink : normalLink}
                                    >
                                        {link.icon}
                                        <span className="capitalize">{link.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;

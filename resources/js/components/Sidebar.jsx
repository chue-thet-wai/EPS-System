import React from 'react';
import { usePage, Link } from '@inertiajs/inertia-react';
import { links } from '../utils/menu';
import { MdOutlineCancel } from 'react-icons/md';
import { Tooltip } from 'react-tooltip'; 
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
    const { activeMenu, currentColor ,setactiveMenu } = useStateContext();
    const { url, props } = usePage();
    const userPermissions = props.auth?.permissions || [];

    const hasPermission = (permission) => {
        return permission ? userPermissions.includes(permission) : true;
    };

    const handleCloseSidebar = () => {
        if (activeMenu && screenSize <= 900) {
            setactiveMenu(false);
        }
    };

    const activeLink = 'flex items-center gap-5 pl-4 pt-2 pb-2 rounded-lg text-gray-700 text-md m-2';
    const normalLink = 'flex items-center gap-5 pl-4 pt-2 pb-2 rounded-lg text-md text-white hover:text-gray-800 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

    return (
        <div className="h-screen overflow-auto bg-primary-theme-color pb-10">
            {activeMenu && (
                <>
                    <div className="flex justify-between items-center">
                        <Link
                            href="/"
                            onClick={handleCloseSidebar}
                            className="items-center text-white sticky top-0 z-50 gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
                        >
                            <span>EPS System</span>
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
                        {links.map((section) => {
                            const visibleLinks = section.links.filter(link => hasPermission(link.permission));
                            if (visibleLinks.length === 0) return null;

                            return (
                                <div key={section.title}>
                                    <p className="text-white m-3 mt-4 uppercase">{section.title}</p>
                                    {visibleLinks.map(link => (
                                        <Link
                                            href={`/${link.route}`}
                                            key={link.name}
                                            style={{ backgroundColor: url === `/${link.route}` ? currentColor : '' }}
                                            className={url === `/${link.route}` ? activeLink : normalLink}
                                        >
                                            {link.icon}
                                            <span className="capitalize">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;

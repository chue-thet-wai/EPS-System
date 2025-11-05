import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { MdOutlineCancel } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { links } from '../utils/menu';
import { Inertia } from "@inertiajs/inertia";
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/lang';

const Sidebar = () => {
    const { activeMenu, setactiveMenu, currentColor, handleReset } = useStateContext();
    const { url, props } = usePage();
    const userPermissions = props.auth?.permissions || [];
    const [openSections, setOpenSections] = useState({});
    const isMobile = useIsMobile();

    const { language } = useLanguage();
    const t = translations[language];

    const hasPermission = (permission) => {
        return !permission || userPermissions.includes(permission);
    };

    const isActive = (route) => `/${route}` === url;

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            setactiveMenu(false);
        }
    };

    const handleLogout = () => {
        Inertia.post("/logout");
        handleReset();
    };

    const toggleSection = (key) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const renderLinks = (linkList, level = 0, parentKey = '') => {
        return linkList.map((link, index) => {
            if (!hasPermission(link.permission)) return null;

            const hasSubLinks = link.links && link.links.length > 0;
            const key = `${parentKey}-${index}`;
            const paddingClass = `pl-${Math.min(4 + level * 2, 10)}`;
            const isSectionOpen = openSections[key];

            return (
                <div key={key} className="w-full">
                    <div
                        onClick={() => {
                            if (hasSubLinks) {
                                toggleSection(key);
                            } else {
                                handleLinkClick();
                            }
                        }}
                        className={`flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-gray-100 ${
                            isActive(link.route) ? 'bg-gray-100 font-medium' : ''
                        } ${paddingClass}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg leading-none">•</span>
                            {hasSubLinks ? (
                                <span>{t[link.translationKey] || link.name}</span>
                            ) : (
                                <Link
                                    href={link.route ? `/${link.route}` : '#'}
                                    className="block"
                                    onClick={handleLinkClick}
                                >
                                    {t[link.translationKey] || link.name}
                                </Link>
                            )}
                        </div>
                        {hasSubLinks && (
                            <span className="text-sm">{isSectionOpen ? '▾' : '▸'}</span>
                        )}
                    </div>

                    {hasSubLinks && isSectionOpen && (
                        <div className="mt-1">
                            {renderLinks(link.links, level + 1, key)}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderMobile = () => (
        <div className={`fixed top-0 right-0 z-50 h-screen w-64 bg-white text-black shadow-lg transition-transform duration-300 ease-in-out transform ${activeMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center px-4 py-4 border-b">
                <Link href="/" className="text-md font-bold">{t.welcomeEpsSystem}</Link>
                <button onClick={() => setactiveMenu(false)} className="text-xl">
                    <MdOutlineCancel />
                </button>
            </div>

            <div className="mt-6 overflow-y-auto h-[calc(100vh-160px)] px-4 text-sm">
                {links.map((section, idx) => {
                    const visibleLinks = section.links?.filter(link => hasPermission(link.permission)) || [];

                    if (section.links && visibleLinks.length > 0) {
                        const sectionKey = `section-${idx}`;
                        return (
                            <div key={sectionKey} className="mb-3">
                                <button
                                    onClick={() => toggleSection(sectionKey)}
                                    className="w-full text-left flex justify-between items-center font-semibold text-sm py-2 px-2 rounded hover:bg-gray-100"
                                >
                                    <span>{t[section.translationKey] || section.title}</span>
                                    <span>{openSections[sectionKey] ? '▾' : '▸'}</span>
                                </button>

                                {openSections[sectionKey] && (
                                    <div className="ml-4 mt-1">
                                        {renderLinks(visibleLinks, 0, sectionKey)}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    if (!section.links && hasPermission(section.permission)) {
                        return (
                            <Link
                                key={section.title}
                                href={`/${section.route}`}
                                onClick={handleLinkClick}
                                className={`block py-2 px-2 rounded hover:bg-gray-100 font-semibold ${
                                    isActive(section.route) ? 'bg-gray-100 font-medium' : ''
                                }`}
                            >
                                {t[section.translationKey] || section.title}
                            </Link>
                        );
                    }

                    return null;
                })}

                <Link
                    href="/profile/edit"
                    onClick={handleLinkClick}
                    className="block text-sm py-2 px-2 rounded hover:bg-gray-100 font-medium"
                >
                    {t.userSetting}
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm py-2 px-2 rounded hover:bg-gray-100 font-medium"
                >
                    {t.logout}
                </button>
            </div>
        </div>
    );

    const renderDesktop = () => (
        <div className="h-screen overflow-auto bg-secondary-theme-color text-black">
            {activeMenu && (
                <>
                    <div className="flex justify-between items-center px-4 py-4">
                        <Link href="/" className="text-xl font-bold">{t.welcomeEpsSystem}</Link>
                        <button onClick={() => setactiveMenu(false)} className="md:hidden text-xl">
                            <MdOutlineCancel />
                        </button>
                    </div>

                    <div className="mt-6">
                        {links.map((section, idx) => {
                            const visibleLinks = section.links?.filter(link => hasPermission(link.permission)) || [];
                            const sectionKey = `section-${idx}`;

                            if (section.links && visibleLinks.length > 0) {
                                return (
                                    <div key={sectionKey}>
                                        <button
                                            onClick={() => toggleSection(sectionKey)}
                                            className="w-full text-left flex items-center justify-between px-4 py-4 font-semibold hover:bg-gray-300"
                                        >
                                            <span className="flex items-center gap-2">
                                                {section.icon}
                                                {t[section.translationKey] || section.title}
                                            </span>
                                            <span>{openSections[sectionKey] ? '▾' : '▸'}</span>
                                        </button>

                                        {openSections[sectionKey] && (
                                            <div className="pl-6">
                                                {renderLinks(visibleLinks, 0, sectionKey)}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            if (!section.links && hasPermission(section.permission)) {
                                return (
                                    <Link
                                        key={section.title}
                                        href={`/${section.route}`}
                                        onClick={handleLinkClick}
                                        className={`flex items-center gap-2 px-4 py-4 rounded hover:bg-white font-semibold ${
                                            isActive(section.route) ? 'bg-white font-medium' : ''
                                        }`}
                                    >
                                        {section.icon}
                                        {t[section.translationKey] || section.title}
                                    </Link>
                                );
                            }

                            return null;
                        })}
                    </div>
                </>
            )}
        </div>
    );

    return isMobile ? renderMobile() : renderDesktop();
};

export default Sidebar;

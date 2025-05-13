import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import AdminMain from './Pages/Layouts/AdminMain'; 
import AdminGuest from './Pages/Layouts/AdminGuest'; 
import { ContextProvider } from './contexts/ContextProvider';

InertiaProgress.init();

createInertiaApp({
    resolve: async (name) => {
        try {
            // Dynamically resolve pages with nested paths
            const pages = import.meta.glob('./Pages/**/*.jsx');
            const page = pages[`./Pages/${name}.jsx`];

            if (!page) {
                throw new Error(`Page not found: ./Pages/${name}.jsx`);
            }

            const module = await page();

            if (['Auth/Login', 'Auth/Register'].includes(name)) {
                module.default.layout = (page) =>
                    <AdminGuest>{page}</AdminGuest>;
            } else {
                module.default.layout = (page) =>
                    <AdminMain>{page}</AdminMain>;
            }

            return module;
        } catch (error) {
            console.error(`Error resolving page: ${name}`, error);
            throw error;
        }
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ContextProvider>
                <App {...props} />
            </ContextProvider>
        );
    },
});

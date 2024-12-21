import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import Main from './Pages/Layouts/Main';
import Gest from './Pages/Layouts/Gest'; // Import Gest layout
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

            // Apply layouts dynamically
            // Use Gest layout for specific unauthenticated pages
            if (['Auth/Login', 'Auth/Register'].includes(name)) {
                module.default.layout = (page) => <Gest>{page}</Gest>;
            } else {
                // Use Main layout by default if no layout is explicitly set
                module.default.layout ??= (page) => <Main>{page}</Main>;
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

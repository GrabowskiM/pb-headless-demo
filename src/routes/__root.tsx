import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';

import { loadMenu } from '#/menu';

import appCss from '../styles.css?url';

const FOOTER_SECTIONS = [
    { links: ['About us', 'Careers', 'Newsroom', 'Contact'], title: 'Company' },
    { links: ['Platform', 'Integrations', 'Pricing', 'Roadmap'], title: 'Products' },
    { links: ['Documentation', 'Guides', 'Support', 'Status'], title: 'Resources' },
    { links: ['Privacy', 'Terms', 'Cookies', 'Accessibility'], title: 'Legal' },
];

const RootLayout = () => {
    const menu = Route.useLoaderData();

    return (
        <>
            <header className="site-header">
                <div className="site-header__inner">
                    <span className="site-header__logo">
                        <img alt="Cohesivo" src="/cohesivo-logo.svg" />
                    </span>
                    <nav className="site-nav">
                        <ul>
                            {menu.map((item) => (
                                <li key={item.id}>{item.name}</li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>
            <Outlet />
            <footer className="site-footer">
                <div className="site-footer__inner">
                    <div className="site-footer__brand">
                        <img alt="Cohesivo" src="/cohesivo-logo-light.svg" />
                        <p>A headless storefront rendered from Ibexa DXP.</p>
                    </div>
                    <div className="site-footer__sections">
                        {FOOTER_SECTIONS.map((section) => (
                            <div className="site-footer__section" key={section.title}>
                                <h2>{section.title}</h2>
                                <ul>
                                    {section.links.map((link) => (
                                        <li key={link}>{link}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="site-footer__bar">
                    <span>&copy; {new Date().getFullYear()} Cohesivo</span>
                    <span>Built with TanStack Start</span>
                </div>
            </footer>
        </>
    );
};

const RootDocument = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <head>
            <HeadContent />
        </head>
        <body>
            {children}

            <Scripts />
        </body>
    </html>
);

export const Route = createRootRoute({
    component: RootLayout,
    head: () => ({
        links: [
            {
                href: appCss,
                rel: 'stylesheet',
            },
        ],
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                content: 'width=device-width, initial-scale=1',
                name: 'viewport',
            },
            {
                title: 'Headless landing page',
            },
        ],
    }),
    loader: () => loadMenu(),
    shellComponent: RootDocument,
    staleTime: Infinity,
});

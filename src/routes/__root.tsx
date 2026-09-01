import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import { loadMenu } from '#/menu'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Headless landing page',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: () => loadMenu(),
  staleTime: Infinity,
  component: RootLayout,
  shellComponent: RootDocument,
})

const FOOTER_SECTIONS = [
  { title: 'Company', links: ['About us', 'Careers', 'Newsroom', 'Contact'] },
  { title: 'Products', links: ['Platform', 'Integrations', 'Pricing', 'Roadmap'] },
  { title: 'Resources', links: ['Documentation', 'Guides', 'Support', 'Status'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Accessibility'] },
]

function RootLayout() {
  const menu = Route.useLoaderData()

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <span className="site-header__logo">
            <img src="/cohesivo-logo.svg" alt="Cohesivo" />
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
            <img src="/cohesivo-logo-light.svg" alt="Cohesivo" />
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
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  )
}

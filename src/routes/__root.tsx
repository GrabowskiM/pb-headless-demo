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

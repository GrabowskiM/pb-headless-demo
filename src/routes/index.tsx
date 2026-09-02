import { createFileRoute } from '@tanstack/react-router'
import { LandingPage, Zone, useFieldValue, useIsPBMode } from '@ibexa/react-headless'

import { blockComponents } from '#/blocks'
import { ContentListsContext } from '#/ContentLists'
import { loadContentLists } from '#/contentList'
import { loadPageFieldValue } from '#/pageFieldValue'

import '@ibexa/react-headless/styles/editorial-mode.css'
import '@ibexa/react-headless/styles/preview.css'

export const Route = createFileRoute('/')({
  loader: async () => {
    const fieldValue = await loadPageFieldValue()

    return { fieldValue, contentLists: await loadContentLists(fieldValue) }
  },
  component: Home,
})

const PB_ORIGIN = import.meta.env.VITE_PB_ORIGIN

function Home() {
  const { fieldValue, contentLists } = Route.useLoaderData()

  return (
    <ContentListsContext.Provider value={contentLists}>
      <LandingPage blockComponents={blockComponents} origin={PB_ORIGIN} fieldValue={fieldValue}>
        <Page />
      </LandingPage>
    </ContentListsContext.Provider>
  )
}

function Page() {
  const data = useFieldValue()

  console.log(data);
  console.log('PB mode:', useIsPBMode())


  return <main>{data?.zones.map((zone) => <Zone zone={zone} key={zone.id} />)}</main>
}

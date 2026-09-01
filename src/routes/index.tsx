import { createFileRoute } from '@tanstack/react-router'
import { LandingPage, Zone, useFieldValue } from '@ibexa/react-headless'

import { blockComponents } from '#/blocks'
import { fieldValue } from '#/fieldValue'

import '@ibexa/react-headless/styles/editorial-mode.css'
import '@ibexa/react-headless/styles/preview.css'

export const Route = createFileRoute('/')({ component: Home })

const PB_ORIGIN = import.meta.env.VITE_PB_ORIGIN

function Home() {
  return (
    <LandingPage blockComponents={blockComponents} origin={PB_ORIGIN} fieldValue={fieldValue}>
      <Page />
    </LandingPage>
  )
}

function Page() {
  const data = useFieldValue()

  return <main>{data?.zones.map((zone) => <Zone zone={zone} key={zone.id} />)}</main>
}

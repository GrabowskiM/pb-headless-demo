import '@ibexa/react-headless/styles/editorial-mode.css';
import '@ibexa/react-headless/styles/preview.css';

import { LandingPage, Zone, useFieldValue } from '@ibexa/react-headless';

import { blockComponents } from '#/blocks';
import { createFileRoute } from '@tanstack/react-router';
import { loadPageFieldValue } from '#/pageFieldValue';

const PB_ORIGIN = import.meta.env.VITE_PB_ORIGIN;

const Page = () => {
    const data = useFieldValue();

    return (
        <main>
            {data?.zones.map((zone) => (
                <Zone key={zone.id} zone={zone} />
            ))}
        </main>
    );
};

const Home = () => {
    const fieldValue = Route.useLoaderData();

    return (
        <LandingPage blockComponents={blockComponents} fieldValue={fieldValue} origin={PB_ORIGIN}>
            <Page />
        </LandingPage>
    );
};

export const Route = createFileRoute('/')({
    component: Home,
    loader: () => loadPageFieldValue(),
});

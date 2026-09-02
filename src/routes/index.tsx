import '@ibexa/react-headless/styles/editorial-mode.css';
import '@ibexa/react-headless/styles/preview.css';

import { LandingPage, Zone, useFieldValue, useIsPBMode } from '@ibexa/react-headless';

import { ContentListsContext } from '#/ContentLists';
import { blockComponents } from '#/blocks';
import { createFileRoute } from '@tanstack/react-router';
import { loadContentLists } from '#/contentList';
import { loadPageFieldValue } from '#/pageFieldValue';

const PB_ORIGIN = import.meta.env.VITE_PB_ORIGIN;

const Page = () => {
    const data = useFieldValue();

    console.log(data);
    console.log('PB mode:', useIsPBMode());

    return (
        <main>
            {data?.zones.map((zone) => (
                <Zone key={zone.id} zone={zone} />
            ))}
        </main>
    );
};

const Home = () => {
    const { contentLists, fieldValue } = Route.useLoaderData();

    return (
        <ContentListsContext.Provider value={contentLists}>
            <LandingPage blockComponents={blockComponents} fieldValue={fieldValue} origin={PB_ORIGIN}>
                <Page />
            </LandingPage>
        </ContentListsContext.Provider>
    );
};

export const Route = createFileRoute('/')({
    component: Home,
    loader: async () => {
        const fieldValue = await loadPageFieldValue();

        return { contentLists: await loadContentLists(fieldValue), fieldValue };
    },
});

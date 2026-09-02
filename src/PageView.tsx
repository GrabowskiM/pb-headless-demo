import '@ibexa/react-headless/styles/editorial-mode.css';
import '@ibexa/react-headless/styles/preview.css';

import { LandingPage, useFieldValue } from '@ibexa/react-headless';

import type { FieldValue } from '@ibexa/react-headless';
import { blockComponents } from '#/blocks';
import { resolveLayout } from '#/layouts';

interface PageViewProps {
    fieldValue: FieldValue;
}

const PB_ORIGIN = import.meta.env.VITE_PB_ORIGIN;

const Zones = () => {
    const data = useFieldValue();

    if (!data) {
        return null;
    }

    const Layout = resolveLayout(data.layout);

    return (
        <main>
            <Layout zones={data.zones} />
        </main>
    );
};

export const PageView = ({ fieldValue }: PageViewProps) => (
    <LandingPage blockComponents={blockComponents} fieldValue={fieldValue} origin={PB_ORIGIN}>
        <Zones />
    </LandingPage>
);

import '@ibexa/react-headless/styles/editorial-mode.css';
import '@ibexa/react-headless/styles/preview.css';

import { LandingPage, Zone, useFieldValue } from '@ibexa/react-headless';

import type { FieldValue } from '@ibexa/react-headless';
import { blockComponents } from '#/blocks';

interface PageViewProps {
    fieldValue: FieldValue;
}

const PB_ORIGIN = import.meta.env.VITE_PB_ORIGIN;

const Zones = () => {
    const data = useFieldValue();

    return (
        <main>
            {data?.zones.map((zone) => (
                <Zone key={zone.id} zone={zone} />
            ))}
        </main>
    );
};

export const PageView = ({ fieldValue }: PageViewProps) => (
    <LandingPage blockComponents={blockComponents} fieldValue={fieldValue} origin={PB_ORIGIN}>
        <Zones />
    </LandingPage>
);

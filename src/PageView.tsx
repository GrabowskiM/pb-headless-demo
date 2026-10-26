import '@ibexa/cohesivo-sdk-assets/page-builder/preview.css';

import { LandingPage, useFieldValue, useIsPBMode } from '@ibexa/cohesivo-sdk-react-headless';
import { useEffect, useState } from 'react';

import type { FieldValue } from '@ibexa/cohesivo-sdk-react-headless';
import type { ReactNode } from 'react';

import type { BlockDataMap, BlockWithData } from '#/blockData';
import { BlockDataContext } from '#/blockDataContext';
import { blockComponents } from '#/blocks';
import { fetchBlockData } from '#/blockData';
import { resolveLayout } from '#/layouts';

interface PageViewProps {
    fieldValue: FieldValue | null;
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

// In Page Builder mode the field value arrives over postMessage rather than the
// route loader, so block data is fetched here whenever that value changes.
const BlockDataProvider = ({ children }: { children: ReactNode }) => {
    const isPBMode = useIsPBMode();
    const fieldValue = useFieldValue();
    const [blockData, setBlockData] = useState<BlockDataMap>({});

    useEffect(() => {
        if (!isPBMode || !fieldValue) {
            return undefined;
        }

        let active = true;

        void fetchBlockData({ data: fieldValue }).then((enriched) => {
            if (!active) {
                return;
            }

            const map: BlockDataMap = {};

            for (const zone of enriched.zones) {
                for (const block of zone.blocks as BlockWithData[]) {
                    if (block.data !== undefined) {
                        map[block.id] = block.data;
                    }
                }
            }

            setBlockData(map);
        });

        return () => {
            active = false;
        };
    }, [isPBMode, fieldValue]);

    return <BlockDataContext.Provider value={blockData}>{children}</BlockDataContext.Provider>;
};

export const PageView = ({ fieldValue }: PageViewProps) => (
    <LandingPage blockComponents={blockComponents} fieldValue={fieldValue ?? undefined} origin={PB_ORIGIN}>
        <BlockDataProvider>
            <Zones />
        </BlockDataProvider>
    </LandingPage>
);

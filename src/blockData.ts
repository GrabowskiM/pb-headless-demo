import type { BlockData, FieldValue } from '@ibexa/react-headless';

import { loadContentListItems } from '#/blocks/contentList';

export type BlockWithData = BlockData & { data?: unknown };

const BLOCK_DATA_LOADERS: Record<string, ((block: BlockData) => Promise<unknown>) | undefined> = {
    contentlist: loadContentListItems,
};

export const loadBlockData = async (fieldValue: FieldValue): Promise<FieldValue> => {
    const loaded = new Map<string, unknown>();

    await Promise.all(
        fieldValue.zones
            .flatMap((zone) => zone.blocks)
            .map(async (block) => {
                const load = BLOCK_DATA_LOADERS[block.type];

                if (load) {
                    loaded.set(block.id, await load(block));
                }
            }),
    );

    return {
        ...fieldValue,
        zones: fieldValue.zones.map((zone) => ({
            ...zone,
            blocks: zone.blocks.map((block) => (loaded.has(block.id) ? { ...block, data: loaded.get(block.id) } : block)),
        })),
    };
};

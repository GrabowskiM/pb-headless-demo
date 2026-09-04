import { createServerFn } from '@tanstack/react-start';

import type { BlockData, FieldValue } from '@ibexa/react-headless';

import { loadContentListItems } from '#/blocks/ContentListBlock';
import { loadForm } from '#/blocks/FormBlock';
import { loadGalleryImages } from '#/blocks/GalleryBlock';
import { loadQuickImage } from '#/blocks/QuickImageBlock';

export type BlockWithData = BlockData & { data?: unknown };

export type BlockDataMap = Record<string, unknown>;

const BLOCK_DATA_LOADERS: Record<string, ((block: BlockData) => Promise<unknown>) | undefined> = {
    contentlist: loadContentListItems,
    form: loadForm,
    gallery: loadGalleryImages,
    // eslint-disable-next-line camelcase
    quick_image: loadQuickImage,
};

const collectBlockData = async (fieldValue: FieldValue): Promise<BlockDataMap> => {
    const entries = await Promise.all(
        fieldValue.zones
            .flatMap((zone) => zone.blocks)
            .map(async (block) => {
                const load = BLOCK_DATA_LOADERS[block.type];

                return load ? ([block.id, await load(block)] as const) : null;
            }),
    );

    return Object.fromEntries(entries.filter((entry) => entry !== null));
};

export const loadBlockData = async (fieldValue: FieldValue): Promise<FieldValue> => {
    const loaded = await collectBlockData(fieldValue);

    return {
        ...fieldValue,
        zones: fieldValue.zones.map((zone) => ({
            ...zone,
            blocks: zone.blocks.map((block) => (block.id in loaded ? { ...block, data: loaded[block.id] } : block)),
        })),
    };
};

export const fetchBlockData = createServerFn()
    .validator((fieldValue: FieldValue) => fieldValue)
    .handler(({ data }) => loadBlockData(data));

import type { BlockData, FieldValue } from '@ibexa/react-headless';

import { restFetch } from '#/rest';

export interface ContentListItem {
    id: number;
    name: string;
}

export type ContentLists = Record<string, ContentListItem[]>;

interface ContentInfoResponse {
    Content: { MainLocation: { _href: string } };
}

interface ViewResponse {
    View: {
        Result: {
            searchHits: { searchHit: { value: { Content: { TranslatedName: string; _id: number } } }[] };
        };
    };
}

const attribute = (block: BlockData, name: string): string | null =>
    block.attributes.find((candidate) => candidate.name === name)?.value ?? null;

export const findContentListBlocks = (fieldValue: FieldValue): BlockData[] =>
    fieldValue.zones.flatMap((zone) => zone.blocks).filter((block) => block.type === 'contentlist');

const loadItems = async (block: BlockData): Promise<ContentListItem[]> => {
    const contentId = attribute(block, 'contentId');
    const contentType = attribute(block, 'contentType');
    const limit = Number(attribute(block, 'limit'));

    if (!contentId || !contentType || !limit) {
        return [];
    }

    const parent = await restFetch<ContentInfoResponse>(
        `/api/ibexa/v2/content/objects/${contentId}`,
        'application/vnd.ibexa.api.ContentInfo+json',
    );
    const parentLocationId = Number(parent.Content.MainLocation._href.split('/').pop());
    const view = await restFetch<ViewResponse>('/api/ibexa/v2/views', 'application/vnd.ibexa.api.View+json', {
        body: JSON.stringify({
            ViewInput: {
                Query: {
                    Filter: {
                        ContentTypeIdentifierCriterion: contentType.split(','),
                        ParentLocationIdCriterion: parentLocationId,
                    },
                    limit,
                },
                identifier: `content-list-${block.id}`,
                public: false,
            },
        }),
        headers: { 'Content-Type': 'application/vnd.ibexa.api.ViewInput+json' },
        method: 'POST',
    });

    return view.View.Result.searchHits.searchHit.map(({ value }) => ({
        id: value.Content._id,
        name: value.Content.TranslatedName,
    }));
};

export const loadContentLists = async (fieldValue: FieldValue): Promise<ContentLists> => {
    const blocks = findContentListBlocks(fieldValue);
    const lists = await Promise.all(blocks.map(async (block) => [block.id, await loadItems(block)] as const));

    return Object.fromEntries(lists);
};

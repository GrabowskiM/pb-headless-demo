import type { BlockData } from '@ibexa/cohesivo-sdk-react-headless';

import { restFetch } from '#/rest';

export interface ContentListThumbnail {
    height: number;
    mimeType: string;
    resource: string;
    width: number;
}

export interface ContentListItem {
    fields: Record<string, unknown>;
    id: number;
    name: string;
    thumbnail: ContentListThumbnail | null;
}

interface ContentInfoResponse {
    Content: { MainLocation: { _href: string } };
}

interface ContentFieldResponse {
    fieldDefinitionIdentifier: string;
    fieldValue: unknown;
}

interface ContentHit {
    value: {
        Content: {
            CurrentVersion: {
                Version: {
                    Fields: { field: ContentFieldResponse[] };
                    Thumbnail: ContentListThumbnail | null;
                };
            };
            TranslatedName: string;
            _id: number;
        };
    };
}

interface ViewResponse {
    View: { Result: { searchHits: { searchHit: ContentHit[] } } };
}

const attribute = (block: BlockData, name: string): string | null => {
    const value = block.attributes.find((candidate) => candidate.name === name)?.value;

    return value === undefined || value === null ? null : String(value);
};

export const loadContentListItems = async (block: BlockData): Promise<ContentListItem[]> => {
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

    return view.View.Result.searchHits.searchHit.map(({ value }) => {
        const { CurrentVersion, TranslatedName, _id } = value.Content;

        return {
            fields: Object.fromEntries(
                CurrentVersion.Version.Fields.field.map((field) => [field.fieldDefinitionIdentifier, field.fieldValue]),
            ),
            id: _id,
            name: TranslatedName,
            thumbnail: CurrentVersion.Version.Thumbnail,
        };
    });
};

import type { BlockData } from '@ibexa/react-headless';

import { restFetch } from '#/rest';

const LOCATIONS_PREFIX = '/api/ibexa/v2/content/locations';
const GALLERY_LIMIT = 25;
const IMAGE_CONTENT_TYPE = 'image';

export interface GalleryImage {
    alternativeText: string;
    height: number;
    id: number;
    resource: string;
    width: number;
}

interface ContentInfoResponse {
    Content: { MainLocation: { _href: string } };
}

interface GalleryHit {
    value: {
        Content: {
            CurrentVersion: { Version: { Thumbnail: { height: number; resource: string; width: number } | null } };
            TranslatedName: string;
            _id: number;
        };
    };
}

interface ViewResponse {
    View: { Result: { searchHits: { searchHit: GalleryHit[] } } };
}

const toPathString = (locationHref: string): string => `${locationHref.replace(LOCATIONS_PREFIX, '')}/`;

export const loadGalleryImages = async (block: BlockData): Promise<GalleryImage[]> => {
    const contentId = block.attributes.find((attribute) => attribute.name === 'contentId')?.value;

    if (!contentId) {
        return [];
    }

    const folder = await restFetch<ContentInfoResponse>(
        `/api/ibexa/v2/content/objects/${contentId}`,
        'application/vnd.ibexa.api.ContentInfo+json',
    );
    const view = await restFetch<ViewResponse>('/api/ibexa/v2/views', 'application/vnd.ibexa.api.View+json', {
        body: JSON.stringify({
            ViewInput: {
                Query: {
                    Filter: {
                        ContentTypeIdentifierCriterion: [IMAGE_CONTENT_TYPE],
                        SubtreeCriterion: toPathString(folder.Content.MainLocation._href),
                    },
                    limit: GALLERY_LIMIT,
                },
                identifier: `gallery-${block.id}`,
                public: false,
            },
        }),
        headers: { 'Content-Type': 'application/vnd.ibexa.api.ViewInput+json' },
        method: 'POST',
    });

    return view.View.Result.searchHits.searchHit.flatMap(({ value }) => {
        const { CurrentVersion, TranslatedName, _id } = value.Content;
        const thumbnail = CurrentVersion.Version.Thumbnail;

        return thumbnail ? [{ alternativeText: TranslatedName, id: _id, ...thumbnail }] : [];
    });
};

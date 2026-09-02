import { restFetch } from '#/rest';

const MENU_PARENT_LOCATION_ID = 431;
const MENU_LIMIT = 50;

export interface MenuItem {
    id: number;
    name: string;
}

interface ContentHit {
    value: {
        Content: {
            MainLocation: { _href: string };
            TranslatedName: string;
            isHidden: boolean;
        };
    };
}

interface ViewResponse {
    View: { Result: { searchHits: { searchHit: ContentHit[] } } };
}

const locationId = (href: string): number => Number(href.split('/').pop());

export const loadMenu = async (): Promise<MenuItem[]> => {
    const { View } = await restFetch<ViewResponse>('/api/ibexa/v2/views', 'application/vnd.ibexa.api.View+json', {
        body: JSON.stringify({
            ViewInput: {
                Query: {
                    Filter: { ParentLocationIdCriterion: MENU_PARENT_LOCATION_ID },
                    limit: MENU_LIMIT,
                },
                identifier: 'top-menu',
                public: false,
            },
        }),
        headers: { 'Content-Type': 'application/vnd.ibexa.api.ViewInput+json' },
        method: 'POST',
    });

    return View.Result.searchHits.searchHit
        .map(({ value }) => value.Content)
        .filter((content) => !content.isHidden)
        .map((content) => ({ id: locationId(content.MainLocation._href), name: content.TranslatedName }))
        .sort((first, second) => first.id - second.id);
};

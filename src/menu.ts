import { restFetch } from '#/rest';

const MENU_PARENT_LOCATION_ID = 431;
const MENU_CONTENT_TYPE = 'headless_landing_page';
const MENU_LIMIT = 50;

export interface MenuItem {
    href: string;
    id: number;
    name: string;
}

interface ResolvedMenuItem {
    href: string | null;
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

interface UrlAliasRefListResponse {
    UrlAliasRefList: { UrlAlias: { _href: string }[] };
}

interface UrlAliasResponse {
    UrlAlias: { path: string };
}

const hasAlias = (item: ResolvedMenuItem): item is MenuItem => item.href !== null;

const loadCustomAliasPath = async (locationHref: string): Promise<string | null> => {
    const refs = await restFetch<UrlAliasRefListResponse>(`${locationHref}/urlaliases`, 'application/vnd.ibexa.api.UrlAliasRefList+json');
    const ref = refs.UrlAliasRefList.UrlAlias.at(0);

    if (!ref) {
        return null;
    }

    const alias = await restFetch<UrlAliasResponse>(ref._href, 'application/vnd.ibexa.api.UrlAlias+json');

    return alias.UrlAlias.path;
};

const locationId = (href: string): number => Number(href.split('/').pop());

export const loadMenu = async (): Promise<MenuItem[]> => {
    const { View } = await restFetch<ViewResponse>('/api/ibexa/v2/views', 'application/vnd.ibexa.api.View+json', {
        body: JSON.stringify({
            ViewInput: {
                Query: {
                    Filter: {
                        ContentTypeIdentifierCriterion: [MENU_CONTENT_TYPE],
                        ParentLocationIdCriterion: MENU_PARENT_LOCATION_ID,
                    },
                    limit: MENU_LIMIT,
                },
                identifier: 'top-menu',
                public: false,
            },
        }),
        headers: { 'Content-Type': 'application/vnd.ibexa.api.ViewInput+json' },
        method: 'POST',
    });

    const items = await Promise.all(
        View.Result.searchHits.searchHit
            .map(({ value }) => value.Content)
            .filter((content) => !content.isHidden)
            .map(async (content) => ({
                href: await loadCustomAliasPath(content.MainLocation._href),
                id: locationId(content.MainLocation._href),
                name: content.TranslatedName,
            })),
    );

    return items.filter(hasAlias).sort((first, second) => first.id - second.id);
};

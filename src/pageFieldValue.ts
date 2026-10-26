import { createServerFn } from '@tanstack/react-start';

import type { FieldValue } from '@ibexa/cohesivo-sdk-react-headless';

import { loadBlockData } from '#/blockData';
import { restFetch } from '#/rest';

const PAGE_LOCATION_ID = 431;

interface LocationResponse {
    Location: {
        ContentInfo: { Content: { _id: number; currentVersionNo: number } };
    };
}

interface PageFieldResponse {
    fieldValue: FieldValue;
}

const loadFieldValue = async (locationQuery: string): Promise<FieldValue> => {
    const location = await restFetch<LocationResponse>(
        `/api/ibexa/v2/content/locations?${locationQuery}`,
        'application/vnd.ibexa.api.Location+json',
    );
    const { _id, currentVersionNo } = location.Location.ContentInfo.Content;
    const page = await restFetch<PageFieldResponse>(
        `/api/ibexa/v3/page-builder/content/${String(_id)}/versions/${String(currentVersionNo)}/page-field`,
        'application/json',
    );

    return loadBlockData(page.fieldValue);
};

export const loadPageFieldValue = createServerFn().handler(() => loadFieldValue(`id=${String(PAGE_LOCATION_ID)}`));

export const loadPageFieldValueByAlias = createServerFn()
    .validator((alias: string) => alias)
    .handler(({ data }) => loadFieldValue(`urlAlias=${encodeURIComponent(data)}`));

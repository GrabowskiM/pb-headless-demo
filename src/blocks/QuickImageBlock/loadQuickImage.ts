import type { BlockData } from '@ibexa/cohesivo-sdk-react-headless';

import { restFetch } from '#/rest';

import { attribute } from '../attribute';

export interface QuickImage {
    alternativeText: string;
    height: number;
    resource: string;
    width: number;
}

interface ImageFieldValue {
    alternativeText: string | null;
}

interface VersionResponse {
    Version: {
        Fields: { field: { fieldTypeIdentifier: string; fieldValue: unknown }[] };
        Thumbnail: { height: number; resource: string; width: number } | null;
    };
}

const isImageFieldValue = (value: unknown): value is ImageFieldValue =>
    typeof value === 'object' && value !== null && 'alternativeText' in value;

export const loadQuickImage = async (block: BlockData): Promise<QuickImage | null> => {
    const contentId = attribute(block, 'image');

    if (!contentId) {
        return null;
    }

    const { Version } = await restFetch<VersionResponse>(
        `/api/ibexa/v2/content/objects/${contentId}/currentversion`,
        'application/vnd.ibexa.api.Version+json',
    );

    if (!Version.Thumbnail) {
        return null;
    }

    const image = Version.Fields.field.find((field) => field.fieldTypeIdentifier === 'ibexa_image')?.fieldValue;
    const alternativeText = isImageFieldValue(image) ? (image.alternativeText ?? '') : '';

    return { alternativeText, ...Version.Thumbnail };
};

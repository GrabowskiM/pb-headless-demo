import { isInIframe } from '@ibexa/utils/page-builder';

import { docbookToHtml } from './docbookToHtml';

// The smallest headless Page Builder integration: one landing page, rendered
// from REST for visitors and from editor messages inside Page Builder.

interface Block {
    id: string;
    type: string;
    name: string;
    attributes: { name: string; value: string | number | null }[];
}

interface FieldValue {
    zones: { id: string; blocks: Block[] }[];
}

const { VITE_IBEXA_REST_URL: REST_URL, VITE_LOCATION_ID: LOCATION_ID, VITE_PB_ORIGIN: PB_ORIGIN } = import.meta.env;
const app = document.querySelector('#app');

if (!app) {
    throw new Error('index.html is missing the #app element');
}

const isFieldValue = (value: unknown): value is FieldValue => typeof value === 'object' && value !== null && 'zones' in value;

const attribute = (block: Block, name: string): string => String(block.attributes.find((candidate) => candidate.name === name)?.value ?? '');

// --- Rendering -------------------------------------------------------------

const renderBlock = (block: Block): HTMLElement => {
    const element = document.createElement('div');

    // Page Builder tracks blocks in the preview by this attribute.
    element.dataset.ibexaBlockId = block.id;
    element.className = `block block--${block.type}`;

    if (block.type === 'richtext') {
        element.innerHTML = docbookToHtml(attribute(block, 'content'));
    } else {
        element.textContent = `${block.name} (${block.type})`;
    }

    return element;
};

const renderZone = ({ blocks, id }: FieldValue['zones'][number]): HTMLElement => {
    const element = document.createElement('section');

    // Page Builder needs the zone id to place dropped blocks.
    element.dataset.ibexaZoneId = id;
    element.className = 'zone';
    element.append(...blocks.map(renderBlock));

    return element;
};

const render = (fieldValue: FieldValue): void => {
    app.replaceChildren(...fieldValue.zones.map(renderZone));
};

// --- Visitors: the page comes from REST -------------------------------------

const restGet = async <T>(path: string, accept: string): Promise<T> => {
    const response = await fetch(`${REST_URL}${path}`, { headers: { Accept: accept } });

    if (!response.ok) {
        throw new Error(`${path} responded with ${String(response.status)}`);
    }

    return response.json() as Promise<T>;
};

const loadFieldValue = async (): Promise<FieldValue> => {
    const location = await restGet<{ Location: { ContentInfo: { Content: { _id: number; currentVersionNo: number } } } }>(
        `/api/ibexa/v2/content/locations?id=${LOCATION_ID}`,
        'application/vnd.ibexa.api.Location+json',
    );
    const { _id, currentVersionNo } = location.Location.ContentInfo.Content;
    const page = await restGet<{ fieldValue: FieldValue }>(
        `/api/ibexa/v3/page-builder/content/${String(_id)}/versions/${String(currentVersionNo)}/page-field`,
        'application/json',
    );

    return page.fieldValue;
};

// --- Editor: the page comes from Page Builder over postMessage ---------------
// The editor code is loaded only when Page Builder frames the page.

if (isInIframe()) {
    void import('./editor').then(({ startEditorMode }) =>
        startEditorMode(PB_ORIGIN, (fieldValue) => {
            if (isFieldValue(fieldValue)) {
                render(fieldValue);
            }
        }),
    );
} else {
    loadFieldValue()
        .then(render)
        .catch((error: unknown) => console.error('Loading the page failed', error));
}

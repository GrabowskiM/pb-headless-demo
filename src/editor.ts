// Stylesheet Page Builder ships for its preview: zones, drop placeholder, dragged block.
import '@ibexa/react-headless/styles/preview.css';

import {
    createAnnouncement,
    createBridge,
    createGeometryTracker,
    findDropIndex,
    type GeometryTracker,
    negotiate,
    parseOrigin,
    type Point,
    type ProtocolReply,
    SELECTOR_BLOCK,
} from '@ibexa/utils/page-builder';

// Everything Page Builder needs from the preview it frames. Each capability
// below maps to a handful of messages; drop a capability and its messages are
// never sent, so the matching handlers can go too.
const CAPABILITIES = ['blocks.dnd', 'blocks.geometry', 'blocks.remove', 'blocks.reveal', 'blocks.select', 'pointer.tracking'] as const;
const ANNOUNCE_INTERVAL = 250;
const SELECTOR_ZONE = '[data-ibexa-zone-id]';

// Class names the preview stylesheet styles.
const CLASS_ZONE = 'm-page-builder__zone';
const CLASS_ZONE_EMPTY = 'm-page-builder__zone--empty';
const CLASS_ZONE_DRAGOVER = 'm-page-builder__zone--dragover';
const CLASS_BLOCK_INNER = 'c-pb-block-preview__inner';
const CLASS_BLOCK_DRAGGING = 'c-pb-block-preview--is-dragging-out';
const CLASS_PLACEHOLDER = 'droppable-placeholder';

interface BlockMessage {
    blockId: string;
}

type InitMessage = ProtocolReply & { fieldValue: unknown; translations?: Record<string, string> };

const blockElement = (blockId: string): HTMLElement | null =>
    document.querySelector<HTMLElement>(`[data-ibexa-block-id="${CSS.escape(blockId)}"]`);

// Adds the editor chrome the stylesheet expects on top of the page's own
// markup: a labelled frame around each zone and a wrapper inside each block.
const decorate = (translations: Record<string, string>): void => {
    document.querySelectorAll<HTMLElement>(SELECTOR_ZONE).forEach((zone, index) => {
        const legend = document.createElement('legend');
        const fieldset = document.createElement('fieldset');

        legend.className = 'm-page-builder__legend';
        legend.textContent = (translations['structure.drop.zone'] ?? 'Zone %number%').replace('%number%', String(index + 1));
        fieldset.className = 'm-page-builder__fieldset';
        fieldset.append(legend);

        zone.classList.add(CLASS_ZONE);
        zone.classList.toggle(CLASS_ZONE_EMPTY, zone.querySelector(SELECTOR_BLOCK) === null);
        zone.dataset.callToActionText = translations['drag.drop.blocks.here'] ?? 'Drag and drop blocks here';
        zone.prepend(fieldset);
    });

    document.querySelectorAll<HTMLElement>(SELECTOR_BLOCK).forEach((block) => {
        const inner = document.createElement('div');

        inner.className = CLASS_BLOCK_INNER;
        inner.append(...block.childNodes);
        block.append(inner);
        // Paint above the zone frame, which is absolutely positioned over the whole zone.
        block.style.position = 'relative';
        block.style.scrollMargin = '2px';
    });
};

export const startEditorMode = (pbOrigin: string, render: (fieldValue: unknown) => void): void => {
    const origin = parseOrigin(pbOrigin);

    if (!origin) {
        throw new Error(`Invalid VITE_PB_ORIGIN: "${pbOrigin}"`);
    }

    const bridge = createBridge(origin);
    const { syncFromPB, syncToPB } = bridge;
    const announce = () => syncToPB('APP:INITIALIZED', createAnnouncement(CAPABILITIES));
    const announceInterval = setInterval(announce, ANNOUNCE_INTERVAL);
    let tracker: GeometryTracker | null = null;
    let placeholder: HTMLElement | null = null;

    const clearPlaceholder = () => {
        placeholder?.closest(SELECTOR_ZONE)?.classList.remove(CLASS_ZONE_DRAGOVER);
        placeholder?.remove();
        placeholder = null;
    };

    const listen = (translations: Record<string, string>) => {
        // blocks.geometry: tell the editor where the blocks are so it can draw its overlays.
        tracker = createGeometryTracker({
            onGeometryChange: (snapshot) => syncToPB('APP:POSITIONS_UPDATE', snapshot),
            onScrollEnd: () => syncToPB('APP:SCROLL_END', {}),
        });
        tracker.start();

        // blocks.select: clicking a block opens it in the editor.
        document.addEventListener('click', ({ target }) => {
            const block = target instanceof Element ? target.closest<HTMLElement>(SELECTOR_BLOCK) : null;

            if (block) {
                syncToPB('APP:BLOCK_CLICKED', { blockId: block.dataset.ibexaBlockId });
            }
        });

        // pointer.tracking: the editor follows the cursor while dragging over the preview.
        window.addEventListener('mousemove', ({ clientX, clientY }) => syncToPB('APP:MOUSE_POSITION', { x: clientX, y: clientY }), {
            passive: true,
        });

        // blocks.reveal
        syncFromPB<BlockMessage>('PB:SCROLL_INTO_BLOCK', ({ blockId }) => blockElement(blockId)?.scrollIntoView({ behavior: 'smooth' }));

        // blocks.remove: the editor waits for the response before it drops the block from the page.
        syncFromPB<BlockMessage>('PB:BLOCK_REMOVE', ({ blockId }) => {
            blockElement(blockId)?.remove();
            syncToPB('APP:BLOCK_REMOVE_RESPONSE', { blockId });
        });

        // blocks.dnd: mark the dragged block, show where it would land, report the drop.
        syncFromPB<BlockMessage>('PB:DRAG_START_PREVIEW', ({ blockId }) => blockElement(blockId)?.classList.add(CLASS_BLOCK_DRAGGING));
        syncFromPB<BlockMessage>('PB:DRAG_END_PREVIEW', ({ blockId }) => blockElement(blockId)?.classList.remove(CLASS_BLOCK_DRAGGING));

        syncFromPB<Point>('PB:DRAG_OVER', (point) => {
            const zones = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR_ZONE));
            const target = zones.map((zone) => ({ index: findDropIndex(zone, point), zone })).find(({ index }) => index !== null);

            clearPlaceholder();

            if (!target || target.index === null) {
                return;
            }

            placeholder = document.createElement('div');
            placeholder.className = CLASS_PLACEHOLDER;

            const nextBlock = target.zone.querySelectorAll(SELECTOR_BLOCK)[target.index];

            if (nextBlock) {
                target.zone.insertBefore(placeholder, nextBlock);
            } else {
                target.zone.append(placeholder);
            }

            target.zone.classList.add(CLASS_ZONE_DRAGOVER);
        });

        syncFromPB('PB:DROP', () => {
            const zone = placeholder?.closest<HTMLElement>(SELECTOR_ZONE);

            if (zone) {
                const nextBlock = placeholder?.nextElementSibling instanceof HTMLElement ? placeholder.nextElementSibling : null;

                syncToPB('APP:DROP_RESPONSE', { nextBlockId: nextBlock?.dataset.ibexaBlockId, zoneId: zone.dataset.ibexaZoneId });
            }

            clearPlaceholder();
            document.querySelectorAll(`.${CLASS_BLOCK_DRAGGING}`).forEach((block) => block.classList.remove(CLASS_BLOCK_DRAGGING));
        });

        syncFromPB<ScrollToOptions>('PB:SCROLL_BY', (options) => {
            tracker?.beginProgrammaticScroll();
            window.scrollBy(options);
        });

        // Not tied to a capability: the editor can trigger DOM events in the preview.
        syncFromPB<{ eventName: string; eventDetail: unknown }>('PB:DISPATCH_EVENT', ({ eventName, eventDetail }) => {
            document.body.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));
        });

        syncFromPB<{ fieldValue: unknown }>('PB:UPDATE_FIELD_DATA', ({ fieldValue }) => {
            clearPlaceholder();
            render(fieldValue);
            decorate(translations);
        });
    };

    syncFromPB<InitMessage | undefined>('PB:INIT_MODE', (data) => {
        clearInterval(announceInterval);

        const result = negotiate(data, CAPABILITIES);

        if (result.status !== 'negotiated') {
            console.error('Page Builder handshake failed', result);

            return;
        }

        const translations = data?.translations ?? {};

        bridge.setNegotiated(result.session);
        document.body.classList.add('editing');
        render(data?.fieldValue);
        decorate(translations);
        listen(translations);
    });

    announce();
};

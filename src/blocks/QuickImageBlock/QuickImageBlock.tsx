import type { BlockWithData } from '#/blockData';
import { useBlockData } from '#/blockDataContext';

import type { QuickImage } from './loadQuickImage';
import { attribute } from '../attribute';

interface QuickImageBlockProps {
    block: BlockWithData;
}

const isQuickImage = (value: unknown): value is QuickImage => typeof value === 'object' && value !== null && 'resource' in value;

export const QuickImageBlock = ({ block }: QuickImageBlockProps) => {
    const data = useBlockData(block);

    if (!isQuickImage(data)) {
        return null;
    }

    const { alternativeText, height, resource, width } = data;

    return (
        <figure className={`block-quick-image block-quick-image--${attribute(block, 'quickstyle')}`}>
            <img alt={alternativeText} height={height} src={resource} width={width} />
        </figure>
    );
};

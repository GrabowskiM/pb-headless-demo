import type { BlockWithData } from '#/blockData';
import { useBlockData } from '#/blockDataContext';

import type { GalleryImage } from './loadGalleryImages';

interface GalleryBlockProps {
    block: BlockWithData;
}

const isGalleryImages = (value: unknown): value is GalleryImage[] => Array.isArray(value);

export const GalleryBlock = ({ block }: GalleryBlockProps) => {
    const data = useBlockData(block);
    const images = isGalleryImages(data) ? data : [];

    if (images.length === 0) {
        return null;
    }

    return (
        <ul className="block-gallery">
            {images.map((image) => (
                <li key={image.id}>
                    <img alt={image.alternativeText} height={image.height} src={image.resource} width={image.width} />
                </li>
            ))}
        </ul>
    );
};

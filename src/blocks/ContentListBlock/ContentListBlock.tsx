import type { BlockWithData } from '#/blockData';
import type { ContentListItem } from './loadContentListItems';

interface ContentListBlockProps {
    block: BlockWithData;
}

const isContentListItems = (value: unknown): value is ContentListItem[] => Array.isArray(value);

export const ContentListBlock = ({ block }: ContentListBlockProps) => {
    const items = isContentListItems(block.data) ? block.data : [];

    console.log(items);

    return (
        <section className="block-content-list">
            <h2>{block.name}</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </section>
    );
};

import type { BlockComponentProps } from '@ibexa/react-headless';

import type { BlockWithData } from '#/blockData';
import type { ContentListItem } from '#/contentList';

interface ContentListBlockProps {
    block: BlockWithData;
}

const attribute = ({ attributes }: BlockComponentProps['block'], name: string): string =>
    attributes.find((candidate) => candidate.name === name)?.value ?? '';

const isContentListItems = (value: unknown): value is ContentListItem[] => Array.isArray(value);

const RichTextBlock = ({ block }: BlockComponentProps) => <div dangerouslySetInnerHTML={{ __html: attribute(block, 'content') }} />;

const ContentListBlock = ({ block }: ContentListBlockProps) => {
    const items = isContentListItems(block.data) ? block.data : [];

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

export const blockComponents = {
    contentlist: ContentListBlock,
    richtext: RichTextBlock,
};

import type { BlockComponentProps } from '@ibexa/react-headless';

import { useContentList } from '#/ContentLists';

const attribute = ({ attributes }: BlockComponentProps['block'], name: string): string =>
    attributes.find((candidate) => candidate.name === name)?.value ?? '';

const RichTextBlock = ({ block }: BlockComponentProps) => <div dangerouslySetInnerHTML={{ __html: attribute(block, 'content') }} />;

const ContentListBlock = ({ block }: BlockComponentProps) => {
    const items = useContentList(block.id);

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

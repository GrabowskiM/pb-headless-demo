import type { BlockWithData } from '#/blockData';
import { useBlockData } from '#/blockDataContext';

import type { ContentListItem } from './loadContentListItems';
import { PersonCard } from './PersonCard';
import { attribute } from '../attribute';

interface ContentListBlockProps {
    block: BlockWithData;
}

const PERSON_CONTENT_TYPE = 'person';

const isContentListItems = (value: unknown): value is ContentListItem[] => Array.isArray(value);

export const ContentListBlock = ({ block }: ContentListBlockProps) => {
    const data = useBlockData(block);
    const items = isContentListItems(data) ? data : [];
    const isPersonList = attribute(block, 'contentType') === PERSON_CONTENT_TYPE;

    return (
        <section className="block-content-list">
            <ul className={isPersonList ? 'person-list' : undefined}>
                {items.map((item) => (isPersonList ? <PersonCard item={item} key={item.id} /> : <li key={item.id}>{item.name}</li>))}
            </ul>
        </section>
    );
};

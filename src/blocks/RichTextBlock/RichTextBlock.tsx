import type { BlockComponentProps } from '@ibexa/cohesivo-sdk-react-headless';

import { attribute } from '../attribute';
import { docbookToHtml } from './docbookToHtml';

export const RichTextBlock = ({ block }: BlockComponentProps) => (
    <div className="block-richtext" dangerouslySetInnerHTML={{ __html: docbookToHtml(attribute(block, 'content')) }} />
);

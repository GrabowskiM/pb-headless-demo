import type { BlockComponentProps } from '@ibexa/react-headless';

import { attribute } from '../attribute';

export const RichTextBlock = ({ block }: BlockComponentProps) => <div dangerouslySetInnerHTML={{ __html: attribute(block, 'content') }} />;

import { ContentListBlock } from './ContentListBlock';
import { FormBlock } from './FormBlock';
import { GalleryBlock } from './GalleryBlock';
import { QuickImageBlock } from './QuickImageBlock';
import { RichTextBlock } from './RichTextBlock';

export const blockComponents = {
    contentlist: ContentListBlock,
    form: FormBlock,
    gallery: GalleryBlock,
    // eslint-disable-next-line camelcase
    quick_image: QuickImageBlock,
    richtext: RichTextBlock,
};

import type { BlockComponentProps } from '@ibexa/react-headless'

function RichTextBlock({ block }: BlockComponentProps) {
  const content = block.attributes.find((attribute) => attribute.name === 'content')?.value ?? ''

  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

export const blockComponents = {
  richtext: RichTextBlock,
}

import type { BlockComponentProps } from '@ibexa/react-headless'

import { useContentList } from '#/ContentLists'

function attribute({ attributes }: BlockComponentProps['block'], name: string): string {
  return attributes.find((candidate) => candidate.name === name)?.value ?? ''
}

function RichTextBlock({ block }: BlockComponentProps) {
  return <div dangerouslySetInnerHTML={{ __html: attribute(block, 'content') }} />
}

function ContentListBlock({ block }: BlockComponentProps) {
  const items = useContentList(block.id)

  return (
    <section className="block-content-list">
      <h2>{block.name}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </section>
  )
}

export const blockComponents = {
  richtext: RichTextBlock,
  contentlist: ContentListBlock,
}

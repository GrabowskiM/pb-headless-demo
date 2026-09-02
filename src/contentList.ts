import type { BlockData, FieldValue } from '@ibexa/react-headless'

import { restFetch } from '#/rest'

export interface ContentListItem {
  id: number
  name: string
}

export type ContentLists = Record<string, Array<ContentListItem>>

interface ContentInfoResponse {
  Content: { MainLocation: { _href: string } }
}

interface ViewResponse {
  View: {
    Result: {
      searchHits: { searchHit: Array<{ value: { Content: { _id: number; TranslatedName: string } } }> }
    }
  }
}

function attribute(block: BlockData, name: string): string | null {
  return block.attributes.find((candidate) => candidate.name === name)?.value ?? null
}

export function findContentListBlocks(fieldValue: FieldValue): Array<BlockData> {
  return fieldValue.zones.flatMap((zone) => zone.blocks).filter((block) => block.type === 'contentlist')
}

async function loadItems(block: BlockData): Promise<Array<ContentListItem>> {
  const contentId = attribute(block, 'contentId')
  const contentType = attribute(block, 'contentType')
  const limit = Number(attribute(block, 'limit'))

  if (!contentId || !contentType || !limit) {
    return []
  }

  const parent = await restFetch<ContentInfoResponse>(
    `/api/ibexa/v2/content/objects/${contentId}`,
    'application/vnd.ibexa.api.ContentInfo+json',
  )
  const parentLocationId = Number(parent.Content.MainLocation._href.split('/').pop())
  const view = await restFetch<ViewResponse>('/api/ibexa/v2/views', 'application/vnd.ibexa.api.View+json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.ibexa.api.ViewInput+json' },
    body: JSON.stringify({
      ViewInput: {
        identifier: `content-list-${block.id}`,
        public: false,
        Query: {
          Filter: {
            ParentLocationIdCriterion: parentLocationId,
            ContentTypeIdentifierCriterion: contentType.split(','),
          },
          limit,
        },
      },
    }),
  })

  return view.View.Result.searchHits.searchHit.map(({ value }) => ({
    id: value.Content._id,
    name: value.Content.TranslatedName,
  }))
}

export async function loadContentLists(fieldValue: FieldValue): Promise<ContentLists> {
  const blocks = findContentListBlocks(fieldValue)
  const lists = await Promise.all(blocks.map(async (block) => [block.id, await loadItems(block)] as const))

  return Object.fromEntries(lists)
}

import { createContext, useContext } from 'react'

import type { ContentLists } from '#/contentList'

export const ContentListsContext = createContext<ContentLists>({})

export function useContentList(blockId: string) {
  return useContext(ContentListsContext)[blockId] ?? []
}

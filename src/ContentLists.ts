import { createContext, useContext } from 'react';

import type { ContentListItem, ContentLists } from '#/contentList';

export const ContentListsContext = createContext<ContentLists>({});

export const useContentList = (blockId: string): ContentListItem[] => useContext(ContentListsContext)[blockId] ?? [];

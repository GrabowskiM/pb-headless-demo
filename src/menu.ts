const REST_URL = import.meta.env.VITE_IBEXA_REST_URL
const MENU_PARENT_LOCATION_ID = 434

export interface MenuItem {
  id: number
  name: string
}

interface ContentHit {
  value: {
    Content: {
      TranslatedName: string
      isHidden: boolean
      MainLocation: { _href: string }
    }
  }
}

interface ViewResponse {
  View: { Result: { searchHits: { searchHit: Array<ContentHit> } } }
}

function locationId(href: string): number {
  return Number(href.split('/').pop())
}

export async function loadMenu(): Promise<Array<MenuItem>> {
  const response = await fetch(`${REST_URL}/api/ibexa/v2/views`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.ibexa.api.ViewInput+json',
      Accept: 'application/vnd.ibexa.api.View+json',
    },
    body: JSON.stringify({
      ViewInput: {
        identifier: 'top-menu',
        public: false,
        Query: {
          Filter: { ParentLocationIdCriterion: MENU_PARENT_LOCATION_ID },
          limit: 50,
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Views responded with ${response.status}`)
  }

  const { View } = (await response.json()) as ViewResponse

  return View.Result.searchHits.searchHit
    .map(({ value }) => value.Content)
    .filter((content) => !content.isHidden)
    .map((content) => ({ id: locationId(content.MainLocation._href), name: content.TranslatedName }))
    .sort((first, second) => first.id - second.id)
}

const REST_URL = import.meta.env.VITE_IBEXA_REST_URL
const MENU_ROOT = '/api/ibexa/v2/content/locations/1/2/132'

export interface MenuItem {
  id: number
  name: string
}

interface LocationRef {
  _href: string
}

interface LocationResponse {
  Location: {
    id: number
    invisible: boolean
    ContentInfo: { Content: { Name: string } }
  }
}

interface LocationListResponse {
  LocationList: { Location: Array<LocationRef> }
}

async function loadRest<T>(path: string, mediaType: string): Promise<T> {
  const response = await fetch(`${REST_URL}${path}`, {
    headers: { Accept: `application/vnd.ibexa.api.${mediaType}+json` },
  })

  if (!response.ok) {
    throw new Error(`${path} responded with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function loadMenu(): Promise<Array<MenuItem>> {
  const children = await loadRest<LocationListResponse>(`${MENU_ROOT}/children`, 'LocationList')
  const locations = await Promise.all(
    children.LocationList.Location.map((child) => loadRest<LocationResponse>(child._href, 'Location')),
  )

  return locations
    .map(({ Location }) => Location)
    .filter((location) => !location.invisible)
    .map((location) => ({ id: location.id, name: location.ContentInfo.Content.Name }))
}

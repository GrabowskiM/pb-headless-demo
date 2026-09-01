import type { FieldValue } from '@ibexa/react-headless'

import { restFetch } from '#/rest'

const PAGE_LOCATION_ID = 431

interface LocationResponse {
  Location: {
    ContentInfo: { Content: { _id: number; currentVersionNo: number } }
  }
}

interface PageFieldResponse {
  fieldValue: FieldValue
}

export async function loadPageFieldValue(): Promise<FieldValue> {
  const location = await restFetch<LocationResponse>(
    `/api/ibexa/v2/content/locations?id=${PAGE_LOCATION_ID}`,
    'application/vnd.ibexa.api.Location+json',
  )
  const { _id, currentVersionNo } = location.Location.ContentInfo.Content
  const page = await restFetch<PageFieldResponse>(
    `/api/ibexa/v3/page-builder/content/${_id}/versions/${currentVersionNo}/page-field`,
    'application/json',
  )

  return page.fieldValue
}

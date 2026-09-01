import type { FieldValue } from '@ibexa/react-headless'

export const fieldValue: FieldValue = {
  layout: 'default',
  zones: [
    {
      id: 'zone-main',
      name: 'Main',
      blocks: [
        {
          id: 'block-intro',
          type: 'richtext',
          name: 'Intro',
          view: 'default',
          visible: true,
          class: null,
          style: null,
          compiled: '',
          since: null,
          till: null,
          attributes: [
            {
              id: 'block-intro-content',
              name: 'content',
              value: '<h1>Headless landing page</h1><p>Rendered from a local field value.</p>',
            },
          ],
        },
      ],
    },
  ],
}

import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';

export const isFramed = createIsomorphicFn()
    .server(() => getRequestHeader('sec-fetch-dest') === 'iframe')
    .client(() => window.parent !== window);

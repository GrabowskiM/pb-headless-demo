import type { BlockData } from '@ibexa/react-headless';

export const attribute = ({ attributes }: BlockData, name: string): string =>
    attributes.find((candidate) => candidate.name === name)?.value ?? '';

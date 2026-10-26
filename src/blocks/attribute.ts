import type { BlockData } from '@ibexa/cohesivo-sdk-react-headless';

export const attribute = ({ attributes }: BlockData, name: string): string => {
    const value = attributes.find((candidate) => candidate.name === name)?.value;

    return value === undefined || value === null ? '' : String(value);
};

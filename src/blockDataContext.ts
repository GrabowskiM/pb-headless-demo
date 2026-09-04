import { createContext, useContext } from 'react';

import type { BlockDataMap, BlockWithData } from '#/blockData';

export const BlockDataContext = createContext<BlockDataMap>({});

export const useBlockData = (block: BlockWithData): unknown => {
    const contextData = useContext(BlockDataContext);

    return block.data ?? contextData[block.id];
};

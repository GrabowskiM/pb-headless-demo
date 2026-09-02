import { useEffect } from 'react';

import { useIsPBMode } from '@ibexa/react-headless';

const RETRY_INTERVAL = 250;

export const PbHandshake = ({ origin }: { origin: string | undefined }) => {
    const isPBMode = useIsPBMode();

    useEffect(() => {
        if (isPBMode || !origin) {
            return;
        }

        const announce = () => {
            window.parent.postMessage({ data: undefined, type: 'APP:INITIALIZED' }, origin);
        };

        announce();

        const timer = window.setInterval(announce, RETRY_INTERVAL);

        return () => {
            window.clearInterval(timer);
        };
    }, [isPBMode, origin]);

    return null;
};

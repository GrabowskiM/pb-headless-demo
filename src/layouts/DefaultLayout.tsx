import { Zone } from '@ibexa/cohesivo-sdk-react-headless';

import type { LayoutProps } from './LayoutProps';

export const DefaultLayout = ({ zones }: LayoutProps) => (
    <div className="layout layout--default">
        {zones.map((zone) => (
            <Zone key={zone.id} zone={zone} />
        ))}
    </div>
);

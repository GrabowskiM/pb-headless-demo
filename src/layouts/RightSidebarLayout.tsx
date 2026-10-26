import { Zone } from '@ibexa/cohesivo-sdk-react-headless';

import type { LayoutProps } from './LayoutProps';

export const RightSidebarLayout = ({ zones }: LayoutProps) => {
    const [hero, main, sidebar] = zones;

    return (
        <div className="layout layout--right-sidebar">
            <div className="layout__hero">
                <Zone zone={hero} />
            </div>
            <div className="layout__body">
                <div className="layout__main">
                    <Zone zone={main} />
                </div>
                <aside className="layout__sidebar">
                    <Zone zone={sidebar} />
                </aside>
            </div>
        </div>
    );
};

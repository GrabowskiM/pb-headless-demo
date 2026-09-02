import { Zone } from '@ibexa/react-headless';

import type { LayoutProps } from './LayoutProps';

export const SplitLayout = ({ zones }: LayoutProps) => {
    const [hero, ...columns] = zones;

    return (
        <div className="layout layout--split">
            <div className="layout__hero">
                <Zone zone={hero} />
            </div>
            <div className="layout__columns">
                {columns.map((zone) => (
                    <div className="layout__column" key={zone.id}>
                        <Zone zone={zone} />
                    </div>
                ))}
            </div>
        </div>
    );
};

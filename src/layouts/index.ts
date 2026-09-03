import type { ComponentType } from 'react';

import { DefaultLayout } from './DefaultLayout';
import type { LayoutProps } from './LayoutProps';
import { RightSidebarLayout } from './RightSidebarLayout';
import { SplitLayout } from './SplitLayout';

const LAYOUTS: Record<string, ComponentType<LayoutProps> | undefined> = {
    default: DefaultLayout,
    // eslint-disable-next-line camelcase
    right_sidebar: RightSidebarLayout,
    split: SplitLayout,
};

export const resolveLayout = (identifier: string): ComponentType<LayoutProps> => LAYOUTS[identifier] ?? DefaultLayout;

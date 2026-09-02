import { createFileRoute } from '@tanstack/react-router';

import { PageView } from '#/PageView';
import { isFramed } from '#/isFramed';
import { loadPageFieldValue } from '#/pageFieldValue';

const Home = () => <PageView fieldValue={Route.useLoaderData()} />;

export const Route = createFileRoute('/')({
    component: Home,
    loader: () => (isFramed() ? null : loadPageFieldValue()),
});

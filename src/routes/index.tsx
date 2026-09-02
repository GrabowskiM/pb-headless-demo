import { PageView } from '#/PageView';
import { createFileRoute } from '@tanstack/react-router';
import { loadPageFieldValue } from '#/pageFieldValue';

const Home = () => <PageView fieldValue={Route.useLoaderData()} />;

export const Route = createFileRoute('/')({
    component: Home,
    loader: () => loadPageFieldValue(),
});

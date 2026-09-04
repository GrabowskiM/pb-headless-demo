import { createFileRoute, notFound } from '@tanstack/react-router';

import { PageView } from '#/PageView';
import { RestError } from '#/rest';
import { isFramed } from '#/isFramed';
import { loadPageFieldValueByAlias } from '#/pageFieldValue';

const NOT_FOUND = 404;

const AliasPage = () => <PageView fieldValue={Route.useLoaderData()} />;

export const Route = createFileRoute('/$')({
    component: AliasPage,
    loader: async ({ params }) => {
        if (isFramed()) {
            return null;
        }

        try {
            return await loadPageFieldValueByAlias({ data: `/${params._splat ?? ''}` });
        } catch (error) {
            if (error instanceof RestError && error.status === NOT_FOUND) {
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw notFound();
            }

            throw error;
        }
    },
});

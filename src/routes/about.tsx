import { createFileRoute } from '@tanstack/react-router';

const About = () => (
    <main>
        <article className="static-page">
            <h1>About this demo</h1>
            <p>
                This site renders an Ibexa Page Builder landing page outside the Ibexa stack. The page content, the top menu and the people
                listed on the home page all come from the REST API of a remote Ibexa instance.
            </p>
            <h2>What it exercises</h2>
            <ul>
                <li>Loading a Page field value through the Page Builder REST endpoint.</li>
                <li>Rendering zones and blocks with the published @ibexa/cohesivo-sdk-react-headless package.</li>
                <li>Resolving block data — a content list block fetches the content it points at.</li>
                <li>Editing the same page inside Page Builder, where the preview frames this application.</li>
            </ul>
            <h2>This page</h2>
            <p>
                Nothing here is loaded. It has no route loader and makes no request, so it renders identically on the server and in the
                browser — a deliberate contrast with the home page.
            </p>
        </article>
    </main>
);

export const Route = createFileRoute('/about')({
    component: About,
});

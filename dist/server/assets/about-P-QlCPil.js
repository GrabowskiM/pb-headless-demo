import { t as require_jsx_runtime } from "./jsx-runtime-CsSE45fb.js";
//#region src/routes/about.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
var About = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
	className: "static-page",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "About this demo" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This site renders an Ibexa Page Builder landing page outside the Ibexa stack. The page content, the top menu and the people listed on the home page all come from the REST API of a remote Ibexa instance." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "What it exercises" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Loading a Page field value through the Page Builder REST endpoint." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Rendering zones and blocks with the published @ibexa/react-headless package." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Resolving block data — a content list block fetches the content it points at." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Editing the same page inside Page Builder, where the preview frames this application." })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "This page" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nothing here is loaded. It has no route loader and makes no request, so it renders identically on the server and in the browser — a deliberate contrast with the home page." })
	]
}) });
//#endregion
export { About as component };

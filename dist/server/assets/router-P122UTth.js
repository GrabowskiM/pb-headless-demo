import { c as isFramed, l as RestError, n as loadPageFieldValueByAlias, t as loadPageFieldValue, u as restFetch } from "./pageFieldValue-B18vNy9F.js";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, notFound } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/menu.ts
var MENU_PARENT_LOCATION_ID = 431;
var MENU_CONTENT_TYPE = "headless_landing_page";
var MENU_LIMIT = 50;
var hasAlias = (item) => item.href !== null;
var loadCustomAliasPath = async (locationHref) => {
	const ref = (await restFetch(`${locationHref}/urlaliases`, "application/vnd.ibexa.api.UrlAliasRefList+json")).UrlAliasRefList.UrlAlias.at(0);
	if (!ref) return null;
	return (await restFetch(ref._href, "application/vnd.ibexa.api.UrlAlias+json")).UrlAlias.path;
};
var locationId = (href) => Number(href.split("/").pop());
var loadMenu = async () => {
	const { View } = await restFetch("/api/ibexa/v2/views", "application/vnd.ibexa.api.View+json", {
		body: JSON.stringify({ ViewInput: {
			Query: {
				Filter: {
					ContentTypeIdentifierCriterion: [MENU_CONTENT_TYPE],
					ParentLocationIdCriterion: MENU_PARENT_LOCATION_ID
				},
				limit: MENU_LIMIT
			},
			identifier: "top-menu",
			public: false
		} }),
		headers: { "Content-Type": "application/vnd.ibexa.api.ViewInput+json" },
		method: "POST"
	});
	return (await Promise.all(View.Result.searchHits.searchHit.map(({ value }) => value.Content).filter((content) => !content.isHidden).map(async (content) => ({
		href: await loadCustomAliasPath(content.MainLocation._href),
		id: locationId(content.MainLocation._href),
		name: content.TranslatedName
	})))).filter(hasAlias).sort((first, second) => first.id - second.id);
};
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-BNumSRKt.css";
//#endregion
//#region src/routes/__root.tsx
var FOOTER_SECTIONS = [
	{
		links: [
			"About us",
			"Careers",
			"Newsroom",
			"Contact"
		],
		title: "Company"
	},
	{
		links: [
			"Platform",
			"Integrations",
			"Pricing",
			"Roadmap"
		],
		title: "Products"
	},
	{
		links: [
			"Documentation",
			"Guides",
			"Support",
			"Status"
		],
		title: "Resources"
	},
	{
		links: [
			"Privacy",
			"Terms",
			"Cookies",
			"Accessibility"
		],
		title: "Legal"
	}
];
var RootLayout = () => {
	const menu = Route$3.useLoaderData();
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("header", {
			className: "site-header",
			children: /* @__PURE__ */ jsxs("div", {
				className: "site-header__inner",
				children: [/* @__PURE__ */ jsx(Link, {
					className: "site-header__logo",
					to: "/",
					children: /* @__PURE__ */ jsx("img", {
						alt: "Cohesivo",
						src: "/cohesivo-logo.svg"
					})
				}), /* @__PURE__ */ jsx("nav", {
					className: "site-nav",
					children: /* @__PURE__ */ jsx("ul", { children: menu.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
						href: item.href,
						children: item.name
					}) }, item.id)) })
				})]
			})
		}),
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsxs("footer", {
			className: "site-footer",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "site-footer__inner",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "site-footer__brand",
					children: [/* @__PURE__ */ jsx("img", {
						alt: "Cohesivo",
						src: "/cohesivo-logo-light.svg"
					}), /* @__PURE__ */ jsx("p", { children: "A headless storefront rendered from Ibexa DXP." })]
				}), /* @__PURE__ */ jsx("div", {
					className: "site-footer__sections",
					children: FOOTER_SECTIONS.map((section) => /* @__PURE__ */ jsxs("div", {
						className: "site-footer__section",
						children: [/* @__PURE__ */ jsx("h2", { children: section.title }), /* @__PURE__ */ jsx("ul", { children: section.links.map((link) => /* @__PURE__ */ jsx("li", { children: link }, link)) })]
					}, section.title))
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "site-footer__bar",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Cohesivo"
				] }), /* @__PURE__ */ jsx(Link, {
					to: "/about",
					children: "About this demo"
				})]
			})]
		})
	] });
};
var RootDocument = ({ children }) => /* @__PURE__ */ jsxs("html", {
	lang: "en",
	children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
});
var Route$3 = createRootRoute({
	component: RootLayout,
	head: () => ({
		links: [{
			href: styles_default,
			rel: "stylesheet"
		}],
		meta: [
			{ charSet: "utf-8" },
			{
				content: "width=device-width, initial-scale=1",
				name: "viewport"
			},
			{ title: "Headless landing page" }
		]
	}),
	loader: () => loadMenu(),
	shellComponent: RootDocument,
	staleTime: Infinity
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$2 = () => import("./routes-BSAJ6YIu.js");
var Route$2 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	loader: () => isFramed() ? null : loadPageFieldValue()
});
//#endregion
//#region src/routes/$.tsx
var $$splitComponentImporter$1 = () => import("./_-fRpU4FoT.js");
var NOT_FOUND = 404;
var Route$1 = createFileRoute("/$")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	loader: async ({ params }) => {
		if (isFramed()) return null;
		try {
			return await loadPageFieldValueByAlias(`/${params._splat ?? ""}`);
		} catch (error) {
			if (error instanceof RestError && error.status === NOT_FOUND) throw notFound();
			throw error;
		}
	}
});
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter = () => import("./about-Behtq6mf.js");
var Route = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	SplatRoute: Route$1.update({
		id: "/$",
		path: "/$",
		getParentRoute: () => Route$3
	}),
	AboutRoute: Route.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => createRouter({
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	routeTree,
	scrollRestoration: true
});
//#endregion
export { getRouter, Route$1 as n, Route$2 as r, router_exports as t };

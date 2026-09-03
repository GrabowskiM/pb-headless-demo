import { a as __toESM, t as require_jsx_runtime } from "./jsx-runtime-CsSE45fb.js";
import { A as invariant, B as isDangerousProtocol, C as trimPathRight, F as deepEqual, J as rootRouteId, R as functionalUpdate, S as trimPathLeft, V as isModuleNotFoundError, Y as require_react, a as dummyMatchContext, d as reactUse, f as useForwardedRef, g as exactPathTest, o as matchContext, q as redirect, s as useRouter, t as getRequestHeader, v as joinPaths, y as removeTrailingSlash, z as hasKeys } from "./request-response-BnN-tzoE.js";
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/route.js
var BaseRoute = class {
	get to() {
		return this._to;
	}
	get id() {
		return this._id;
	}
	get path() {
		return this._path;
	}
	get fullPath() {
		return this._fullPath;
	}
	constructor(options) {
		this.init = (opts) => {
			this.originalIndex = opts.originalIndex;
			const options = this.options;
			const isRoot = !options?.path && !options?.id;
			this.parentRoute = this.options.getParentRoute?.();
			if (isRoot) this._path = rootRouteId;
			else if (!this.parentRoute) invariant();
			let path = isRoot ? rootRouteId : options?.path;
			if (path && path !== "/") path = trimPathLeft(path);
			const customId = options?.id || path;
			let id = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
			if (path === "__root__") path = "/";
			if (id !== "__root__") id = joinPaths(["/", id]);
			const fullPath = id === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
			this._path = path;
			this._id = id;
			this._fullPath = fullPath;
			this._to = trimPathRight(fullPath);
		};
		this.addChildren = (children) => {
			return this._addFileChildren(children);
		};
		this._addFileChildren = (children) => {
			if (Array.isArray(children)) this.children = children;
			if (typeof children === "object" && children !== null) this.children = Object.values(children);
			return this;
		};
		this._addFileTypes = () => {
			return this;
		};
		this.updateLoader = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.update = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.lazy = (lazyFn) => {
			this.lazyFn = lazyFn;
			return this;
		};
		this.redirect = (opts) => redirect({
			from: this.fullPath,
			...opts
		});
		this.options = options || {};
		this.isRoot = !options?.getParentRoute;
		if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
	}
};
var BaseRootRoute = class extends BaseRoute {
	constructor(options) {
		super(options);
	}
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useMatch.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Read and select the nearest or targeted route match.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useMatchHook
*/
function useMatch(opts) {
	const router = useRouter();
	const nearestRouteId = import_react.useContext(opts.from ? dummyMatchContext : matchContext);
	const routeId = opts.from ?? nearestRouteId;
	const matchStore = router.stores.getMatchStore(routeId);
	{
		const match = matchStore.get();
		if (!match) {
			if (opts.shouldThrow ?? true) invariant();
			return;
		}
		return opts.select ? opts.select(match) : match;
	}
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useLoaderData.js
/**
* Read and select the current route's loader data with type‑safety.
*
* Options:
* - `from`/`strict`: Choose which route's data to read and strictness
* - `select`: Map the loader data to a derived value
* - `structuralSharing`: Enable structural sharing for stable references
*
* @returns The loader data (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLoaderDataHook
*/
function useLoaderData(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		structuralSharing: opts.structuralSharing,
		select: (match) => {
			return opts.select ? opts.select(match.loaderData) : match.loaderData;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useLoaderDeps.js
/**
* Read and select the current route's loader dependencies object.
*
* Options:
* - `from`: Choose which route's loader deps to read
* - `select`: Map the deps to a derived value
* - `structuralSharing`: Enable structural sharing for stable references
*
* @returns The loader deps (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLoaderDepsHook
*/
function useLoaderDeps(opts) {
	const { select, ...rest } = opts;
	return useMatch({
		...rest,
		select: (match) => {
			return select ? select(match.loaderDeps) : match.loaderDeps;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useParams.js
/**
* Access the current route's path parameters with type-safety.
*
* Options:
* - `from`/`strict`: Specify the matched route and whether to enforce strict typing
* - `select`: Project the params object to a derived value for memoized renders
* - `structuralSharing`: Enable structural sharing for stable references
* - `shouldThrow`: Throw if the route is not found in strict contexts
*
* @returns The params object (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useParamsHook
*/
function useParams(opts) {
	return useMatch({
		from: opts.from,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		strict: opts.strict,
		select: (match) => {
			const params = opts.strict === false ? match.params : match._strictParams;
			return opts.select ? opts.select(params) : params;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useSearch.js
/**
* Read and select the current route's search parameters with type-safety.
*
* Options:
* - `from`/`strict`: Control which route's search is read and how strictly it's typed
* - `select`: Map the search object to a derived value for render optimization
* - `structuralSharing`: Enable structural sharing for stable references
* - `shouldThrow`: Throw when the route is not found (strict contexts)
*
* @returns The search object (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useSearchHook
*/
function useSearch(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		select: (match) => {
			return opts.select ? opts.select(match.search) : match.search;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useNavigate.js
/**
* Imperative navigation hook.
*
* Returns a stable `navigate(options)` function to change the current location
* programmatically. Prefer the `Link` component for user-initiated navigation,
* and use this hook from effects, callbacks, or handlers where imperative
* navigation is required.
*
* Options:
* - `from`: Optional route base used to resolve relative `to` paths.
*
* @returns A function that accepts `NavigateOptions`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useNavigateHook
*/
function useNavigate(_defaultOpts) {
	const router = useRouter();
	return import_react.useCallback((options) => {
		return router.navigate({
			...options,
			from: options.from ?? _defaultOpts?.from
		});
	}, [_defaultOpts?.from, router]);
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useRouteContext.js
function useRouteContext(opts) {
	return useMatch({
		...opts,
		select: (match) => opts.select ? opts.select(match.context) : match.context
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/link.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Build anchor-like props for declarative navigation and preloading.
*
* Returns stable `href`, event handlers and accessibility props derived from
* router options and active state. Used internally by `Link` and custom links.
*
* Options cover `to`, `params`, `search`, `hash`, `state`, `preload`,
* `activeProps`, `inactiveProps`, and more.
*
* @returns React anchor props suitable for `<a>` or custom components.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLinkPropsHook
*/
function useLinkProps(options, forwardedRef) {
	const router = useRouter();
	const innerRef = useForwardedRef(forwardedRef);
	const { activeProps, inactiveProps, activeOptions, to, preload: userPreload, preloadDelay: userPreloadDelay, preloadIntentProximity: _preloadIntentProximity, hashScrollIntoView, replace, startTransition, resetScroll, viewTransition, children, target, disabled, style, className, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave, onTouchStart, ignoreBlocker, params: _params, search: _search, hash: _hash, state: _state, mask: _mask, reloadDocument: _reloadDocument, unsafeRelative: _unsafeRelative, from: _from, _fromLocation, ...propsSafeToSpread } = options;
	{
		const safeInternal = isSafeInternal(to);
		if (typeof to === "string" && !safeInternal && to.indexOf(":") > -1) try {
			new URL(to);
			if (isDangerousProtocol(to, router.protocolAllowlist)) return {
				...propsSafeToSpread,
				ref: innerRef,
				href: void 0,
				...children && { children },
				...target && { target },
				...disabled && { disabled },
				...style && { style },
				...className && { className }
			};
			return {
				...propsSafeToSpread,
				ref: innerRef,
				href: to,
				...children && { children },
				...target && { target },
				...disabled && { disabled },
				...style && { style },
				...className && { className }
			};
		} catch {}
		const next = router.buildLocation({
			...options,
			from: options.from
		});
		const hrefOption = getHrefOption(next.maskedLocation ? next.maskedLocation.publicHref : next.publicHref, next.maskedLocation ? next.maskedLocation.external : next.external, router.history, disabled);
		const externalLink = (() => {
			if (hrefOption?.external) {
				if (isDangerousProtocol(hrefOption.href, router.protocolAllowlist)) return;
				return hrefOption.href;
			}
			if (safeInternal) return void 0;
			if (typeof to === "string" && to.indexOf(":") > -1) try {
				new URL(to);
				if (isDangerousProtocol(to, router.protocolAllowlist)) return;
				return to;
			} catch {}
		})();
		const isActive = (() => {
			if (externalLink) return false;
			const currentLocation = router.stores.location.get();
			const exact = activeOptions?.exact ?? false;
			if (exact) {
				if (!exactPathTest(currentLocation.pathname, next.pathname, router.basepath)) return false;
			} else {
				const currentPathSplit = removeTrailingSlash(currentLocation.pathname, router.basepath);
				const nextPathSplit = removeTrailingSlash(next.pathname, router.basepath);
				if (!(currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/"))) return false;
			}
			if (activeOptions?.includeSearch ?? true) {
				if (currentLocation.search !== next.search) {
					const currentSearchEmpty = !currentLocation.search || typeof currentLocation.search === "object" && !hasKeys(currentLocation.search);
					const nextSearchEmpty = !next.search || typeof next.search === "object" && !hasKeys(next.search);
					if (!(currentSearchEmpty && nextSearchEmpty)) {
						if (!deepEqual(currentLocation.search, next.search, {
							partial: !exact,
							ignoreUndefined: !activeOptions?.explicitUndefined
						})) return false;
					}
				}
			}
			if (activeOptions?.includeHash) return false;
			return true;
		})();
		if (externalLink) return {
			...propsSafeToSpread,
			ref: innerRef,
			href: externalLink,
			...children && { children },
			...target && { target },
			...disabled && { disabled },
			...style && { style },
			...className && { className }
		};
		const resolvedActiveProps = isActive ? functionalUpdate(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
		const resolvedInactiveProps = isActive ? STATIC_EMPTY_OBJECT : functionalUpdate(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
		const resolvedStyle = (() => {
			const baseStyle = style;
			const activeStyle = resolvedActiveProps.style;
			const inactiveStyle = resolvedInactiveProps.style;
			if (!baseStyle && !activeStyle && !inactiveStyle) return;
			if (baseStyle && !activeStyle && !inactiveStyle) return baseStyle;
			if (!baseStyle && activeStyle && !inactiveStyle) return activeStyle;
			if (!baseStyle && !activeStyle && inactiveStyle) return inactiveStyle;
			return {
				...baseStyle,
				...activeStyle,
				...inactiveStyle
			};
		})();
		const resolvedClassName = (() => {
			const baseClassName = className;
			const activeClassName = resolvedActiveProps.className;
			const inactiveClassName = resolvedInactiveProps.className;
			if (!baseClassName && !activeClassName && !inactiveClassName) return "";
			let out = "";
			if (baseClassName) out = baseClassName;
			if (activeClassName) out = out ? `${out} ${activeClassName}` : activeClassName;
			if (inactiveClassName) out = out ? `${out} ${inactiveClassName}` : inactiveClassName;
			return out;
		})();
		return {
			...propsSafeToSpread,
			...resolvedActiveProps,
			...resolvedInactiveProps,
			href: hrefOption?.href,
			ref: innerRef,
			disabled: !!disabled,
			target,
			...resolvedStyle && { style: resolvedStyle },
			...resolvedClassName && { className: resolvedClassName },
			...disabled && STATIC_DISABLED_PROPS,
			...isActive && STATIC_ACTIVE_PROPS
		};
	}
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var STATIC_DISABLED_PROPS = {
	role: "link",
	"aria-disabled": true
};
var STATIC_ACTIVE_PROPS = {
	"data-status": "active",
	"aria-current": "page"
};
function getHrefOption(publicHref, external, history, disabled) {
	if (disabled) return void 0;
	if (external) return {
		href: publicHref,
		external: true
	};
	return {
		href: history.createHref(publicHref) || "/",
		external: false
	};
}
function isSafeInternal(to) {
	if (typeof to !== "string") return false;
	const zero = to.charCodeAt(0);
	if (zero === 47) return to.charCodeAt(1) !== 47;
	return zero === 46;
}
/**
* A strongly-typed anchor component for declarative navigation.
* Handles path, search, hash and state updates with optional route preloading
* and active-state styling.
*
* Props:
* - `preload`: Controls route preloading (eg. 'intent', 'render', 'viewport', true/false)
* - `preloadDelay`: Delay in ms before preloading on focus, hover, or viewport entry
* - `activeProps`/`inactiveProps`: Additional props merged when link is active/inactive
* - `resetScroll`/`hashScrollIntoView`: Control scroll behavior on navigation
* - `viewTransition`/`startTransition`: Use View Transitions/React transitions for navigation
* - `ignoreBlocker`: Bypass registered blockers
*
* @returns An anchor-like element that navigates without full page reloads.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent
*/
var Link = import_react.forwardRef((props, ref) => {
	const { _asChild, ...rest } = props;
	const { type: _type, ...linkProps } = useLinkProps(rest, ref);
	const children = typeof rest.children === "function" ? rest.children({ isActive: linkProps["data-status"] === "active" }) : rest.children;
	if (!_asChild) {
		const { disabled: _, ...rest } = linkProps;
		return import_react.createElement("a", rest, children);
	}
	return import_react.createElement(_asChild, linkProps, children);
});
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/route.js
var Route = class extends BaseRoute {
	/**
	* @deprecated Use the `createRoute` function instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				select: opts?.select,
				from: this.id,
				structuralSharing: opts?.structuralSharing
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				select: opts?.select,
				structuralSharing: opts?.structuralSharing,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				select: opts?.select,
				structuralSharing: opts?.structuralSharing,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
	}
};
/**
* Creates a non-root Route instance for code-based routing.
*
* Use this to define a route that will be composed into a route tree
* (typically via a parent route's `addChildren`). If you're using file-based
* routing, prefer `createFileRoute`.
*
* @param options Route options (path, component, loader, context, etc.).
* @returns A Route instance to be attached to the route tree.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouteFunction
*/
function createRoute(options) {
	return new Route(options);
}
var RootRoute = class extends BaseRootRoute {
	/**
	* @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				select: opts?.select,
				from: this.id,
				structuralSharing: opts?.structuralSharing
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				select: opts?.select,
				structuralSharing: opts?.structuralSharing,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				select: opts?.select,
				structuralSharing: opts?.structuralSharing,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
	}
};
/**
* Creates a root Route instance used to build your route tree.
*
* Typically paired with `createRouter({ routeTree })`. If you need to require
* a typed router context, use `createRootRouteWithContext` instead.
*
* @param options Root route options (component, error, pending, etc.).
* @returns A root route instance.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRootRouteFunction
*/
function createRootRoute(options) {
	return new RootRoute(options);
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/fileRoute.js
/**
* Creates a file-based Route factory for a given path.
*
* Used by TanStack Router's file-based routing to associate a file with a
* route. The returned function accepts standard route options. In normal usage
* the `path` string is inserted and maintained by the `tsr` generator.
*
* @param path File path literal for the route (usually auto-generated).
* @returns A function that accepts Route options and returns a Route instance.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createFileRouteFunction
*/
function createFileRoute(path) {
	return (options) => {
		const route = createRoute(options);
		route.isRoot = false;
		return route;
	};
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/lazyRouteComponent.js
/**
* Wrap a dynamic import to create a route component that supports
* `.preload()` and friendly reload-on-module-missing behavior.
*
* @param importer Function returning a module promise
* @param exportName Named export to use (default: `default`)
* @returns A lazy route component compatible with TanStack Router
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/lazyRouteComponentFunction
*/
function lazyRouteComponent(importer, exportName) {
	let loadPromise;
	let comp;
	let error;
	const load = () => {
		if (!loadPromise) {
			error = void 0;
			loadPromise = importer().then((res) => {
				comp = res[exportName ?? "default"];
			}).catch((err) => {
				loadPromise = void 0;
				error = err;
			});
		}
		return loadPromise;
	};
	const lazyComp = function Lazy(props) {
		if (error) {
			if (isModuleNotFoundError(error) && false);
			throw error;
		}
		if (!comp) if (reactUse) reactUse(load());
		else throw load();
		return import_react.createElement(comp, props);
	};
	lazyComp.preload = load;
	return lazyComp;
}
//#endregion
//#region src/rest.ts
var REST_URL = "https://master-7rqtwti-gjkhetmruk5p6.eu-5.platformsh.site";
var RestError = class extends Error {
	status;
	constructor(status, path) {
		super(`${path} responded with ${String(status)}`);
		this.status = status;
	}
};
var restFetch = async (path, accept, init) => {
	const headers = new Headers(init?.headers);
	headers.set("Accept", accept);
	const response = await fetch(`${REST_URL}${path}`, {
		...init,
		headers
	});
	if (!response.ok) throw new RestError(response.status, path);
	return await response.json();
};
//#endregion
//#region src/isFramed.ts
var isFramed = () => getRequestHeader("sec-fetch-dest") === "iframe";
//#endregion
//#region src/blocks/ContentListBlock/PersonCard.tsx
var text = (value) => typeof value === "string" ? value : "";
var PersonCard = ({ item }) => {
	const { fields, name, thumbnail } = item;
	const fullName = `${text(fields.first_name)} ${text(fields.last_name)}`.trim() || name;
	const email = text(fields.email);
	const telephone = text(fields.telephone);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "person-card",
		children: [
			thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				alt: fullName,
				className: "person-card__photo",
				height: thumbnail.height,
				src: thumbnail.resource,
				width: thumbnail.width
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "person-card__photo person-card__photo--empty" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "person-card__name",
				children: fullName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "person-card__position",
				children: text(fields.position)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "person-card__contact",
				children: [email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${email}`,
					children: email
				}) : null, telephone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: telephone }) : null]
			})
		]
	});
};
//#endregion
//#region src/blocks/attribute.ts
var attribute$2 = ({ attributes }, name) => attributes.find((candidate) => candidate.name === name)?.value ?? "";
//#endregion
//#region src/blocks/ContentListBlock/ContentListBlock.tsx
var PERSON_CONTENT_TYPE = "person";
var isContentListItems = (value) => Array.isArray(value);
var ContentListBlock = ({ block }) => {
	const items = isContentListItems(block.data) ? block.data : [];
	const isPersonList = attribute$2(block, "contentType") === PERSON_CONTENT_TYPE;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "block-content-list",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: isPersonList ? "person-list" : void 0,
			children: items.map((item) => isPersonList ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonCard, { item }, item.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item.name }, item.id))
		})
	});
};
//#endregion
//#region src/blocks/ContentListBlock/loadContentListItems.ts
var attribute$1 = (block, name) => block.attributes.find((candidate) => candidate.name === name)?.value ?? null;
var loadContentListItems = async (block) => {
	const contentId = attribute$1(block, "contentId");
	const contentType = attribute$1(block, "contentType");
	const limit = Number(attribute$1(block, "limit"));
	if (!contentId || !contentType || !limit) return [];
	const parent = await restFetch(`/api/ibexa/v2/content/objects/${contentId}`, "application/vnd.ibexa.api.ContentInfo+json");
	const parentLocationId = Number(parent.Content.MainLocation._href.split("/").pop());
	return (await restFetch("/api/ibexa/v2/views", "application/vnd.ibexa.api.View+json", {
		body: JSON.stringify({ ViewInput: {
			Query: {
				Filter: {
					ContentTypeIdentifierCriterion: contentType.split(","),
					ParentLocationIdCriterion: parentLocationId
				},
				limit
			},
			identifier: `content-list-${block.id}`,
			public: false
		} }),
		headers: { "Content-Type": "application/vnd.ibexa.api.ViewInput+json" },
		method: "POST"
	})).View.Result.searchHits.searchHit.map(({ value }) => {
		const { CurrentVersion, TranslatedName, _id } = value.Content;
		return {
			fields: Object.fromEntries(CurrentVersion.Version.Fields.field.map((field) => [field.fieldDefinitionIdentifier, field.fieldValue])),
			id: _id,
			name: TranslatedName,
			thumbnail: CurrentVersion.Version.Thumbnail
		};
	});
};
//#endregion
//#region src/blocks/FormBlock/FormBlock.tsx
var isFormDefinition = (value) => typeof value === "object" && value !== null && "fields" in value;
var FieldControl = ({ field }) => {
	const id = `form-field-${field.identifier}`;
	const shared = {
		defaultValue: field.defaultValue,
		id,
		name: field.identifier,
		placeholder: field.placeholder,
		required: field.required
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "form-field",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: id,
				children: [field.label, field.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: " *"
				}) : null]
			}),
			field.type === "multi_line" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				...shared,
				rows: 5
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...shared,
				type: field.type === "email" ? "email" : "text"
			}),
			field.help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: field.help }) : null
		]
	});
};
var FormBlock = ({ block }) => {
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	if (!isFormDefinition(block.data)) return null;
	const { fields, submitLabel, successMessage } = block.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "block-form",
		onSubmit: (event) => {
			event.preventDefault();
			setSubmitted(true);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: block.name }),
			fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldControl, { field }, field.identifier)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				children: submitLabel
			}),
			submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "block-form__success",
				role: "status",
				children: successMessage
			}) : null
		]
	});
};
//#endregion
//#region src/blocks/FormBlock/loadForm.ts
var isFormValue = (value) => typeof value === "object" && value !== null && "fields" in value && Array.isArray(value.fields);
var attribute = (field, identifier) => field.attributes.find((candidate) => candidate.identifier === identifier)?.value ?? "";
var isRequired = (field) => field.validators.some((validator) => validator.identifier === "required" && validator.value === "");
var parseSuccessMessage = (button) => {
	const action = button && attribute(button, "action");
	if (!action) return "Submitted.";
	try {
		const parsed = JSON.parse(action);
		return typeof parsed === "object" && parsed !== null && "message" in parsed && typeof parsed.message === "string" ? parsed.message : "Submitted.";
	} catch {
		return "Submitted.";
	}
};
var RENDERED_TYPES = /* @__PURE__ */ new Set([
	"single_line",
	"email",
	"multi_line"
]);
var loadForm = async (block) => {
	const contentId = block.attributes.find((candidate) => candidate.name === "contentId")?.value;
	if (!contentId) return null;
	const { Version } = await restFetch(`/api/ibexa/v2/content/objects/${contentId}/currentversion`, "application/vnd.ibexa.api.Version+json");
	const formValue = Version.Fields.field.find((field) => field.fieldTypeIdentifier === "ibexa_form")?.fieldValue;
	if (!isFormValue(formValue)) return null;
	const button = formValue.fields.find((field) => field.identifier === "button");
	return {
		fields: formValue.fields.filter((field) => RENDERED_TYPES.has(field.identifier)).map((field) => ({
			defaultValue: attribute(field, "default_value"),
			help: attribute(field, "help"),
			identifier: field.identifier,
			label: field.name,
			placeholder: attribute(field, "placeholder"),
			required: isRequired(field),
			type: field.identifier
		})),
		submitLabel: button?.name ?? "Submit",
		successMessage: parseSuccessMessage(button)
	};
};
//#endregion
//#region src/blocks/GalleryBlock/GalleryBlock.tsx
var isGalleryImages = (value) => Array.isArray(value);
var GalleryBlock = ({ block }) => {
	const images = isGalleryImages(block.data) ? block.data : [];
	if (images.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "block-gallery",
		children: images.map((image) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			alt: image.alternativeText,
			height: image.height,
			src: image.resource,
			width: image.width
		}) }, image.id))
	});
};
//#endregion
//#region src/blocks/GalleryBlock/loadGalleryImages.ts
var LOCATIONS_PREFIX = "/api/ibexa/v2/content/locations";
var GALLERY_LIMIT = 25;
var IMAGE_CONTENT_TYPE = "image";
var toPathString = (locationHref) => `${locationHref.replace(LOCATIONS_PREFIX, "")}/`;
var loadGalleryImages = async (block) => {
	const contentId = block.attributes.find((attribute) => attribute.name === "contentId")?.value;
	if (!contentId) return [];
	const folder = await restFetch(`/api/ibexa/v2/content/objects/${contentId}`, "application/vnd.ibexa.api.ContentInfo+json");
	return (await restFetch("/api/ibexa/v2/views", "application/vnd.ibexa.api.View+json", {
		body: JSON.stringify({ ViewInput: {
			Query: {
				Filter: {
					ContentTypeIdentifierCriterion: [IMAGE_CONTENT_TYPE],
					SubtreeCriterion: toPathString(folder.Content.MainLocation._href)
				},
				limit: GALLERY_LIMIT
			},
			identifier: `gallery-${block.id}`,
			public: false
		} }),
		headers: { "Content-Type": "application/vnd.ibexa.api.ViewInput+json" },
		method: "POST"
	})).View.Result.searchHits.searchHit.flatMap(({ value }) => {
		const { CurrentVersion, TranslatedName, _id } = value.Content;
		const thumbnail = CurrentVersion.Version.Thumbnail;
		return thumbnail ? [{
			alternativeText: TranslatedName,
			id: _id,
			...thumbnail
		}] : [];
	});
};
//#endregion
//#region src/blocks/QuickImageBlock/QuickImageBlock.tsx
var isQuickImage = (value) => typeof value === "object" && value !== null && "resource" in value;
var QuickImageBlock = ({ block }) => {
	if (!isQuickImage(block.data)) return null;
	const { alternativeText, height, resource, width } = block.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
		className: `block-quick-image block-quick-image--${attribute$2(block, "quickstyle")}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			alt: alternativeText,
			height,
			src: resource,
			width
		})
	});
};
//#endregion
//#region src/blocks/QuickImageBlock/loadQuickImage.ts
var isImageFieldValue = (value) => typeof value === "object" && value !== null && "alternativeText" in value;
var loadQuickImage = async (block) => {
	const contentId = block.attributes.find((attribute) => attribute.name === "image")?.value;
	if (!contentId) return null;
	const { Version } = await restFetch(`/api/ibexa/v2/content/objects/${contentId}/currentversion`, "application/vnd.ibexa.api.Version+json");
	if (!Version.Thumbnail) return null;
	const image = Version.Fields.field.find((field) => field.fieldTypeIdentifier === "ibexa_image")?.fieldValue;
	return {
		alternativeText: isImageFieldValue(image) ? image.alternativeText ?? "" : "",
		...Version.Thumbnail
	};
};
//#endregion
//#region src/blockData.ts
var BLOCK_DATA_LOADERS = {
	contentlist: loadContentListItems,
	form: loadForm,
	gallery: loadGalleryImages,
	quick_image: loadQuickImage
};
var loadBlockData = async (fieldValue) => {
	const loaded = /* @__PURE__ */ new Map();
	await Promise.all(fieldValue.zones.flatMap((zone) => zone.blocks).map(async (block) => {
		const load = BLOCK_DATA_LOADERS[block.type];
		if (load) loaded.set(block.id, await load(block));
	}));
	return {
		...fieldValue,
		zones: fieldValue.zones.map((zone) => ({
			...zone,
			blocks: zone.blocks.map((block) => loaded.has(block.id) ? {
				...block,
				data: loaded.get(block.id)
			} : block)
		}))
	};
};
//#endregion
//#region src/pageFieldValue.ts
var PAGE_LOCATION_ID = 431;
var loadFieldValue = async (locationQuery) => {
	const { _id, currentVersionNo } = (await restFetch(`/api/ibexa/v2/content/locations?${locationQuery}`, "application/vnd.ibexa.api.Location+json")).Location.ContentInfo.Content;
	return loadBlockData((await restFetch(`/api/ibexa/v3/page-builder/content/${String(_id)}/versions/${String(currentVersionNo)}/page-field`, "application/json")).fieldValue);
};
var loadPageFieldValue = () => loadFieldValue(`id=${String(PAGE_LOCATION_ID)}`);
var loadPageFieldValueByAlias = (alias) => loadFieldValue(`urlAlias=${encodeURIComponent(alias)}`);
//#endregion
export { FormBlock as a, isFramed as c, lazyRouteComponent as d, createFileRoute as f, GalleryBlock as i, RestError as l, Link as m, loadPageFieldValueByAlias as n, ContentListBlock as o, createRootRoute as p, QuickImageBlock as r, attribute$2 as s, loadPageFieldValue as t, restFetch as u };

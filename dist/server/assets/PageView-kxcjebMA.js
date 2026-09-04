import { a as __toESM, t as require_jsx_runtime } from "./jsx-runtime-CsSE45fb.js";
import { t as require_react } from "./react-C9I8DVWd.js";
import { c as ContentListBlock, i as GalleryBlock, l as attribute, n as QuickImageBlock, o as FormBlock, u as BlockDataContext } from "./QuickImageBlock-BIANY00c.js";
import { t as fetchBlockData } from "./blockData-CC4ebmTz.js";
//#region node_modules/react-error-boundary/dist/react-error-boundary.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var h$1 = (0, import_react.createContext)(null);
var c$2 = {
	didCatch: !1,
	error: null
};
var m$1 = class extends import_react.Component {
	constructor(e) {
		super(e), this.resetErrorBoundary = this.resetErrorBoundary.bind(this), this.state = c$2;
	}
	static getDerivedStateFromError(e) {
		return {
			didCatch: !0,
			error: e
		};
	}
	resetErrorBoundary(...e) {
		const { didCatch: t } = this.state;
		t && (this.props.onReset?.({
			args: e,
			reason: "imperative-api"
		}), this.setState(c$2));
	}
	componentDidCatch(e, t) {
		this.props.onError?.(e, t);
	}
	componentDidUpdate(e, t) {
		const { didCatch: o } = this.state, { resetKeys: s } = this.props;
		o && t.didCatch && C$1(e.resetKeys, s) && (this.props.onReset?.({
			next: s,
			prev: e.resetKeys,
			reason: "keys"
		}), this.setState(c$2));
	}
	render() {
		const { children: e, fallbackRender: t, FallbackComponent: o, fallback: s } = this.props, { didCatch: n, error: a } = this.state;
		let i = e;
		if (n) {
			const u = {
				error: a,
				resetErrorBoundary: this.resetErrorBoundary
			};
			if (typeof t == "function") i = t(u);
			else if (o) i = (0, import_react.createElement)(o, u);
			else if (s !== void 0) i = s;
			else throw a;
		}
		return (0, import_react.createElement)(h$1.Provider, { value: {
			didCatch: n,
			error: a,
			resetErrorBoundary: this.resetErrorBoundary
		} }, i);
	}
};
function C$1(r = [], e = []) {
	return r.length !== e.length || r.some((t, o) => !Object.is(t, e[o]));
}
//#endregion
//#region node_modules/@ibexa/utils/dist/index.js
var import_jsx_runtime = require_jsx_runtime();
var e = (e, t = {}, n = "") => [
	Array.isArray(e) ? e.join(" ") : e,
	Object.entries(t).filter(([, e]) => e).map(([e]) => e).join(" "),
	n
].filter(Boolean).join(" ");
//#endregion
//#region node_modules/@ibexa/utils/dist/page-builder/index.js
var t$1 = [1];
var n$1 = [
	"blocks.dnd",
	"blocks.geometry",
	"blocks.remove",
	"blocks.reveal",
	"blocks.select",
	"pointer.tracking"
];
var r$1 = /* @__PURE__ */ new Map([
	["APP:BLOCK_REMOVE_RESPONSE", "blocks.remove"],
	["APP:DROP_RESPONSE", "blocks.dnd"],
	["APP:MOUSE_POSITION", "pointer.tracking"],
	["APP:POSITIONS_UPDATE", "blocks.geometry"],
	["APP:SCROLL_END", "blocks.geometry"],
	["PB:BLOCK_CLICKED", "blocks.select"],
	["PB:BLOCK_REMOVE", "blocks.remove"],
	["PB:DRAG_END_PREVIEW", "blocks.dnd"],
	["PB:DRAG_OVER", "blocks.dnd"],
	["PB:DRAG_START_PREVIEW", "blocks.dnd"],
	["PB:DROP", "blocks.dnd"],
	["PB:SCROLL_BY", "blocks.dnd"],
	["PB:SCROLL_INTO_BLOCK", "blocks.reveal"]
]);
var a$1 = {
	capabilities: /* @__PURE__ */ new Set(),
	has: () => !1,
	sunset: null,
	version: 1
};
var o$1 = (e, t) => new Set(e.filter((e) => t.includes(e)));
var s$1 = (e = n$1) => ({
	protocol: { supported: t$1 },
	capabilities: [...o$1(n$1, e)]
});
var c$1 = (e, r = n$1, i = t$1) => {
	let { version: a = 1, deprecated: s } = e?.protocol ?? {};
	if (!Number.isInteger(a)) return {
		status: "malformed",
		reason: `Protocol version must be an integer, got ${String(a)}`
	};
	if (!i.includes(a)) return {
		status: "unsupported-version",
		version: a,
		supported: i
	};
	let c = e?.capabilities, l = c === void 0 ? new Set(r) : o$1(r, c);
	return {
		status: "negotiated",
		session: {
			version: a,
			capabilities: l,
			has: (e) => l.has(e),
			sunset: s?.sunset ?? null
		}
	};
};
var l$1 = () => window.parent !== window;
var u$1 = (e) => {
	if (e === "*") throw Error("Wildcard origin \"*\" is not allowed");
	try {
		let { origin: t } = new URL(e);
		return t === "null" ? null : t;
	} catch {
		return null;
	}
};
var d = (e) => {
	let t = a$1, n = /* @__PURE__ */ new Set(), i = (e) => {
		t = e;
	}, o = (e) => {
		let i = r$1.get(e);
		return !i || t.has(i) ? !0 : (n.has(e) || (n.add(e), console.warn(`Blocked "${e}", which needs the capability "${i}" nobody negotiated`)), !1);
	};
	return {
		setNegotiated: i,
		syncToPB: (t, n) => {
			o(t) && window.parent.postMessage({
				type: t,
				data: n
			}, e);
		},
		syncFromPB: (t, n, r = !1) => {
			let i = (r) => {
				if (r.origin !== e) return;
				let { type: i, data: a } = r.data;
				i === t && o(t) && n(a);
			};
			return window.addEventListener("message", i, r), () => window.removeEventListener("message", i, r);
		}
	};
};
var f = "[data-ibexa-block-id]";
var p = "ibexaBlockId";
var m = 500;
var h = 5e3;
var g = 10;
var _ = () => ({ blocks: /* @__PURE__ */ new Map() });
var v = (e, t, n) => {
	let r = [], i = e.length !== n.size;
	return e.forEach((e) => {
		let a = e.dataset[t];
		if (!a) return;
		let { top: o, left: s, right: c, bottom: l } = e.getBoundingClientRect();
		r.push({
			id: a,
			top: o,
			left: s,
			right: c,
			bottom: l
		});
		let u = n.get(a);
		(!u || u.top !== o || u.left !== s || u.right !== c || u.bottom !== l) && (i = !0);
	}), {
		geometry: r,
		hasChanges: i
	};
};
var y = (e, t) => {
	let { geometry: n, hasChanges: r } = v(e.querySelectorAll(f), p, t.blocks);
	return r ? (t.blocks.clear(), n.forEach(({ id: e, ...n }) => t.blocks.set(e, n)), { blocks: n }) : null;
};
var b$1 = ({ onGeometryChange: e, onScrollEnd: t, target: n = document, interval: r = {} }) => {
	let { min: i = m, max: a = h, elapsedMultiplier: o = g } = r, s = _(), c = null, l = null, u = null, d = null, f = null, p = !1, v = () => {
		let t = y(n, s);
		t && e(t);
	}, b = () => {
		c && (d !== null && c.cancelAnimationFrame(d), d = c.requestAnimationFrame(() => {
			d = null, v();
		}));
	}, x = () => {
		let e = performance.now();
		v();
		let t = performance.now() - e;
		f = setTimeout(x, Math.min(Math.max(t * o, i), a));
	}, S = () => {
		p || b();
	}, C = () => {
		p = !1, v(), t?.();
	};
	return {
		start: () => {
			if (!c) {
				if (c = n.defaultView, !c) throw Error("Position tracker needs a document attached to a window");
				l = new c.MutationObserver(b), u = new c.ResizeObserver(b), l.observe(n.body, {
					childList: !0,
					subtree: !0
				}), u.observe(n.body), c.addEventListener("scroll", S, { passive: !0 }), c.addEventListener("scrollend", C, { passive: !0 }), x();
			}
		},
		stop: () => {
			l?.disconnect(), u?.disconnect(), l = null, u = null, c && (c.removeEventListener("scroll", S), c.removeEventListener("scrollend", C), d !== null && c.cancelAnimationFrame(d)), d = null, f !== null && (clearTimeout(f), f = null), p = !1, c = null;
		},
		update: v,
		beginProgrammaticScroll: () => {
			p = !0;
		}
	};
};
var x$1 = (e, { x: t, y: n }) => {
	let r = e.ownerDocument.elementFromPoint(t, n);
	if (!e.contains(r)) return null;
	let i = Array.from(e.querySelectorAll(f)), a = i.findIndex((e) => {
		let { top: t, height: r } = e.getBoundingClientRect();
		return n < t + r / 2;
	});
	return a === -1 ? i.length : a;
};
//#endregion
//#region node_modules/@ibexa/react-headless/dist/index.js
var b = (0, import_react.createContext)(!1);
var x = () => (0, import_react.useContext)(b);
var S = (0, import_react.createContext)({});
var C = () => {
	let e = (0, import_react.useContext)(S);
	return (t, n = {}) => Object.entries(n).reduce((e, [t, n]) => e.replaceAll(`%${t}%`, String(n)), e[t] ?? t);
};
var w = ({ block: e }) => {
	let { type: t, name: n } = e, r = x(), i = C();
	return r ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: i("block.unknown.type", {
		name: n,
		type: t
	}) }) }) : null;
};
var T = (0, import_react.createContext)(null);
var E = () => (0, import_react.useContext)(T);
var D = (e) => {
	let t = E(), n = t.components[e.type];
	if (n) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { block: e });
	let r = t.fallback;
	return r ? r(e) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(w, { block: e });
};
var O = (0, import_react.createContext)([]);
var k = () => (0, import_react.useContext)(O);
var A = (e) => e == null || e === "" ? !0 : !`${e}`.trim().length;
var j = (e, t) => t.visible ? e.attributes.filter((e) => {
	let n = t.attributes.find((t) => t.id === e.name)?.constraints;
	return !Array.isArray(n) && n?.not_blank && A(e.value);
}).map((e) => e.name) : [];
var M = (0, import_react.createContext)(/* @__PURE__ */ new Set());
var N = () => (0, import_react.useContext)(M);
var P = (0, import_react.createContext)(null);
var F = () => (0, import_react.useContext)(P);
var I = 3e3;
var L = ({ block: t, children: n }) => {
	let r = (0, import_react.useRef)(null), [a, c] = (0, import_react.useState)(!1), [f, p] = (0, import_react.useState)(!1), [m, h] = (0, import_react.useState)(N().has(t.id)), g = F(), _ = k().find((e) => e.type === t.type), v = _ ? j(t, _) : [], y = v.length > 0, b = e("c-pb-block-preview__inner", { "c-pb-block-preview__inner--invalid": y }), x = e([
		"landing-page__block",
		`block_${t.type}`,
		"c-pb-block-preview"
	], {
		"c-pb-block-preview--is-dragging-out": a,
		"c-pb-block-preview--is-removing": f,
		"c-pb-block-preview--highlighted": m
	}), S = e("", { "ibexa-mark-invisible": !t.visible });
	return (0, import_react.useEffect)(() => {
		if (!r.current) return;
		let { syncToPB: e, syncFromPB: n } = g, i = new AbortController(), { signal: a } = i;
		return r.current.addEventListener("click", () => {
			e("PB:BLOCK_CLICKED", { blockId: t.id });
		}, { signal: a }), n("PB:SCROLL_INTO_BLOCK", (e) => {
			e.blockId === t.id && r.current && r.current.scrollIntoView({ behavior: "smooth" });
		}, { signal: a }), n("PB:BLOCK_REMOVE", (e) => {
			e.blockId === t.id && p(!0);
		}, { signal: a }), n("PB:DRAG_START_PREVIEW", (e) => {
			e.blockId === t.id && c(!0);
		}, { signal: a }), n("PB:DRAG_END_PREVIEW", (e) => {
			e.blockId === t.id && c(!1);
		}, { signal: a }), n("PB:DROP", () => {
			c(!1);
		}, { signal: a }), () => {
			i.abort();
		};
	}, [t.id, g]), (0, import_react.useEffect)(() => {
		if (!m) return;
		let e = setTimeout(() => h(!1), I);
		return () => clearTimeout(e);
	}, [m]), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: r,
		className: x,
		"data-ibexa-block-id": t.id,
		draggable: a,
		style: {
			position: "relative",
			scrollMargin: "2px"
		},
		onAnimationEnd: (e) => {
			let { syncToPB: n } = g;
			e.animationName === "remove-field" && n("APP:BLOCK_REMOVE_RESPONSE", { blockId: t.id });
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: b,
			children: [y && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "c-pb-block-preview__invalid-attributes",
				children: v.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: `Value for attribute '${e}' is invalid: You must provide value` }, e))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: S,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$1, {
					fallback: null,
					resetKeys: [t],
					children: n
				})
			})]
		})
	});
};
var R = ({ block: e }) => {
	let t = x(), n = D(e);
	return t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
		block: e,
		children: n
	}) : n;
};
var z = ({ block: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$1, {
	fallback: null,
	resetKeys: [t],
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(R, { block: t })
});
var B = (0, import_react.createContext)(void 0);
var V = (0, import_react.createContext)(a$1);
var H = () => (0, import_react.useContext)(V);
var U = (e) => H().has(e);
var W = (0, import_react.createContext)(void 0);
var G = (0, import_react.createContext)(/* @__PURE__ */ new Map());
var K = ({ initData: e, fieldValue: t, children: n }) => {
	let [r, a] = (0, import_react.useState)(e?.blocksConfig ?? []), [c, u] = (0, import_react.useState)(e?.blocksIdMap ?? /* @__PURE__ */ new Map()), [d, f] = (0, import_react.useState)(e?.fieldValue ?? t), [p, m] = (0, import_react.useState)(/* @__PURE__ */ new Set()), g = (0, import_react.useRef)(null), _ = F(), v = U("pointer.tracking"), y = U("blocks.geometry");
	return (0, import_react.useEffect)(() => {
		if (!y) return;
		let { syncToPB: e } = _, t = b$1({
			onGeometryChange: (t) => e("APP:POSITIONS_UPDATE", t),
			onScrollEnd: () => e("APP:SCROLL_END", {})
		});
		return g.current = t, t.start(), () => {
			t.stop(), g.current = null;
		};
	}, [y, _]), (0, import_react.useEffect)(() => {
		if (!v) return;
		let { syncToPB: e } = _, t = ({ clientX: t, clientY: n }) => {
			e("APP:MOUSE_POSITION", {
				x: t,
				y: n
			});
		};
		return window.addEventListener("mousemove", t, { passive: !0 }), () => {
			window.removeEventListener("mousemove", t);
		};
	}, [v, _]), (0, import_react.useEffect)(() => {
		let { syncFromPB: e } = _, t = [
			e("PB:UPDATE_FIELD_DATA", (e) => {
				e && (m(new Set(e.highlightedBlockIds ?? [])), f(e.fieldValue), u(e.blocksIdMap), a(e.blocksConfig));
			}),
			e("PB:SCROLL_BY", (e) => {
				g.current?.beginProgrammaticScroll(), window.scrollBy(e);
			}),
			e("PB:DISPATCH_EVENT", (e) => {
				document.body.dispatchEvent(new CustomEvent(e.eventName, { detail: e.eventDetail }));
			})
		];
		return () => t.forEach((e) => e());
	}, [_]), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(S.Provider, {
		value: e?.translations ?? {},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(W.Provider, {
			value: e?.intentParameters,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(B.Provider, {
				value: d,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(O.Provider, {
					value: r,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(G.Provider, {
						value: c,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(M.Provider, {
							value: p,
							children: n
						})
					})
				})
			})
		})
	});
};
var q = 250;
var J = ({ blockComponents: e, origin: t, fallback: n, children: r, fieldValue: o }) => {
	let [c, u] = (0, import_react.useState)(!1), [d$2, h] = (0, import_react.useState)(), [g, x] = (0, import_react.useState)(a$1), S = t ? u$1(t) : null, C = (0, import_react.useMemo)(() => S ? d(S) : null, [S]), E = (0, import_react.useMemo)(() => ({
		components: e ?? {},
		fallback: n ?? ((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(w, { block: e }))
	}), [e, n]);
	return (0, import_react.useEffect)(() => {
		if (!l$1()) return;
		if (!t) {
			console.warn("Embedded in an iframe, but no origin was provided");
			return;
		}
		if (!C) {
			console.warn(`Embedded in an iframe, but the provided origin is invalid: "${t}"`);
			return;
		}
		let { syncToPB: e, syncFromPB: n } = C, r = () => e("APP:INITIALIZED", s$1()), i = n("PB:INIT_MODE", (e) => {
			clearInterval(a);
			let t = c$1(e);
			if (t.status === "unsupported-version") {
				console.error(`Page Builder chose protocol version ${t.version}, but this build speaks ${t.supported.join(", ")}`);
				return;
			}
			if (t.status === "malformed") {
				console.error(`Page Builder sent a malformed handshake: ${t.reason}`);
				return;
			}
			t.session.sunset && console.warn(`Page Builder stops supporting protocol version ${t.session.version} on ${t.session.sunset}`), C.setNegotiated(t.session), x(t.session), h(e), u(!0);
		});
		r();
		let a = setInterval(r, q);
		return () => {
			clearInterval(a), i();
		};
	}, [C, t]), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(P.Provider, {
		value: C,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(V.Provider, {
			value: g,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(T.Provider, {
				value: E,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.Provider, {
					value: c,
					children: c ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(K, {
						fieldValue: o,
						initData: d$2,
						children: r
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(B.Provider, {
						value: o,
						children: r
					})
				})
			})
		})
	});
};
var Y = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "droppable-placeholder" });
var X = () => (0, import_react.useContext)(B);
var Z = ({ zone: e$1 }) => {
	let n = (0, import_react.useRef)(null), r = (0, import_react.useRef)(e$1.blocks), [c, f] = (0, import_react.useState)(!1), [p, m] = (0, import_react.useState)(null), h = X(), _ = F(), v = C(), y = (0, import_react.useMemo)(() => (h?.zones.findIndex((t) => t.id === e$1.id) ?? -1) + 1, [h, e$1.id]), b = e([
		"landing-page__zone",
		`landing-page__zone--${e$1.id}`,
		"m-page-builder__zone"
	], {
		"m-page-builder__zone--dragover": c,
		"m-page-builder__zone--empty": e$1.blocks.length === 0
	});
	return (0, import_react.useEffect)(() => {
		r.current = e$1.blocks;
	}, [e$1.blocks]), (0, import_react.useEffect)(() => {
		let { syncToPB: t, syncFromPB: i } = _, a = [
			i("PB:UPDATE_FIELD_DATA", () => {
				m(null);
			}),
			i("PB:DRAG_OVER", (e) => {
				let t = n.current ? x$1(n.current, e) : null;
				m(t), f(t !== null);
			}),
			i("PB:DROP", () => {
				f(!1), m((n) => {
					if (n !== null) {
						let i = r.current[n]?.id;
						t("APP:DROP_RESPONSE", {
							zoneId: e$1.id,
							nextBlockId: i
						});
					}
					return null;
				});
			})
		];
		return () => a.forEach((e) => e());
	}, [e$1.id, _]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: n,
		className: b,
		"data-ibexa-zone-id": e$1.id,
		"data-call-to-action-text": v("drag.drop.blocks.here"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fieldset", {
				className: "m-page-builder__fieldset",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "m-page-builder__legend",
					children: v("structure.drop.zone", { number: y })
				})
			}),
			e$1.blocks.map((e, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [n === p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Y, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(z, { block: e })] }, e.id)),
			p === e$1.blocks.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Y, {})
		]
	});
};
var Q = ({ zone: e }) => x() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Z, { zone: e }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: e.blocks.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(z, { block: e }, e.id)) });
//#endregion
//#region src/blocks/RichTextBlock/docbookToHtml.ts
var TAG_MAP = {
	itemizedlist: "ul",
	listitem: "li",
	literal: "code",
	orderedlist: "ol",
	para: "p"
};
var DEFAULT_HEADING_LEVEL = "2";
var convertTitles = (xml) => xml.replace(/<title\b([^>]*)>([\s\S]*?)<\/title>/g, (_match, attributes, content) => {
	const [, level = DEFAULT_HEADING_LEVEL] = /level="([1-6])"/.exec(attributes) ?? [];
	return `<h${level}>${content}</h${level}>`;
});
var convertEmphasis = (xml) => xml.replace(/<emphasis\b[^>]*role="strong"[^>]*>([\s\S]*?)<\/emphasis>/g, "<strong>$1</strong>").replace(/<emphasis\b[^>]*>([\s\S]*?)<\/emphasis>/g, "<em>$1</em>");
var convertLinks = (xml) => xml.replace(/<link\b[^>]*xlink:href="([^"]*)"[^>]*>/g, "<a href=\"$1\">").replace(/<\/link>/g, "</a>");
var convertMappedTags = (xml) => Object.entries(TAG_MAP).reduce((result, [docbook, html]) => result.replace(new RegExp(`<${docbook}\\b[^>]*>`, "g"), `<${html}>`).replace(new RegExp(`</${docbook}>`, "g"), `</${html}>`), xml);
var docbookToHtml = (value) => {
	if (!value.includes("docbook.org")) return value;
	return convertMappedTags(convertLinks(convertEmphasis(convertTitles(value)))).replace(/<\?xml[^>]*\?>\s*/g, "").replace(/<\/?section\b[^>]*>/g, "").replace(/\s(?:ezxhtml|ezcustom|xlink):[\w-]+="[^"]*"/g, "");
};
//#endregion
//#region src/blocks/RichTextBlock/RichTextBlock.tsx
var RichTextBlock = ({ block }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "block-richtext",
	dangerouslySetInnerHTML: { __html: docbookToHtml(attribute(block, "content")) }
});
//#endregion
//#region src/blocks/index.ts
var blockComponents = {
	contentlist: ContentListBlock,
	form: FormBlock,
	gallery: GalleryBlock,
	quick_image: QuickImageBlock,
	richtext: RichTextBlock
};
//#endregion
//#region src/layouts/DefaultLayout.tsx
var DefaultLayout = ({ zones }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "layout layout--default",
	children: zones.map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, { zone }, zone.id))
});
//#endregion
//#region src/layouts/RightSidebarLayout.tsx
var RightSidebarLayout = ({ zones }) => {
	const [hero, main, sidebar] = zones;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "layout layout--right-sidebar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "layout__hero",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, { zone: hero })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "layout__body",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "layout__main",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, { zone: main })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "layout__sidebar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, { zone: sidebar })
			})]
		})]
	});
};
//#endregion
//#region src/layouts/SplitLayout.tsx
var SplitLayout = ({ zones }) => {
	const [hero, ...columns] = zones;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "layout layout--split",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "layout__hero",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, { zone: hero })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "layout__columns",
			children: columns.map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "layout__column",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, { zone })
			}, zone.id))
		})]
	});
};
//#endregion
//#region src/layouts/index.ts
var LAYOUTS = {
	default: DefaultLayout,
	right_sidebar: RightSidebarLayout,
	split: SplitLayout
};
var resolveLayout = (identifier) => LAYOUTS[identifier] ?? DefaultLayout;
//#endregion
//#region src/PageView.tsx
var PB_ORIGIN = "https://master-7rqtwti-gjkhetmruk5p6.eu-5.platformsh.site";
var Zones = () => {
	const data = X();
	if (!data) return null;
	const Layout = resolveLayout(data.layout);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { zones: data.zones }) });
};
var BlockDataProvider = ({ children }) => {
	const isPBMode = x();
	const fieldValue = X();
	const [blockData, setBlockData] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (!isPBMode || !fieldValue) return;
		let active = true;
		fetchBlockData({ data: fieldValue }).then((enriched) => {
			if (!active) return;
			const map = {};
			for (const zone of enriched.zones) for (const block of zone.blocks) if (block.data !== void 0) map[block.id] = block.data;
			setBlockData(map);
		});
		return () => {
			active = false;
		};
	}, [isPBMode, fieldValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockDataContext.Provider, {
		value: blockData,
		children
	});
};
var PageView = ({ fieldValue }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(J, {
	blockComponents,
	fieldValue: fieldValue ?? void 0,
	origin: PB_ORIGIN,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockDataProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zones, {}) })
});
//#endregion
export { PageView as t };

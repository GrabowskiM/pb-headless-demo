import { a as FormBlock, i as GalleryBlock, o as ContentListBlock, r as QuickImageBlock, s as attribute } from "./pageFieldValue-B18vNy9F.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { LandingPage, Zone, useFieldValue } from "@ibexa/react-headless";
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
var RichTextBlock = ({ block }) => /* @__PURE__ */ jsx("div", {
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
var DefaultLayout = ({ zones }) => /* @__PURE__ */ jsx("div", {
	className: "layout layout--default",
	children: zones.map((zone) => /* @__PURE__ */ jsx(Zone, { zone }, zone.id))
});
//#endregion
//#region src/layouts/RightSidebarLayout.tsx
var RightSidebarLayout = ({ zones }) => {
	const [hero, main, sidebar] = zones;
	return /* @__PURE__ */ jsxs("div", {
		className: "layout layout--right-sidebar",
		children: [/* @__PURE__ */ jsx("div", {
			className: "layout__hero",
			children: /* @__PURE__ */ jsx(Zone, { zone: hero })
		}), /* @__PURE__ */ jsxs("div", {
			className: "layout__body",
			children: [/* @__PURE__ */ jsx("div", {
				className: "layout__main",
				children: /* @__PURE__ */ jsx(Zone, { zone: main })
			}), /* @__PURE__ */ jsx("aside", {
				className: "layout__sidebar",
				children: /* @__PURE__ */ jsx(Zone, { zone: sidebar })
			})]
		})]
	});
};
//#endregion
//#region src/layouts/SplitLayout.tsx
var SplitLayout = ({ zones }) => {
	const [hero, ...columns] = zones;
	return /* @__PURE__ */ jsxs("div", {
		className: "layout layout--split",
		children: [/* @__PURE__ */ jsx("div", {
			className: "layout__hero",
			children: /* @__PURE__ */ jsx(Zone, { zone: hero })
		}), /* @__PURE__ */ jsx("div", {
			className: "layout__columns",
			children: columns.map((zone) => /* @__PURE__ */ jsx("div", {
				className: "layout__column",
				children: /* @__PURE__ */ jsx(Zone, { zone })
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
	const data = useFieldValue();
	if (!data) return null;
	const Layout = resolveLayout(data.layout);
	return /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(Layout, { zones: data.zones }) });
};
var PageView = ({ fieldValue }) => /* @__PURE__ */ jsx(LandingPage, {
	blockComponents,
	fieldValue: fieldValue ?? void 0,
	origin: PB_ORIGIN,
	children: /* @__PURE__ */ jsx(Zones, {})
});
//#endregion
export { PageView as t };

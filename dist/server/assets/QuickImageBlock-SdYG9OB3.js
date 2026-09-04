import { a as __toESM, t as require_jsx_runtime } from "./jsx-runtime-CsSE45fb.js";
import { t as require_react } from "./react-C9I8DVWd.js";
//#region src/blocks/ContentListBlock/PersonCard.tsx
var import_jsx_runtime = require_jsx_runtime();
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
var attribute = ({ attributes }, name) => attributes.find((candidate) => candidate.name === name)?.value ?? "";
//#endregion
//#region src/blocks/ContentListBlock/ContentListBlock.tsx
var PERSON_CONTENT_TYPE = "person";
var isContentListItems = (value) => Array.isArray(value);
var ContentListBlock = ({ block }) => {
	const items = isContentListItems(block.data) ? block.data : [];
	const isPersonList = attribute(block, "contentType") === PERSON_CONTENT_TYPE;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "block-content-list",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: isPersonList ? "person-list" : void 0,
			children: items.map((item) => isPersonList ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonCard, { item }, item.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item.name }, item.id))
		})
	});
};
//#endregion
//#region src/blocks/FormBlock/FormBlock.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
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
//#region src/blocks/QuickImageBlock/QuickImageBlock.tsx
var isQuickImage = (value) => typeof value === "object" && value !== null && "resource" in value;
var QuickImageBlock = ({ block }) => {
	if (!isQuickImage(block.data)) return null;
	const { alternativeText, height, resource, width } = block.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
		className: `block-quick-image block-quick-image--${attribute(block, "quickstyle")}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			alt: alternativeText,
			height,
			src: resource,
			width
		})
	});
};
//#endregion
export { attribute as a, ContentListBlock as i, GalleryBlock as n, FormBlock as r, QuickImageBlock as t };

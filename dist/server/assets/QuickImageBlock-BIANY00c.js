import { a as __toESM, t as require_jsx_runtime } from "./jsx-runtime-CsSE45fb.js";
import { t as require_react } from "./react-C9I8DVWd.js";
import { n as restFetch } from "./rest-CUNAaj83.js";
//#region src/blockDataContext.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var BlockDataContext = (0, import_react.createContext)({});
var useBlockData = (block) => {
	const contextData = (0, import_react.useContext)(BlockDataContext);
	return block.data ?? contextData[block.id];
};
//#endregion
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
var attribute$2 = ({ attributes }, name) => attributes.find((candidate) => candidate.name === name)?.value ?? "";
//#endregion
//#region src/blocks/ContentListBlock/ContentListBlock.tsx
var PERSON_CONTENT_TYPE = "person";
var isContentListItems = (value) => Array.isArray(value);
var ContentListBlock = ({ block }) => {
	const data = useBlockData(block);
	const items = isContentListItems(data) ? data : [];
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
	const data = useBlockData(block);
	if (!isFormDefinition(data)) return null;
	const { fields, submitLabel, successMessage } = data;
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
	const data = useBlockData(block);
	const images = isGalleryImages(data) ? data : [];
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
	const data = useBlockData(block);
	if (!isQuickImage(data)) return null;
	const { alternativeText, height, resource, width } = data;
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
export { loadForm as a, ContentListBlock as c, GalleryBlock as i, attribute$2 as l, QuickImageBlock as n, FormBlock as o, loadGalleryImages as r, loadContentListItems as s, loadQuickImage as t, BlockDataContext as u };

import { t as createServerFn } from "./createServerFn-CLui4yE9.js";
import { t as createServerRpc } from "./createServerRpc-DxU7BA32.js";
import { n as restFetch } from "./rest-CUNAaj83.js";
import "./QuickImageBlock-SdYG9OB3.js";
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
//#region src/pageFieldValue.ts?tss-serverfn-split
var PAGE_LOCATION_ID = 431;
var loadFieldValue = async (locationQuery) => {
	const { _id, currentVersionNo } = (await restFetch(`/api/ibexa/v2/content/locations?${locationQuery}`, "application/vnd.ibexa.api.Location+json")).Location.ContentInfo.Content;
	return loadBlockData((await restFetch(`/api/ibexa/v3/page-builder/content/${String(_id)}/versions/${String(currentVersionNo)}/page-field`, "application/json")).fieldValue);
};
var loadPageFieldValue_createServerFn_handler = createServerRpc({
	id: "07eaaa8722eb33ae3203c7ddbb91f9570511c76396cb4453a0eb29744d462b10",
	name: "loadPageFieldValue",
	filename: "src/pageFieldValue.ts"
}, (opts) => loadPageFieldValue.__executeServer(opts));
var loadPageFieldValue = createServerFn().handler(loadPageFieldValue_createServerFn_handler, () => loadFieldValue(`id=${String(PAGE_LOCATION_ID)}`));
var loadPageFieldValueByAlias_createServerFn_handler = createServerRpc({
	id: "aabbd2620dee9144e9d8a08b72556f5a4a0a0965cfe58cfcbe9ff12e6cd02278",
	name: "loadPageFieldValueByAlias",
	filename: "src/pageFieldValue.ts"
}, (opts) => loadPageFieldValueByAlias.__executeServer(opts));
var loadPageFieldValueByAlias = createServerFn().validator((alias) => alias).handler(loadPageFieldValueByAlias_createServerFn_handler, ({ data }) => loadFieldValue(`urlAlias=${encodeURIComponent(data)}`));
//#endregion
export { loadPageFieldValueByAlias_createServerFn_handler, loadPageFieldValue_createServerFn_handler };

import { t as createServerFn } from "./createServerFn-CLui4yE9.js";
import { t as createServerRpc } from "./createServerRpc-DxU7BA32.js";
import { n as restFetch } from "./rest-CUNAaj83.js";
//#region src/menu.ts?tss-serverfn-split
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
var loadMenu_createServerFn_handler = createServerRpc({
	id: "8548759e084dbbea5d3a91d40f15ab9de856185e1e79112e342011640da90c1a",
	name: "loadMenu",
	filename: "src/menu.ts"
}, (opts) => loadMenu.__executeServer(opts));
var loadMenu = createServerFn().handler(loadMenu_createServerFn_handler, async () => {
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
});
//#endregion
export { loadMenu_createServerFn_handler };

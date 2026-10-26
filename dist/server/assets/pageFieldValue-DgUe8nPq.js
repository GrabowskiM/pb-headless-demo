import { t as createServerFn } from "./createServerFn-CLui4yE9.js";
import { t as createServerRpc } from "./createServerRpc-DxU7BA32.js";
import { n as restFetch } from "./rest-C8BOjDKK.js";
import { n as loadBlockData } from "./blockData-B9Jf_YDQ.js";
//#region src/pageFieldValue.ts?tss-serverfn-split
var PAGE_LOCATION_ID = 431;
var loadFieldValue = async (locationQuery) => {
	const { _id, currentVersionNo } = (await restFetch(`/api/ibexa/v2/content/locations?${locationQuery}`, "application/vnd.ibexa.api.Location+json")).Location.ContentInfo.Content;
	const page = await restFetch(`/api/ibexa/v3/page-builder/content/${String(_id)}/versions/${String(currentVersionNo)}/page-field`, "application/json");
	return loadBlockData(page.fieldValue);
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

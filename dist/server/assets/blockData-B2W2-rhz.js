import { t as createServerFn } from "./createServerFn-CLui4yE9.js";
import { t as createServerRpc } from "./createServerRpc-DxU7BA32.js";
import { a as loadForm, r as loadGalleryImages, s as loadContentListItems, t as loadQuickImage } from "./QuickImageBlock-BKYtkibX.js";
//#region src/blockData.ts?tss-serverfn-split
var BLOCK_DATA_LOADERS = {
	contentlist: loadContentListItems,
	form: loadForm,
	gallery: loadGalleryImages,
	quick_image: loadQuickImage
};
var collectBlockData = async (fieldValue) => {
	const entries = await Promise.all(fieldValue.zones.flatMap((zone) => zone.blocks).map(async (block) => {
		const load = BLOCK_DATA_LOADERS[block.type];
		return load ? [block.id, await load(block)] : null;
	}));
	return Object.fromEntries(entries.filter((entry) => entry !== null));
};
var loadBlockData = async (fieldValue) => {
	const loaded = await collectBlockData(fieldValue);
	return {
		...fieldValue,
		zones: fieldValue.zones.map((zone) => ({
			...zone,
			blocks: zone.blocks.map((block) => block.id in loaded ? {
				...block,
				data: loaded[block.id]
			} : block)
		}))
	};
};
var fetchBlockData_createServerFn_handler = createServerRpc({
	id: "d824a6e7846707f533526e40e84a19414d341867c98fb84d04d6238afa00b19c",
	name: "fetchBlockData",
	filename: "src/blockData.ts"
}, (opts) => fetchBlockData.__executeServer(opts));
var fetchBlockData = createServerFn().validator((fieldValue) => fieldValue).handler(fetchBlockData_createServerFn_handler, ({ data }) => loadBlockData(data));
//#endregion
export { fetchBlockData_createServerFn_handler };

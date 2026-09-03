//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/__root.tsx",
		children: [
			"/",
			"/$",
			"/about"
		],
		preloads: [
			"/assets/index-QIRB0Yct.js",
			"/assets/jsx-runtime-BkSabwWG.js",
			"/assets/preload-helper-D3y3kxSp.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-QIRB0Yct.js"
		} }]
	},
	"/": {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/index.tsx",
		children: void 0,
		css: ["/assets/PageView-CtML3J1i.css"],
		preloads: ["/assets/routes-BQsDovzP.js", "/assets/PageView-CQcSiGaT.js"]
	},
	"/$": {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/$.tsx",
		children: void 0,
		css: ["/assets/PageView-CtML3J1i.css"],
		preloads: ["/assets/_-XO0AC8DM.js", "/assets/PageView-CQcSiGaT.js"]
	},
	"/about": {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/about.tsx",
		children: void 0,
		preloads: ["/assets/about-BWYSQro6.js"]
	}
} });
//#endregion
export { tsrStartManifest };

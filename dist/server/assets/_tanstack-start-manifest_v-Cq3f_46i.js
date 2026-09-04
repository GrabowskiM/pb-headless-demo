//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/__root.tsx",
		children: [
			"/",
			"/$",
			"/about"
		],
		preloads: ["/assets/index-D1gJjZe3.js"],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-D1gJjZe3.js"
		} }]
	},
	"/": {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/index.tsx",
		children: void 0,
		css: ["/assets/PageView-CtML3J1i.css"],
		preloads: ["/assets/routes-4zu8ey53.js", "/assets/PageView-CI4qChhw.js"]
	},
	"/$": {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/$.tsx",
		children: void 0,
		css: ["/assets/PageView-CtML3J1i.css"],
		preloads: ["/assets/_-MHHWLWyr.js", "/assets/PageView-CI4qChhw.js"]
	},
	"/about": {
		filePath: "/home/val/ibexa/pb-headless-demo/src/routes/about.tsx",
		children: void 0,
		preloads: ["/assets/about-C9n7c_8X.js"]
	}
} });
//#endregion
export { tsrStartManifest };

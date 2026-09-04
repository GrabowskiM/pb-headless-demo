//#region src/rest.ts
var REST_URL = "https://master-7rqtwti-gjkhetmruk5p6.eu-5.platformsh.site";
var RestError = class extends Error {
	status;
	constructor(status, path) {
		super(`${path} responded with ${String(status)}`);
		this.status = status;
	}
};
var restFetch = async (path, accept, init) => {
	const headers = new Headers(init?.headers);
	headers.set("Accept", accept);
	const response = await fetch(`${REST_URL}${path}`, {
		...init,
		headers
	});
	if (!response.ok) throw new RestError(response.status, path);
	return await response.json();
};
//#endregion
export { restFetch as n, RestError as t };

export default {
	fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === '/') {
			url.pathname = '/en';
			return Response.redirect(url, 308);
		}

		if (url.pathname.endsWith('/')) {
			url.pathname = url.pathname.replace(/\/+$/, '');
			return Response.redirect(url, 308);
		}

		return env.ASSETS.fetch(request);
	},
};

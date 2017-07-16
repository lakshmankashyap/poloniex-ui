function serializeUrlParams(object) {
	var holder = [];
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			holder.push((encodeURIComponent(key) + '=' + encodeURIComponent(object[key])));
		}
	}
	return holder.join('&');
}

export function GET(url, params) {	
	url = `${url}?${serializeUrlParams(params)}`;
	let request = new Request(url, {
		method: 'GET',
		mode: 'cors',
	});
	return fetch(request)
}


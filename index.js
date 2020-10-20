// link object
class Link {
	constructor(name,url)
	{
		this.name = name;
		this.url = url;
	}
}

const links = [
    new Link('Go by Example','https://gobyexample.com/'),
    new Link('Google', 'https://www.google.com/'),
    new Link('GitHub', 'https://github.com/'),
    new Link('Foobiebletch', 'http://foobiebletch.net/'),
    new Link('Cloudflare Workers', 'https://workers.cloudflare.com/'),
];


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

	const uri = request.url.split('/').pop();
	let body; // response body
	let headers = {}; // response headers

	switch(uri){
		case 'links': // respond with json at /links uri
			body = JSON.stringify(links);
    		headers = { 'content-type': 'application/json' };
		break;

		default: // render static html
			const url = 'https://static-links-page.signalnerve.workers.dev/';
			body = await fetch(url) // html
				.then(response => response.text())
				.then(HTML => HTML);

    		headers = { 'content-type': 'text/html' };
	}

  	return new Response(body, { headers: headers });
}

// make link object
const makeLink = (name,url) => {
    return {
        name: name,
        url: url
    };
};

const links = [
    makeLink('Go by Example','https://gobyexample.com/'),
    makeLink('Google', 'https://www.google.com/'),
    makeLink('GitHub', 'https://github.com/'),
    makeLink('Foobiebletch', 'http://foobiebletch.net/'),
    makeLink('Cloudflare Workers', 'https://workers.cloudflare.com/'),
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

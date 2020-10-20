// link object
class Link {
	constructor(name,url)
	{
		this.name = name;
		this.url = url;
	}
}

// for writing links to html
class LinksTransformer {
  constructor(links) {
    this.links = links;
  }
  
  async element(element) {
	element.setInnerContent(
		this.links.map(
			link => `<a href="${link.url}">${link.name}</a>`
		).join(''), {html: true});
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

			const response = await fetch(url);
			const targetElement = 'div#links';
			return new HTMLRewriter().on(targetElement, new LinksTransformer(links)).transform(response);
	}

  	return new Response(body, { headers: headers });
}

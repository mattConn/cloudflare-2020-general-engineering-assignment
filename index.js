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

// for modifyng inline styles via HTMLRewriter
class StyleSetter {
	constructor(styles) {
		// style object {rule: value}
		this.styles = styles;
	}

	async element(element) {
		// no styles specified, clear styles
		if(!this.styles)
		{
			element.setAttribute('style','');
			return;
		}

		// transform style object to valid style formatted string
		// no quotes, no curly braces, commas to semicolons
		element.setAttribute('style',
			JSON.stringify(this.styles).replace(/{|}|\"/g,'').replace(/,/g,';'));
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

	// handle favicon request, write header not body
	if(request.url.endsWith('favicon.ico'))
		return new Response(null, {headers: {'content-type' : 'image/png'}});

	// handle links request, write header and json
	if(request.url.endsWith('links'))
		return new Response(JSON.stringify(links), {headers: {'content-type' : 'application/json'}});

	// handle all other requests by writing and rewriting static html
	const url = 'https://static-links-page.signalnerve.workers.dev/';
	const response = await fetch(url);

	return new HTMLRewriter()
		.on('div#links', new LinksTransformer(links))
		.on('div#profile', new StyleSetter(null)).transform(response);
}

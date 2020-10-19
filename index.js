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
	let content;
	let headers = {};

	switch(uri){
		case 'links': // respond with json at /links uri
			content = JSON.stringify(links);
    		headers = { 'content-type': 'application/json' };
		break;

		default:
			content = uri; // respond with uri
    		headers = { 'content-type': 'text/html' };
	}

  	return new Response(content, { headers: headers });
}

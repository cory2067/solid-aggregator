# solid-aggregator

Aggregates encrypted user data using homomorphic encryption. Uses [seal.js](https://github.com/cory2067/seal.js) a JavaScript wrapper of Microsoft's [SEAL](http://sealcrypto.org/) encrypion library.

# server
Exposes an API, as impemented in `/routes/api.js`.
This API provides the following functionality:
- Submit a new study (`POST /api/study`)
- List all existing studies (`GET /api/studies`)
- Submit encrypted data, as returned by [cory2067/node-solid-server](https://github.com/cory2067/node-solid-server) (`POST /api/submit`)
- Compute an aggregate for a study (`GET /api/aggregate`)

# client
A frontend for users (who want to participate in studies) and researchers (who want to open a new study). Note that users of normal pod providers (inrupt, solid.community, etc.) cannot submit data via this site. Instead, the pod must be running on my [modified server](https://github.com/cory2067/node-solid-server). 

The user tab is straightforward. Specify any documents on your pod to grant access to, and push submit to consent to a study.

The researcher page, out of laziness for making a decent UI, just accepts a JSON blob. This must follow this kind of format:

```
{ 
    "organization": "Test Study",
    "summary": "What is the average age of Solid users?",
    "key": "https://solid-aggregator.xyz/static/researcherpublic.key",
    "function": "average(?age)",
    "query": "PREFIX foaf: <http://xmlns.com/foaf/0.1/> SELECT ?age WHERE { ?user foaf:age ?age. }"
}
```

The function supports `sum`, `average`, `count`, and `ratio`. The functions `count` and `ratio` must contain a conditional expression, e.g. `count(?age > 15)`. 

# in development 
Just open the `client` and `server` directories in two separate windows, then run `npm install` and `npm start` on each.

# in production
The branch `production` shows some last-minute changes I made to make this work in production. - Use https, or else the authentication libraries will just refuse to work. 
 - Replace all instances of http or port 5000 with https and port 80. (why did I do this...)
 - Build the client directory using `npm run build` and have the express server statically serve that build directory

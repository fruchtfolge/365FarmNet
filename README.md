# 365FarmNet Connect - Node.js client
A simple promise based client for the [365FarmNet Connect REST API](https://developer.365farmnet.com/).

## Quick start
```
npm install 365farmnet
```
**Note:** This library requires Node.js > v.10.0

Import the library, and pass the partner ID and secret that you got from 
registering at [https://devcon.365farmnet.com/](https://devcon.365farmnet.com/).

```js
const farmnet = require('365farmnet')({
  partnerId: 'yourPartnerId',
  secret: 'yourPartnerSecret'
})
```

Make requests to the 365FarmNet Connect REST API by calling the imported function 
(`farmnet` if you follow this example) in the following manner:

```js
// farmnettoken is the JWT that is passed to the iframe within the 
// 365FarmNet main application
farmnet('fields', {
  token: farmnettoken,
  params: {
    includeGeometry: false,
    includeSoilType: true
  }
}).then(data => {
  // data will contain all fields of the farm
}).catch(err => {
  console.log(err)
})

```

## API
The module exports a default function. 
It takes two arguments:

### `farmnet('endpoint', options)`
| Name                                  | Description                                                                          |
|:--------------------------------------|:-------------------------------------------------------------------------------------|
| **endpoint** *string* *required*      | The REST API endpoint to call. See documentation for all available endpoints.        |
| **options.token** *string* *required* | The `token` property of the `options object` needs to be a valid JWT `farmnettoken`. |
| **options.params** *object*           | Optional query params for the API call.                                              |
| **options.data** *object*             | Optional body params for the API call (for POST/PUT requests).                       |
| **options.method** *string*           | Default: 'GET'. Can be any HTTP request method valid for the given endpoint.         |

### Testing
Fork this repo, then put a `credentials.js` file in the root directory with the following content.

```js
// content of the credentials.js file, which needs to be placed at the root of this repo
module.exports = {
  partnerId: 'your_partner_id',
  secret: 'your_secret'
}
```

Then run 
```
npm test
```

This will spin up an *Express.js* server on http://localhost:3000/.

Login to your account at https://devcon.365farmnet.com/, 
click on the Developer tab -> Developer Playground.
If all tests pass, you should see `All test passed!`, if not, check your console 😄


### Contribution
Please feel free to submit an issue or a pull request!

### License
MIT

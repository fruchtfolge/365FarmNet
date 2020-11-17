const express = require('express')
const assert = require('assert')
// load credentials file including 365farmnet partnerId, secret,
const credentials = require('../credentials')
const app = express()

const farmnet = require('..')({
  partnerId: credentials.partnerId,
  secret: credentials.secret,
})

app.get('/', async (req, res) => {
  try {
    // get the jwt token from the url query parameter
    const jwt = req.query.jwt
    // Assert company endpoint and optional query parameters
    const company = await farmnet('company', {
      token: jwt,
      params: {
        includeAccountOwner: true,
        includeLocation: false,
      },
    })

    // check if the accountOwner id is a string,
    // I know this is a lazy test but sp please do a PR if you read this
    /// and  got the time to implement something better
    assert.strictEqual(typeof company.accountOwner.id, 'string')

    // Assert no endpoint error
    await assert.rejects(
      async () => {
        await farmnet('', {
          token: credentials.farmnettoken,
        })
      },
      {
        name: 'Error',
        message: 'No 365farment API endpoint specified.',
      }
    )

    // Assert no endpoint query options error
    assert.rejects(
      async () => {
        await farmnet('company')
      },
      {
        name: 'Error',
        message: 'No 365farmnet query options passed.',
      }
    )

    // Assert wrong 365farmnet token error
    await assert.rejects(
      async () => {
        await farmnet('company', { token: 'wrongToken' })
      },
      {
        name: 'Error',
        message: 'Invalid 365farmnet token.',
      }
    )

    // Assert no 365farmnet token error
    await assert.rejects(
      async () => {
        await farmnet('company', {})
      },
      {
        name: 'Error',
        message: 'No 365farmnet token passed.',
      }
    )
    res.send('Passed all test!')
  } catch (e) {
    console.error(e)
    res.status(500).send('Test failed ' + e)
  }
})

app.listen(3000, () => {
  console.log(
    '365 farmnet test page ready on port 3000!\n\n' +
      'Login to your account at https://devcon.365farmnet.com/,\n' +
      'click on the Developer tab -> Developer Playground\n' +
      'and check for potential errors.'
  )
})

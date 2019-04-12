const assert = require('assert')
// load credentials file including 365farmnet partnerId, secret,
// and a valid JWT token
const credentials = require('../credentials')

const farmnet = require('../index.js')({
  partnerId: credentials.partnerId,
  secret: credentials.secret
})

;(async () => {
  try {
    // Assert company endpoint and optional query parameters
    const company = await farmnet('company', {
      token: credentials.farmnettoken,
      params: {
        includeAccountOwner: false,
        includeLocation: false
      }
    })

    const expectedCompany = {
      accountOwner: null,
      location: null,
      registrationCountry: 'de',
      currency: 'EUR'
    }

    assert.deepEqual(company, expectedCompany)

    // Assert no endpoint error
    assert.rejects(
      async () => {
        await farmnet('', {
          token: credentials.farmnettoken
        })
      },
      {
        name: 'Error',
        message: 'Error: No 365farment API endpoint specified.'
      }
    )

    // Assert no endpoint query options error
    assert.rejects(
      async () => {
        await farmnet('company')
      },
      {
        name: 'Error',
        message: 'Error: No 365farmnet query options passed.'
      }
    )

    // Assert wrong 365farmnet token error
    assert.rejects(
      async () => {
        await farmnet('company', { token: 'wrongToken' })
      },
      {
        name: 'Error',
        message: 'Error: Error: Error: Invalid 365farmnet token.'
      }
    )

    // Assert no 365farmnet token error
    assert.rejects(
      async () => {
        await farmnet('company', {})
      },
      {
        name: 'Error',
        message: 'Error: No 365farmnet token passed.'
      }
    )
  } catch (e) {
    console.log(e)
  }
})()

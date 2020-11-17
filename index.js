'use strict'

const fs = require('fs')
const util = require('util')
const jwt = require('jsonwebtoken')
const axios = require('axios')

const verify = util.promisify(jwt.verify)
const sign = util.promisify(jwt.sign)
const readFile = util.promisify(fs.readFile)

module.exports = function (credentials) {
  if (!credentials || !credentials.partnerId || !credentials.secret)
    throw Error('No partner id or secret.')

  async function request(endpoint, options) {
    // check if options were passed correctly
    checkQuery(endpoint, options)
    const partnerToken = await getPartnerToken(options.token)
    const apiBase = getApiBase(options.token)
    let method = 'GET'
    if (options.method) method = options.method
    const url = `${apiBase}/connect/v1/${endpoint}`

    const query = {
      method,
      url,
      params: options.params,
      data: options.data,
      headers: {
        Authorization: `Bearer ${partnerToken}`,
      },
    }
    const { data } = await axios(query)
    return data
  }

  function checkQuery(endpoint, options) {
    if (!endpoint) throw Error('No 365farment API endpoint specified.')
    if (!options) throw Error('No 365farmnet query options passed.')
    else if (!options.token) throw Error('No 365farmnet token passed.')
  }

  function getApiBase(farmnettoken) {
    const decoded = jwt.decode(farmnettoken)
    if (!decoded) throw Error('Invalid 365farmnet token.')
    const apiBase = decoded['fn-ext'].apiBase
    return apiBase
  }

  async function getPublicKey(farmnettoken) {
    const apiBase = getApiBase(farmnettoken)
    let pemKey = 'development'
    if (
      apiBase === 'https://connect.365farmnet.com' ||
      apiBase === 'https://pp-connect.365farmnet.com'
    ) {
      pemKey = 'production'
    }
    // load development or production public key
    const publicKey = await readFile(
      `${__dirname}/keys/365FarmNet_Connect-API_public_key_${pemKey}.pem`
    )
    return publicKey
  }

  async function getPartnerToken(farmnettoken) {
    const publicKey = await getPublicKey(farmnettoken)
    await verify(farmnettoken, publicKey)
    const payload = {
      con: farmnettoken,
      iss: credentials.partnerId,
    }
    const options = {
      expiresIn: '1d',
      header: {
        ver: '0.1',
        type: 'partner',
      },
    }
    const partnerToken = await sign(payload, credentials.secret, options)
    return partnerToken
  }

  return request
}

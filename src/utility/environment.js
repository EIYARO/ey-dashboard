/* global process */

import chainSdk from 'sdk'
import { store } from 'app'

import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'

let apiHost, basename
if (process.env.NODE_ENV === 'production') {
  apiHost = window.location.origin
  basename = '/dashboard'
} else {
  apiHost = process.env.API_URL || 'http://localhost:9888'
  basename = ''
}

export const chainClient = () => new chainSdk.Client({
  url: apiHost,
  accessToken: store.getState().core.clientToken
})

export const chainSigner = () => new chainSdk.HsmSigner()

// react-router history object
export const history = useRouterHistory(createHistory)({
  basename: basename
})

export const eyID = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const pageSize = 25
export const UTXOpageSize = 10

export const testnetInfoUrl = process.env.TESTNET_INFO_URL || 'https://testnet-info.chain.com'
export const testnetUrl = process.env.TESTNET_GENERATOR_URL || 'https://testnet.chain.com'
export const docsRoot = 'https://github.com/eiyaro/eiyaro/wiki'

export const releaseUrl = 'https://github.com/Eiyaro/eiyaro/releases'

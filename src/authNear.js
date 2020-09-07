import { Contract, keyStores, WalletConnection, Near } from 'near-api-js'

import render from './render'
import { checkStatuses as checkTransferStatuses } from './transfers'

// Create a Near config object
const near = new Near({
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  networkId: process.env.nearNetworkId,
  nodeUrl: process.env.nearNodeUrl,
  helperUrl: process.env.nearHelperUrl,
  walletUrl: process.env.nearWalletUrl
})

// Initialize main interface to NEAR network
window.nearConnection = new WalletConnection(near)

// Getting the Account ID. If still unauthorized, it's an empty string
window.nearUserAddress = window.nearConnection.getAccountId()

const button = document.querySelector('[data-behavior=authNear]')

button.onclick = function login () {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf. This works by creating a new access key for the user's
  // account and storing the private key in localStorage.
  window.nearConnection.requestSignIn(process.env.nearFunTokenAccount)
}

async function login () {
  const span = document.createElement('span')
  span.innerHTML = `Connected to NEAR as <code>${window.nearUserAddress}</code>`
  button.replaceWith(span)

  window.nep21 = await new Contract(window.nearConnection.account(), process.env.nearFunTokenAccount, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_balance'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: []
  })

  render()

  // start checking statuses of in-flight transfers after both NEAR & Ethereum
  // logins complete – if Eth login not yet done, this is a no-op
  checkTransferStatuses(render)
}

// The NEAR signin flow redirects from the current URL to NEAR Wallet,
// returning to the current URL afterward, so we can rely on this whole set of
// JS being re-evaluated after NEAR auth
if (window.nearUserAddress) login()

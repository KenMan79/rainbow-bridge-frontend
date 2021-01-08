import BN from 'bn.js'
import { Contract as NearContract, utils } from 'near-api-js'
import './authEthereum'
import './authNear'
import { find, findAll, fill, hide, initDOMhandlers, onClick, show, toString } from './domHelpers'
import { getErc20Name } from './ethHelpers'
import render from './render'
import * as urlParams from './urlParams'
import * as transfers from './transfers'

// Can't import modules in <script> tags in files included via PostHTML 😞
window.BN = BN
window.find = find
window.findAll = findAll
window.fill = fill
window.getErc20Name = getErc20Name
window.hide = hide
window.NearContract = NearContract
window.onClick = onClick
window.parseNearAmount = utils.format.parseNearAmount
window.render = render
window.show = show
window.toString = toString
window.transfers = transfers
window.urlParams = urlParams

initDOMhandlers()
render()

transfers.onChange(render)

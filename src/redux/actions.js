import { SWITCH_NETWORK } from './actionTypes'

export const switchNetwork= network => ({
    type: SWITCH_NETWORK,
    payload: { network }
})
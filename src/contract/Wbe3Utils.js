import Web3 from 'web3';
import React from 'react';
import config from 'config';
// import { MetaMask_CONF_URL } from '../constants';
import store from '../redux/store';

const {setting} = store.getState()
const network = setting.network

console.log('net', network)

const Wbe3Utils = new Web3(config[network].provider);
export default Wbe3Utils;

export const AppContext = React.createContext({
    walletVisible: false,
    toggleWalletVisible: () => {},
    web3Instance: null,
    poolListRefresh: false,
    togglePLR: () => {},
});

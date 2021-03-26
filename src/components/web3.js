import Web3 from "web3";
import config from 'config'

import store from '../redux/store';

const {setting} = store.getState()

const network = setting.network



const web3 = new Web3(config[network].provider);

export {
    web3
}

export default web3
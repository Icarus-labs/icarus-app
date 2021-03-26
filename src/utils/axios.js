import axios from 'axios'
import config from 'config'

import store from '../redux/store';

const {setting} = store.getState()

const network = setting.network

const instance = axios.create({
    baseURL: config[network].baseURL,
})

export default instance
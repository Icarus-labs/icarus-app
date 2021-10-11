import Web3 from "web3";
import Config from "../config";
import FarmAbi from "./abi/Farm.json";
import mm from "components/mm";
import BN from "bignumber.js";
// import * as Tools from "../utils/Tools";
// import { PancakeswapPair } from "simple-pancakeswap-sdk";
import config from "config";
import FactoryContractApi from "./FactoryContractApi";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

const swapMediumTokens = config[network].swapMediumTokens;
const cakeAddress = config[network].contracts.cake;

export default {
  async getPoolInfo(pid, wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      FarmAbi,
      Config[network].contracts.farm
    );

    try {
      return contract.methods.poolInfo(pid);
    } catch (err) {
      console.log(err);
    }
  },
};

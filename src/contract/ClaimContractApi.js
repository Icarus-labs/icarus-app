import Web3 from "web3";
import Config from "../config";
import ClaimAbi from "./abi/Claim.json";
import mm from "components/mm";
// import BN from "bignumber.js";
// import * as Tools from "../utils/Tools";
// import { PancakeswapPair } from "simple-pancakeswap-sdk";
// import config from "config";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async balanceOf(wallet) {
    const web3 = new Web3(wallet.ethereum);
    const tokenContract = new web3.eth.Contract(
      ClaimAbi,
      Config[network].contracts.claim
    );

    return new Promise((resolve, reject) => {
      tokenContract.methods
        .balanceOf(wallet.account)
        .call()
        .then((res) => {
          resolve(Web3.utils.fromWei(res));
        })
        .catch((err) => {
          console.log("Error", err);
          reject(err);
        });
    });
  },

  async claim(wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      ClaimAbi,
      Config[network].contracts.claim
    );

    return new Promise((resolve, reject) => {
      return contract.methods
        .claim()
        .send({
          from: wallet.account,
        })
        .on("transactionHash", function (transactionHash) {
          mm.listen(transactionHash, "Claim");
          return transactionHash;
        })
        .on("receipt", (receipt) => {
          resolve(receipt);
        })
        .on("error", function (error) {
          reject(error);
          console.log("error", error);
        });
    });
  },
};

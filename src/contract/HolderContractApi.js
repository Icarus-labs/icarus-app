import Web3 from "web3";
import Config from "../config";
import HolderAbi from "./abi/Holder.json";
// import Wbe3Utils from "./Wbe3Utils";
import * as Tools from "../utils/Tools";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async claim(index, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        HolderAbi,
        Config[network].contracts.holder
      );

      return contract.methods
        .claim(String(index))
        .send({
          from: wallet.account,
        })
        .on("transactionHash", function (transactionHash) {
          return transactionHash;
        })
        .on("receipt", (receipt) => {
          return receipt;
        })
        .on("error", function (error) {
          console.log("error", error);
        });
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async open(wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        HolderAbi,
        Config[network].contracts.holder
      );

      return contract.methods
        .open()
        .send({
          from: wallet.account,
        })
        .on("transactionHash", function (transactionHash) {
          return transactionHash;
        })
        .on("receipt", (receipt) => {
          return receipt;
        })
        .on("error", function (error) {
          console.log("error", error);
        });
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  /**
   * 获取余额
   */
  async balanceOf(wallet) {
    // const network = setting.network;
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      HolderAbi,
      Config[network].contracts.holder
    );

    try {
      const balances = await contract.methods.balanceOf(wallet.account).call({
        from: wallet.account,
      });

      console.log("balancess", balances);

      return Tools.numDivDecimals(balances, Config[network].decimal);
    } catch (err) {
      console.log(err);
      return 0;
    }
  },
};

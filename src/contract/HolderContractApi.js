import Web3 from "web3";
import Config from "../config";
import HolderAbi from "./abi/Holder.json";
// import Wbe3Utils from "./Wbe3Utils";
import mm from "components/mm";
import * as Tools from "../utils/Tools";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async claim(boxId, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        HolderAbi,
        Config[network].contracts.holder
      );

      return new Promise((resolve, reject) => {
        return contract.methods
          .claim(boxId)
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
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async open(boxId, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        HolderAbi,
        Config[network].contracts.holder
      );

      contract.events.allEvents((error, event) => {
        console.log("event", event);
      });

      return new Promise((resolve, reject) => {
        return contract.methods
          .open(boxId)
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Open");
            return transactionHash;
          })
          .on("receipt", (receipt) => {
            resolve(receipt);
          })
          .on("error", function (error) {
            reject();
            console.log("error", error);
          });
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

import Web3 from "web3";
import Config from "../config";
import StakerAbi from "./abi/Staker.json";
import mm from "components/mm";
import * as Tools from "../utils/Tools";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async lock(amount, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        StakerAbi,
        Config[network].contracts.staker
      );

      return new Promise((resolve, reject) => {
        contract.methods
          .lock(Web3.utils.toWei(amount, "ether"))
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Staking");
            return transactionHash;
          })
          .on("receipt", (receipt) => {
            // console.log("LptenTokenContract receipt", receipt);
            resolve(receipt);
          })
          .on("error", function (error) {
            console.log("error", error);
            // errorFun();
          });
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async redeem(wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        StakerAbi,
        Config[network].contracts.staker
      );

      return new Promise((resolve, reject) => {
        contract.methods
          .redeem()
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Redeem");
            return transactionHash;
          })
          .on("receipt", (receipt) => {
            resolve(receipt);
          })
          .on("error", function (error) {
            console.log("error", error);
          });
      });
    } catch (err) {
      return false;
    }
  },

  /**
   * 获取余额
   */
  async balanceOf(wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      StakerAbi,
      Config[network].contracts.staker
    );

    try {
      const balances = await contract.methods.balanceOf(wallet.account).call({
        from: wallet.account,
      });

      return Number(web3.utils.fromWei(balances.lockedAmount));
    } catch (err) {
      console.log(err);
      return 0;
    }
  },
};

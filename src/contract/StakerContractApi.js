import Web3 from "web3";
import Config from "../config";
import StakerAbi from "./abi/Staker.json";
// import Wbe3Utils from "./Wbe3Utils";
import * as Tools from "../utils/Tools";

import store from "../redux/store";
import { notification } from "antd";

const { setting } = store.getState();
const network = setting.network;

export default {
  async lock(
    amount,
    wallet
    // pendingFun = () => {},
    // receiptFun = () => {},
    // errorFun = () => {}
  ) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        StakerAbi,
        Config[network].contracts.staker
      );

      notification.info({
        message: "Staking",
      });

      return contract.methods
        .lock(Web3.utils.toWei(amount, "ether"))
        .send({
          from: wallet.account,
        })
        .on("transactionHash", function (transactionHash) {
          // console.log('pending...', transactionHash);
          // pendingFun(transactionHash);

          return transactionHash;
        })
        .on("receipt", (receipt) => {
          console.log("LptenTokenContract receipt", receipt);
          // receiptFun(receipt);
          notification.info({
            message: `Staked vICA, Tx Hash: ${receipt.transactionHash} `,
          });
          return receipt;
        })
        .on("error", function (error) {
          console.log("error", error);
          // errorFun();
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

      return contract.methods
        .redeem()
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
      StakerAbi,
      Config[network].contracts.staker
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

import Web3 from "web3";
import { message } from "antd";
import Config from "../config";
import Erc20Abi from "./abi/ERC20.json";
// import Wbe3Utils from "./Wbe3Utils";
import * as Tools from "../utils/Tools";

import store from "../redux/store";

// const { setting } = store.getState();
// const network = setting.network;

export default {
  async getAllowance(tokenAddress, contractAddress, wallet) {
    const web3 = new Web3(wallet.ethereum);
    const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);

    return new Promise((resolve, reject) => {
      tokenContract.methods
        .allowance(wallet.account, contractAddress)
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    });
  },

  async doApprove(tokenAddress, contractAddress, wallet) {
    const web3 = new Web3(wallet.ethereum);
    const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);

    new Promise((resolve, reject) => {
      tokenContract.methods
      .approve(contractAddress, Web3.utils.toWei("10000000000000", "ether"))
      .send({ from: wallet.account })
      .then((res) => {
        message.success({
          message: "Successfully Approved",
          txHash: res.transactionHash,
        });
        // setAllowanceTrigger((prev) => prev + 1);
        console.log("approve success", res);
        resolve()
      })
      .catch((err) => {
        // setApproving(false);
        reject(err)
        console.log(err);
      })
      .finally(() => {
        resolve()
        // setApproving(false);
      });
    })
  },
};

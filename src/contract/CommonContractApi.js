import Web3 from "web3";
import { message, notification } from "antd";
import config from "../config";
import Erc20Abi from "./abi/ERC20.json";
import BoxPairAbi from "./abi/BoxPair.json";
// import Wbe3Utils from "./Wbe3Utils";
// import * as Tools from "../utils/Tools";

// import store from "../redux/store";

import store from "../redux/store";
const { setting } = store.getState();
const network = setting.network;

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

  async balanceOf(tokenAddress, wallet) {
    const web3 = new Web3(wallet.ethereum);
    const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);

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

  async bnbBalance(wallet) {
    const web3 = new Web3(wallet.ethereum);

    return new Promise((resolve, reject) => {
      web3.eth
        .getBalance(wallet.account)
        .then((res) => {
          resolve(Web3.utils.fromWei(res));
        })
        .catch((err) => {
          console.log("Error", err);
          reject(err);
        });
    });
  },

  async doApprove(tokenAddress, contractAddress, wallet) {
    const web3 = new Web3(wallet.ethereum);
    const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
    return new Promise((resolve, reject) => {
      notification.info({
        message: "Approving",
      });
      tokenContract.methods
        .approve(contractAddress, Web3.utils.toWei("10000000000000", "ether"))
        .send({ from: wallet.account })
        .then((res) => {
          notification.success({
            message: "Successfully Approved",
            description: `Tx Hash: ${res.transactionHash}`,
          });
          resolve();
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        })
        .finally(() => {
          resolve();
        });
    });
  },

  async getBoxPrice(wallet) {
    const web3 = new Web3(wallet.ethereum);
    const tokenContract = new web3.eth.Contract(
      BoxPairAbi,
      config[network].contracts.box
    );

    return new Promise((resolve, reject) => {
      tokenContract.methods
        .getReserves()
        .call()
        .then((res) => {
          const price = res._reserve0 / res._reserve1;
          resolve(price);
          // resolve(Web3.utils.fromWei(res));
        })
        .catch((err) => {
          console.log("Error", err);
          reject(err);
        });
    });
  },

  async getSymbol(tokenAddress, wallet) {
    const web3 = new Web3(wallet.ethereum);
    const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
    return new Promise(async (resolve, reject) => {
      try {
        const symbol = await tokenContract.methods.symbol().call();
        resolve(symbol);
      } catch (err) {
        reject(err);
      }

      // .then((res) => {
      //   resolve(res);
      // })
      // .catch((err) => {
      //   reject(err);
      // });
    });
  },
};

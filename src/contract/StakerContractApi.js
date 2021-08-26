import Web3 from "web3";
import Config from "../config";
import StakerAbi from "./abi/Staker.json";
// import Wbe3Utils from "./Wbe3Utils";
import * as Tools from "../utils/Tools";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async lock(
    amount,
    wallet,
    pendingFun = () => {},
    receiptFun = () => {},
    errorFun = () => {}
  ) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        StakerAbi,
        Config[network].contracts.staker
      );

      return contract.methods
        .lock(Web3.utils.toWei(amount, 'ether'))
        .send({
          from: wallet.account,
        })
        .on("transactionHash", function (transactionHash) {
          // console.log('pending...', transactionHash);
          pendingFun(transactionHash);
          return transactionHash;
        })
        .on("receipt", (receipt) => {
          // console.log('LptenTokenContract receipt', receipt);
          receiptFun(receipt);
          return receipt;
        })
        .on("error", function (error) {
          console.log("error", error);
          errorFun();
        });
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  /**
   * 获取 Claim余额
   * @param {*}
   * @param {*}
   */
  async balanceOf(wallet) {
    // const network = setting.network;
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      StakerAbi,
      Config[network].contracts.staker
    );

    try {
      const balances = await contract.methods.balanceOf().call({
        from: wallet.account,
      });

      return Tools.numDivDecimals(balances, Config[network].decimal);
    } catch (err) {
      console.log(err);
      return 0;
    }
  },
};

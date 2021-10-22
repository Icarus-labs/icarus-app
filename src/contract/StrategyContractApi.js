import Web3 from "web3";
import StrategyAbi from "./abi/Strategy.json";
import mm from "components/mm";

import store from "../redux/store";

export default {

  async earn(strategyAddress, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        StrategyAbi,
        strategyAddress
      );

      return new Promise((resolve, reject) => {
        contract.methods
          .earn()
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Earn");
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
};

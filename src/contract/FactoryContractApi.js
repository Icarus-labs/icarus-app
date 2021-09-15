import Web3 from "web3";
import Config from "../config";
import FactoryAbi from "./abi/Factory.json";
import mm from "components/mm";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async getPair(tokenA, tokenB, wallet){
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      FactoryAbi,
      Config[network].contracts.factory
    );

    const pairAddress = await contract.methods.getPair(tokenA, tokenB).call()
    return pairAddress
  },
  async createPair(tokenA, tokenB, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        FactoryAbi,
        Config[network].contracts.factory
      );

      return new Promise((resolve, reject) => {
        contract.methods
          .createPair(tokenA, tokenB)
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Staking");
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
      
      console.log(err);
      return false;
    }
  },
};

import Web3 from "web3";
import Config from "../config";
import FarmAbi from "./abi/Farm.json";
import mm from "components/mm";
import BN from "bignumber.js";
import CommonContractApi from "contract/CommonContractApi";
import { getTokenPrice } from "utils/coingecko";
import config from "config";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async getTotalLocked(pid, wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      FarmAbi,
      Config[network].contracts.farm
    );

    try {
      const result = await contract.methods
        .stakedWantTokens(pid, wallet.account)
        .call();
      return web3.utils.fromWei(result);
    } catch (err) {
      console.log(err);
    }
  },
  async getTVL(tokenAddress, poolInfo, wallet) {
    const totalSupply = await CommonContractApi.totalSupply(
      tokenAddress,
      wallet
    );
    let totalValue = 0;
    let price = 0;
    const { tokens } = poolInfo;
    // 暂时不考虑3币情况
    if (tokens.length === 2) {
      console.log('hereee')
      const reserve0Price = await getTokenPrice(tokens[0]);
      const reserve1Price = await getTokenPrice(tokens[1]);
      const reserves = await CommonContractApi.getReserves(
        tokenAddress,
        wallet
      );



      totalValue =
        reserves._reserve0 * reserve0Price + reserves._reserve1 * reserve1Price;

      price = totalValue / totalSupply;
    } else {
      price = await getTokenPrice(tokens[0]);
    }

    const totalLocked = await this.getTotalLocked(poolInfo.pid, wallet);

    return price * totalLocked;
  },
  async getPoolInfo(pid, wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      FarmAbi,
      Config[network].contracts.farm
    );

    try {
      return contract.methods.poolInfo(pid).call();
    } catch (err) {
      console.log(err);
    }
  },

  async getDeposited(pid, wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      FarmAbi,
      Config[network].contracts.farm
    );

    try {
      const result = await contract.methods
        .stakedWantTokens(pid, wallet.account)
        .call();
      return web3.utils.fromWei(result);
    } catch (err) {
      console.log(err);
    }
  },
  async getPendingReward(pid, wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      FarmAbi,
      Config[network].contracts.farm
    );

    try {
      const result = await contract.methods
        .pendingReward(pid, wallet.account)
        .call();
      return web3.utils.fromWei(result);
    } catch (err) {
      console.log(err);
    }
  },
  async deposit(pid, amount, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        FarmAbi,
        Config[network].contracts.farm
      );

      return new Promise((resolve, reject) => {
        contract.methods
          .deposit(pid, Web3.utils.toWei(new BN(amount).toFixed(18), "ether"))
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Deposit");
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
  async withdraw(pid, amount, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        FarmAbi,
        Config[network].contracts.farm
      );

      return new Promise((resolve, reject) => {
        contract.methods
          .withdraw(pid, Web3.utils.toWei(new BN(amount).toFixed(18), "ether"))
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Withdraw");
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
  async withdrawAll(pid, wallet) {
    try {
      const web3 = new Web3(wallet.ethereum);

      const contract = new web3.eth.Contract(
        FarmAbi,
        Config[network].contracts.farm
      );

      return new Promise((resolve, reject) => {
        contract.methods.withdrawAll
          .send({
            from: wallet.account,
          })
          .on("transactionHash", function (transactionHash) {
            mm.listen(transactionHash, "Withdraw All");
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

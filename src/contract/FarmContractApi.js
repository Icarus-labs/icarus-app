import Web3 from "web3";
import Config from "../config";
import FarmAbi from "./abi/Farm.json";
import RemoteFarmAbi from "./abi/RemoteFarm.json";
import mm from "components/mm";
import BN from "bignumber.js";
import CommonContractApi from "contract/CommonContractApi";
import Erc20Abi from "./abi/ERC20.json";
import { getTokenPrice } from "utils/coingecko";
// import config from "config";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

export default {
  async getTokenLpPrice(tokenLpAddress, tokens, wallet) {
    const web3 = new Web3(wallet.ethereum);
    let price = 0;

    const totalSupply = await CommonContractApi.totalSupply(
      tokenLpAddress,
      wallet
    );

    let totalValue = 0;
    if (tokens.length === 2) {
      const reserve0Price = await getTokenPrice(tokens[0]);
      const reserve1Price = await getTokenPrice(tokens[1]);
      const reserves = await CommonContractApi.getReserves(
        tokenLpAddress,
        wallet
      );

      totalValue =
        web3.utils.fromWei(reserves._reserve0) * reserve0Price +
        web3.utils.fromWei(reserves._reserve1) * reserve1Price;

      price = totalValue / totalSupply;
    } else {
      price = await getTokenPrice(tokens[0]);
    }
    return price;
  },
  async getApy(pid, poolInfo, tokens, wallet) {
    const { allocPoint, want } = poolInfo;
    const web3 = new Web3(wallet.ethereum);
    // const contract = new web3.eth.Contract(
    //   FarmAbi,
    //   Config[network].contracts.farm
    // );

    const tokenContract = new web3.eth.Contract(Erc20Abi, want);

    const remoteContract = new web3.eth.Contract(
      RemoteFarmAbi,
      Config[network].contracts.remoteFarm
    );

    try {
      const totalAllocPoint = await remoteContract.methods
        .totalAllocPoint()
        .call();

      const cakePerBlock = new BN(
        await remoteContract.methods.cakePerBlock().call()
      ).shiftedBy(-18);

      const lpBalance = new BN(
        await tokenContract.methods
          .balanceOf(Config[network].contracts.remoteFarm)
          .call()
      ).shiftedBy(-18);

      const lpPrice = await this.getTokenLpPrice(want, tokens, wallet);

      const cakePrice = await getTokenPrice("pancakeswap-token");

      const remoteFarmApr = new BN(allocPoint)
        .div(totalAllocPoint)
        .times(cakePerBlock)
        .times(cakePrice)
        .div(lpBalance)
        .div(lpPrice);

      const yearlyApy = remoteFarmApr.times(10512000).times(100).toFixed(2).toString();
      const dailyApy = remoteFarmApr.times(28800).times(100).toFixed(2).toString();

      return {
        dailyApy,
        yearlyApy,
      };
    } catch (err) {
      console.log(err);
    }
  },
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
  async getTVL(tokenLpAddress, poolInfo, wallet) {
    const { tokens } = poolInfo;
    // 暂时不考虑3币情况
    const price = await this.getTokenLpPrice(tokenLpAddress, tokens, wallet);

    const totalLocked = await this.getTotalLocked(poolInfo.pid, wallet);

    return new BN(price).times(totalLocked).toFixed(2);
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
            mm.listen(transactionHash, amount == 0 ? "Claim" : "Withdraw");
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

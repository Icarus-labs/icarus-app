import Web3 from "web3";
import Config from "../config";
import RouterAbi from "./abi/Router.json";
import mm from "components/mm";
import BN from "bignumber.js";
// import * as Tools from "../utils/Tools";
// import { PancakeswapPair } from "simple-pancakeswap-sdk";
import config from "config";
import FactoryContractApi from "./FactoryContractApi";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

const swapMediumTokens = config[network].swapMediumTokens;
const cakeAddress = config[network].contracts.cake;

// const getBestRoute = async (amountIn, fromAddress, toAddress, wallet) => {
//   const pancakeswapPair = new PancakeswapPair({
//     // the contract address of the token you want to convert FROM
//     fromTokenContractAddress: fromAddress,
//     // the contract address of the token you want to convert TO
//     toTokenContractAddress: toAddress,
//     // the ethereum address of the user using this part of the dApp
//     ethereumAddress: wallet.account || config[network].contracts.bnb,
//   });

//   const PancakeswapPairFactory = await pancakeswapPair.createFactory();

//   const bestRoute = await PancakeswapPairFactory.findBestRoute(amountIn);

//   console.log("best route is", bestRoute);

//   return bestRoute.bestRouteQuote;
// };

export default {
  async getBestRoute(amountsIn, fromAddress, toAddress, wallet) {
    let bestRoute = {
      amountsOut: 0,
    };

    const amountsOut0 = await this.getAmountsOutByPath(
      amountsIn,
      [fromAddress, toAddress],
      wallet
    );

    if (bestRoute.amountsOut < amountsOut0) {
      bestRoute.amountsOut = amountsOut0;
      bestRoute.path = [fromAddress, toAddress];
    }

    console.log("amount 0", amountsOut0);

    for (let i = 0; i < swapMediumTokens.length; i++) {
      const mediumToken = swapMediumTokens[i];
      try {
        const amountsOut1 = await this.getAmountsOutByPath(
          amountsIn,
          [fromAddress, mediumToken, toAddress],
          wallet
        );

        if (bestRoute.amountsOut < amountsOut1) {
          bestRoute.amountsOut = amountsOut1;
          bestRoute.path = [fromAddress, mediumToken, toAddress];
        }

        console.log("amount 1", amountsOut1);

        const amountsOut2 = await this.getAmountsOutByPath(
          amountsIn,
          [fromAddress, cakeAddress, mediumToken, toAddress],
          wallet
        );
        console.log("amount2 ", amountsOut2);

        if (bestRoute.amountsOut < amountsOut2) {
          bestRoute.amountsOut = amountsOut2;
          bestRoute.path = [fromAddress, cakeAddress, mediumToken, toAddress];
        }
      } catch (err) {
        console.log("error", err);
      }
    }
    return bestRoute;
  },
  async checkPairExists(tokenA, tokenB, wallet) {
    return await FactoryContractApi.getPair(tokenA, tokenB, wallet);
  },

  async getAmountsOutByPath(amountIn, path, wallet) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      RouterAbi,
      Config[network].contracts.router
    );

    try {
      const amounts = await contract.methods
        .getAmountsOut(Web3.utils.toWei(amountIn), path)
        .call();

      return Web3.utils.fromWei(amounts[amounts.length - 1]);
    } catch (err) {
      console.log("error", err);
    }
  },

  async getAmountsOut(amountIn, fromAddress, toAddress, wallet) {
    return await this.getBestRoute(amountIn, fromAddress, toAddress, wallet);
  },

  async swapExactTokensForTokens(
    amountIn,
    fromToken,
    toToken,
    slippage,
    wallet
  ) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      RouterAbi,
      Config[network].contracts.router
    );

    const bestRoute = await this.getBestRoute(
      amountIn,
      fromToken.address,
      toToken.address,
      wallet
    );

    const path = bestRoute.path;

    const amountOutMin = new BN(bestRoute.amountsOut)
      .times(new BN(1).minus(new BN(slippage).div(100)))
      .toFixed(12);

    console.log("aaa", amountOutMin);
    console.log(Web3.utils.toWei(amountOutMin), "bbbb");

    return new Promise((resolve, reject) => {
      return contract.methods
        .swapExactTokensForTokens(
          Web3.utils.toWei(amountIn),
          Web3.utils.toWei(bestRoute.amountsOut),
          path,
          wallet.account,
          parseInt(Date.now() / 1000) + 30 * 60
        )
        .send({
          from: wallet.account,
        })
        .on("transactionHash", function (transactionHash) {
          mm.listen(transactionHash, "Swap");
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
  },

  async swapExactETHForTokens(
    amountIn,
    fromToken,
    toToken,
    slippage,
    wallet
  ) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      RouterAbi,
      Config[network].contracts.router
    );

    const bestRoute = await this.getBestRoute(
      amountIn,
      fromToken.address,
      toToken.address,
      wallet
    );

    const path = bestRoute.path;

    const amountOutMin = new BN(bestRoute.amountsOut)
      .times(new BN(1).minus(new BN(slippage).div(100)))
      .toFixed(12);

    //todo, add slippage support
    console.log("aaa", amountOutMin);
    console.log(Web3.utils.toWei(amountOutMin), "bbbb");

    return new Promise((resolve, reject) => {
      return contract.methods
        .swapExactETHForTokens(
          Web3.utils.toWei(bestRoute.amountsOut),
          path,
          wallet.account,
          parseInt(Date.now() / 1000) + 30 * 60
        )
        .send({
          from: wallet.account,
          value: Web3.utils.toWei(amountIn)
        })
        .on("transactionHash", function (transactionHash) {
          mm.listen(transactionHash, "Swap");
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
  },
};

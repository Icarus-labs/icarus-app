import Web3 from "web3";
import Config from "../config";
import RouterAbi from "./abi/Router.json";
import mm from "components/mm";
// import * as Tools from "../utils/Tools";
import { PancakeswapPair } from "simple-pancakeswap-sdk";
import config from "config";

import store from "../redux/store";

const { setting } = store.getState();
const network = setting.network;

const getBestRoute = async(amountIn, fromAddress, toAddress) => {
  const pancakeswapPair = new PancakeswapPair({
    // the contract address of the token you want to convert FROM
    fromTokenContractAddress: fromAddress,
    // the contract address of the token you want to convert TO
    toTokenContractAddress: toAddress,
    // the ethereum address of the user using this part of the dApp
    ethereumAddress: config[network].contracts.bnb,
  });

  const PancakeswapPairFactory = await pancakeswapPair.createFactory();

  const bestRoute = await PancakeswapPairFactory.findBestRoute(amountIn);
  console.log("best route is ", bestRoute);

  return bestRoute.bestRouteQuote
}

export default {
  // replace with sdk
  // async getAmountsOut(amountIn, path, wallet) {
  //   const web3 = new Web3(wallet.ethereum);

  //   const contract = new web3.eth.Contract(
  //     RouterAbi,
  //     Config[network].contracts.router
  //   );

  //   const amounts = await contract.methods
  //     .getAmountsOut(Web3.utils.toWei(amountIn), path)
  //     .call();

  //   return Web3.utils.fromWei(amounts[amounts.length - 1]);
  // },
  async getAmountsOut(amountIn, fromToken, toToken) {
    const bestRoute = await getBestRoute(amountIn, fromToken.address, toToken.address)

    return bestRoute;
  },
  async swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    fromToken,
    toToken,
    wallet
  ) {
    const web3 = new Web3(wallet.ethereum);

    const contract = new web3.eth.Contract(
      RouterAbi,
      Config[network].contracts.router
    );

    const bestRoute = await getBestRoute(amountIn, fromToken.address, toToken.address)

    // calculate path here
    const path = bestRoute.routePathArray;

    return new Promise((resolve, reject) => {
      return contract.methods
        .swapExactTokensForTokens(
          Web3.utils.toWei(amountIn),
          Web3.utils.toWei(amountOutMin),
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
};

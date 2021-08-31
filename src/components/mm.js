import { subscribe } from "@nextcloud/event-bus";
import { watchTransaction } from "components/utils";
import config from "config";
import store from "../redux/store";

const { setting } = store.getState();

async function sendTransaction(transactionParameters, desc) {
  // approvedActionParam will be called when approvement is approved

  const network = setting.network;
  return new Promise(async (resolve, reject) => {
    await window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          { ...transactionParameters[0], chainId: config[network].chainId },
        ],
      })
      .then(async (txHash) => {
        let previousActionObj =
          JSON.parse(localStorage.getItem("actionObj")) || {};
        previousActionObj[txHash] = {
          desc: transactionParameters[0].isApprove ? `Approve ${desc}` : desc,
          action: transactionParameters[1] ? [transactionParameters[1]] : "",
        };
        localStorage.setItem("actionObj", JSON.stringify(previousActionObj));

        subscribe(txHash, (val) => {
          resolve(val);
        });

        watchTransaction(txHash);
      })
      .catch((error) => {
        resolve(false);
        // me.$message.error(me.$t("hint.rejected"));
      });
  });
}

// 监听调用合约的事件
async function listen(txHash, desc) {
  return new Promise(async (resolve, reject) => {
    let previousActionObj = JSON.parse(localStorage.getItem("actionObj")) || {};
    previousActionObj[txHash] = {
      desc
    };
    localStorage.setItem("actionObj", JSON.stringify(previousActionObj));

    subscribe(txHash, (val) => {
      resolve(val);
    });

    watchTransaction(txHash);
  });
}

export default {
  sendTransaction,
  listen
};

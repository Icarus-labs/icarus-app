import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useSelector } from "react-redux";

import NetworkModal from "components/NetworkModal";
import config, { chainIdMapping } from "config";
import "./style.scss";

export default function ConnectWallet(props) {
  const { triggerConnect } = props;
  const [networkError, setNetworkError] = useState("");
  const network = useSelector((state) => state.setting.network);
  const wallet = useWallet();

  useEffect(() => {
    window.addEventListener("ethereum#initialized", connectWallet, {
      once: true,
    });

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        connectWallet();
      });

      window.ethereum.on("chainChanged", (chainId) => {
        connectWallet();
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = () => {
    if (window.ethereum) {
      const configChainId = config[network].chainId;
      const walletChainId = parseInt(
        window.ethereum ? window.ethereum.chainId : ""
      );

      if (
        walletChainId &&
        !isNaN(walletChainId) &&
        configChainId !== walletChainId
      ) {
        if (configChainId === 56) {
          switchNetwork();
        } else {
          setNetworkError(
            `${chainIdMapping[configChainId]}, your wallet id is ${walletChainId}`
          );
        }
      } else {
        setNetworkError("");
      }

      if (wallet && wallet.status !== "connected") {
        wallet.connect();
      }
    } else {
      alert("Wallet not found on your device");
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) {
      return;
    }
    const configChainId = config[network].chainId;

    // 如果配置的是BSC主网，那么就提示用户更改链接
    if (configChainId !== 56) {
      return;
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${configChainId.toString(16)}`,
          chainName: "Binance Smart Chain",
          nativeCurrency: {
            name: "BNB",
            symbol: "bnb",
            decimals: 18,
          },
          rpcUrls: ["https://bsc-dataseed.binance.org"],
          blockExplorerUrls: ["https://bscscan.com/"],
        },
      ],
    });
  };

  useEffect(() => {
    if (triggerConnect) {
      connectWallet();
    }
  }, []);

  return (
    <div>
      <a
        className="btn"
        onClick={() => {
          connectWallet();
        }}
      >
        Connect Wallet
      </a>

      {networkError && (
        <NetworkModal
          networkError={networkError}
          onCancel={() => {
            setNetworkError("");
          }}
        />
      )}
    </div>
  );
}

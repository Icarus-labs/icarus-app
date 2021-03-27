import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { Link } from "react-router-dom";
import { Tooltip, Dropdown, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { connect, useSelector } from "react-redux";
import LogoLight from "assets/logo.svg";
import axios from "utils/axios";
import NetworkModal from "components/NetworkModal";
import ICALogo from "assets/tokens/ica.svg";
import config, { chainIdMapping } from "config";
import "./style.scss";

export default function AppHeader() {
  const [networkError, setNetworkError] = useState("");
  const network = useSelector((state) => state.setting.network);
  const [icaBalance, setIcaBalance] = useState("");
  const wallet = useWallet();
  const { account } = wallet;

  const mobileMenu = (
    <Menu>
      <Menu.Item>
        <a href="https://icarus.finance" target="_blank">
          HOME
        </a>
      </Menu.Item>
      <Menu.Item>
        <Link to="/mine">MINE</Link>
      </Menu.Item>
      <Menu.Item>
        <a
          href="https://app.dodoex.io/exchange/BUSD-0xdbeb98858f5d4dca13ea0272b2b786e9415d3992"
          target="_blank"
        >
          BUY
        </a>
      </Menu.Item>
      {/* <Menu.Item>
        <a
          href="https://icarus-finance.medium.com/connecting-your-wallet-and-staking-zeth-f35787e50ab2"
          target="_blank"
        >
          GUIDES
        </a>
      </Menu.Item> */}
    </Menu>
  );

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

  //todo, here getting ZETH
  const getAssetBalance = async () => {
    const { account } = wallet;
    console.log("ready to get", account);
    if (!account) {
      return;
    }
    const result = await axios.get(`/zeth/presale/balances?address=${account}`);
    setIcaBalance(result.data.data.ica_pretty);
  };

  useEffect(() => {
    if (account) {
      getAssetBalance();
    }
  }, [account]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAssetBalance();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div class="container">
      <header className="app-header">
        <div className="header-left">
          <Dropdown className="mobile-nav" overlay={mobileMenu}>
            <MenuOutlined className="menu-icon" />
          </Dropdown>
          <Link to="/" className="logo-text">
            <img src={LogoLight} />
            ICARUS.FINANCE
          </Link>
        </div>

        <ul className="nav">
          <li>
            <a href="https://icarus.finance" target="_blank">
              HOME
            </a>
          </li>
          <li>
            <Link to="/buy">BUY</Link>
          </li>
          <li>
            <Link to="/mine">MINE</Link>
          </li>
          {/* <li>
          <a
            href="https://icarus-finance.medium.com/connecting-your-wallet-and-staking-zeth-f35787e50ab2"
            target="_blank"
          >
            GUIDES
          </a>
        </li> */}
          {/* <li>
          <Link to="/boardroom">BOARDROOM</Link>
        </li> */}
        </ul>
        <div>
          <a className="btn-trans">
            <img src={ICALogo} /> ${Number(icaBalance)}
          </a>
          {wallet.status === "connected" ? (
            <Tooltip title={account}>
              <a className="btn">
                {account.slice(0, 4)}...{account.slice(-4)}
              </a>
            </Tooltip>
          ) : (
            <a
              className="btn"
              onClick={() => {
                connectWallet();
              }}
            >
              {/* <span className="red-dot"></span> */}
              Connect Wallet
            </a>
          )}
        </div>
      </header>
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

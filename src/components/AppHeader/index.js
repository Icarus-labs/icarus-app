import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { Link } from "react-router-dom";
import { Tooltip, Dropdown, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import LogoLight from "assets/logo.svg";
import axios from "utils/axios";
import ConnectWallet from "components/ConnectWallet";
import ICALogo from "assets/tokens/ica.svg";
import "./style.scss";

export default function AppHeader() {
  // const network = useSelector((state) => state.setting.network);
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
    </Menu>
  );

  //todo, here getting ZETH
  const getAssetBalance = async () => {
    const { account } = wallet;
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

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-left">
          <Dropdown className="mobile-nav" overlay={mobileMenu}>
            <MenuOutlined className="menu-icon" />
          </Dropdown>
          <Link to="/" className="logo-text">
            <img src={LogoLight} className="icon" />
            ICARUS.FINANCE
          </Link>
        </div>
        <div>
          {wallet.status === "connected" ? (
            <>
              <a className="btn-trans">
                <img src={ICALogo} /> {Number(icaBalance).toFixed(3)}
              </a>
              <Tooltip title={account}>
                <a className="btn">
                  {account.slice(0, 4)}...{account.slice(-4)}
                </a>
              </Tooltip>
            </>
          ) : (
            <ConnectWallet triggerConnect={true} />
          )}
        </div>
      </header>
    </div>
  );
}

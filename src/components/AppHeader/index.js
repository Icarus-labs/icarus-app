import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
// import { Link } from "react-router-dom";
import { Tooltip, Switch, Dropdown, Menu } from "antd";
import { useSelector, useDispatch } from "react-redux";

// import { MenuOutlined } from "@ant-design/icons";
import HomeIcon from "assets/home-icon.svg";
import VoteIcon from "assets/vote-icon.svg";
import MoonIcon from "assets/moon.svg";
import ModeIcon from "assets/mode.svg";
// import LogoLight from "assets/logo.svg";
import axios from "utils/axios";
import ConnectWallet from "components/ConnectWallet";
import ICALogo from "assets/tokens/ica.svg";
import "./style.scss";

export default function AppHeader() {
  // const network = useSelector((state) => state.setting.network);
  const mode = useSelector((state) => state.setting.mode);
  const theme = useSelector((state) => state.setting.theme);
  const [icaBalance, setIcaBalance] = useState("");
  const wallet = useWallet();
  const dispatch = useDispatch();
  const { account } = wallet;

  const changeTheme = (param) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: {
        theme: param ? "purple" : "light",
      },
    });
  };

  const changeMode = (param) => {
    dispatch({
      type: "SWITCH_MODE",
      payload: {
        mode: param ? "card" : "line",
      },
    });
  };

  // const mobileMenu = (
  //   <Menu>
  //     <Menu.Item>
  //       <a href="https://icarus.finance" target="_blank">
  //         HOME
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <Link to="/mine">MINE</Link>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a
  //         href="https://app.dodoex.io/exchange/BUSD-0xdbeb98858f5d4dca13ea0272b2b786e9415d3992"
  //         target="_blank"
  //       >
  //         BUY
  //       </a>
  //     </Menu.Item>
  //   </Menu>
  // );

  //todo, here getting ZETH
  const getAssetBalance = async () => {
    const { account } = wallet;
    if (!account) {
      return;
    }
    const result = await axios.get(`/zeth/presale/balances?address=${account}`);
    if (result && result.data && result.data.data) {
      setIcaBalance(result.data.data.ica_pretty);
    }
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
          {/* <Dropdown className="mobile-nav" overlay={mobileMenu}>
            <MenuOutlined className="menu-icon" />
          </Dropdown> */}
          {/* <Link to="/" className="logo-text">
            <img src={LogoLight} className="icon" />
            ICARUS.FINANCE
          </Link> */}
          <div className="handle-area">
            <div className="block">
              <a
                href="https://icarus.finance"
                target="_blank"
                className="home-icon-link"
              >
                <img className="home-icon icon" src={HomeIcon} />
              </a>
            </div>
            <div className="block">
              <img className="moon-icon icon" src={MoonIcon} />
              <Switch
                className="option-switch"
                checked={theme === "purple"}
                onChange={changeTheme}
              />
            </div>
            <div className="block">
              <img className="mode-icon icon" src={ModeIcon} />
              <Switch
                className="option-switch"
                checked={mode === "card"}
                onChange={changeMode}
              />
            </div>
            <div className="block">
              <a
                href="https://vote.icarus.finance"
                target="_blank"
                className="home-icon-link"
              >
                <img className="home-icon icon" src={VoteIcon} />
              </a>
            </div>
          </div>
        </div>
        <div className="header-right">
          {wallet.status === "connected" && account ? (
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

import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
// import { Link } from "react-router-dom";
import { Tooltip } from "antd";

// import { MenuOutlined } from "@ant-design/icons";
// import HomeIcon from "assets/home-icon.svg";
import VoteIcon from "assets/vote-icon.svg";
import MineIcon from "assets/mine-icon.svg";
import StarIcon from "assets/star-icon.svg";
import MigrateIcon from "assets/migrate-icon.svg";
import { Link } from "react-router-dom";

// import LogoLight from "assets/logo.svg";
import axios from "utils/axios";
import ConnectWallet from "components/ConnectWallet";
import MigrateModal from "components/MigrateModal";
import ICALogo from "assets/tokens/ica.svg";
import "./style.scss";

export default function AppHeader() {
  // const network = useSelector((state) => state.setting.network);

  const [icaBalance, setIcaBalance] = useState("");
  const [migrateModalVisible, setMigrateModalVisible] = useState(false);
  const wallet = useWallet();
  const { account } = wallet;

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
    <div className="container2">
      <header className="app-header">
        <div className="header-left" style={{ display: "none" }}>
          <div className="handle-area">
            <div className="block">
              <Link to="/mine" className="home-icon-link">
                <img className="home-icon icon" src={MineIcon} />
              </Link>
            </div>
            <div className="block">
              <Link to="/star-cluster" className="home-icon-link">
                <img className="home-icon icon" src={StarIcon} />
              </Link>
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
            <div className="block">
              <a
                onClick={() => setMigrateModalVisible(true)}
                className="home-icon-link"
              >
                <img className="home-icon icon" src={MigrateIcon} />
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
      {migrateModalVisible && (
        <MigrateModal
          balance={icaBalance}
          onCancel={() => {
            setMigrateModalVisible(false);
          }}
        />
      )}
    </div>
  );
}

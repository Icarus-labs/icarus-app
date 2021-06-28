import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
import { Switch } from "antd";
import MoonIcon from "assets/moon.svg";

// import { MenuOutlined } from "@ant-design/icons";
// import HomeIcon from "assets/home-icon.svg";
import VoteIcon from "assets/vote-icon.svg";
import MineIcon from "assets/mine-icon.svg";
import StarIcon from "assets/star-icon.svg";
import MigrateIcon from "assets/migrate-icon.svg";
import ProfileIcon from "assets/nav/profile.svg";
import GamefiIcon from "assets/nav/gamefi.svg";
import AnalyticsIcon from "assets/nav/analytics.svg";
import AuditIcon from "assets/nav/audit.svg";
import MigrateIconMobile from "assets/migrate-icon-mobile.svg";
import MigrateIconMobilePurple from "assets/migrate-icon-mobile-purple.svg";
import MediumIcon from "assets/socials/medium.svg";
import TwitterIcon from "assets/socials/twitter.svg";
import InstagramIcon from "assets/socials/instagram.svg";
import DiscordIcon from "assets/socials/discord.svg";
import CmcIcon from "assets/socials/cmc.svg";
import TelegramIcon from "assets/socials/telegram.svg";
import CoingeckoIcon from "assets/socials/coingecko.svg";
import GithubIcon from "assets/socials/github.svg";
import MenuFullIcon from "assets/menu-full.svg";
import MenuPulledIcon from "assets/menu-pulled.svg";
import SettingIcon from "assets/setting-icon.svg";
import { Link } from "react-router-dom";

// import LogoLight from "assets/logo.svg";
import axios from "utils/axios";
import MigrateModal from "components/MigrateModal";
import "./style.scss";

export default function AppSidebar() {
  // const network = useSelector((state) => state.setting.network);
  const dispatch = useDispatch();

  const [icaBalance, setIcaBalance] = useState("");
  const [migrateModalVisible, setMigrateModalVisible] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const wallet = useWallet();
  const theme = useSelector((state) => state.setting.theme);
  const { account } = wallet;

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

  const changeTheme = (param) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: {
        theme: param ? "purple" : "light",
      },
    });
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

  const checkScreen = () => {
    if (window.innerWidth < 992) {
      setMenuOpened(false);
    } else {
      setMenuOpened(true);
    }
  };

  useEffect(() => {
    checkScreen();

    window.onresize = () => {
      checkScreen();
    };
  }, []);

  return (
    <div className={`app-sidebar ${menuOpened ? "" : "closed"}`}>
      <div className="handle-area">
        <img
          src={menuOpened ? MenuFullIcon : MenuPulledIcon}
          className="menu icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        />
        <Link to="/mine" className="nav-link">
          <div className="block">
            <img className="home-icon icon" src={MineIcon} />
          </div>
          <span className="nav-text">MINE</span>
        </Link>
        <Link to="/star-cluster" className="nav-link">
          <div className="block">
            <img className="home-icon icon" src={StarIcon} />
          </div>
          <span className="nav-text">STAR CLUSTER</span>
        </Link>
        <a
          href="https://vote.icarus.finance"
          target="_blank"
          className="nav-link"
        >
          <div className="block">
            <img className="home-icon icon" src={VoteIcon} />
          </div>
          <span className="nav-text">GOV</span>
        </a>
        <a href="#" className="nav-link">
          <div className="block">
            <img className="home-icon icon" src={ProfileIcon} />
          </div>
          <span className="nav-text coming-soon">PROFILE</span>
        </a>
        <a href="#" className="nav-link">
          <div className="block">
            <img className="home-icon icon" src={GamefiIcon} />
          </div>
          <span className="nav-text coming-soon">GAMEFI</span>
        </a>
        <a
          href="https://icarus.finance/analytics"
          target="_blank"
          className="nav-link"
        >
          <div className="block">
            <img className="home-icon icon" src={AnalyticsIcon} />
          </div>
          <span className="nav-text">ANALYTICS</span>
        </a>
        <a
          href="https://solidity.finance/audits/Icarus"
          target="_blank"
          className="nav-link"
        >
          <div className="block">
            <img className="home-icon icon" src={AuditIcon} />
          </div>
          <span className="nav-text">AUDIT</span>
        </a>
        <a onClick={() => setMigrateModalVisible(true)} className="nav-link">
          <div className="block focus">
            <img
              className={`home-icon icon ${!menuOpened ? "mobile-shake" : ""} `}
              src={
                menuOpened
                  ? MigrateIcon
                  : theme === "purple"
                  ? MigrateIconMobilePurple
                  : MigrateIconMobile
              }
            />
          </div>
          <span className="nav-text">MIGRATE</span>
        </a>
      </div>
      <div className="bottom-area">
        <div className="">
          <img
            className="setting-icon icon"
            src={SettingIcon}
            onClick={() => setMenuOpened((prev) => !prev)}
          />
        </div>
        <div className="block handle-block theme-switch">
          <img
            className="moon-icon icon"
            src={MoonIcon}
            onClick={() => changeTheme(theme !== "purple")}
          />
          <Switch
            className="option-switch"
            checked={theme === "purple"}
            size="small"
            onChange={changeTheme}
          />
        </div>
        <div className="socials">
          <div className="social-row">
            <a target="_blank" href="https://icarus-finance.medium.com">
              <img src={MediumIcon} className="social-icon" />
            </a>
            <a target="_blank" href="https://twitter.com/zetta_icarus">
              <img src={TwitterIcon} className="social-icon" />
            </a>
            <a target="_blank" href="https://www.instagram.com/zetta_icarus/">
              <img src={InstagramIcon} className="social-icon" />
            </a>
            <a target="_blank" href="https://github.com/Icarus-labs">
              <img src={GithubIcon} className="social-icon" />
            </a>
          </div>
          <div className="social-row">
            <a target="_blank" href="https://discord.gg/FW5QtuzPdS">
              <img src={DiscordIcon} className="social-icon" />
            </a>
            <a
              target="_blank"
              href="https://coinmarketcap.com/currencies/icarus-finance"
            >
              <img src={CmcIcon} className="social-icon" />
            </a>
            <a target="_blank" href="https://t.me/icarus_finance">
              <img src={TelegramIcon} className="social-icon" />
            </a>
            <a
              target="_blank"
              href="https://www.coingecko.com/en/coins/icarus-finance"
            >
              <img src={CoingeckoIcon} className="social-icon" />
            </a>
          </div>
        </div>
      </div>
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

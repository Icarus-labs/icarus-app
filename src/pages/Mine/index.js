import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWallet } from "use-wallet";
import { Row, Col, Button, Tooltip, Switch } from "antd";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import BannerImg from "assets/banners/video-contest.png";
import { useLocation } from "react-router-dom";
import BuyIcaIcon from "assets/buy-ica.svg";
import BuyZbtcIcon from "assets/buy-zbtc.svg";
import BuyZethIcon from "assets/buy-zeth.svg";
import ICALogo from "assets/tokens/ica.svg";
// import MoonIcon from "assets/moon.svg";
import ModeIcon from "assets/mode.svg";
import StarClusterImg from "assets/star-cluster-2.png";
import axios from "utils/axios";
import MineDetail from "../MineDetail";
import { toThousands } from "utils/Tools";

import "./style.scss";

export default function Mine() {
  const dispatch = useDispatch();
  const location = useLocation();
  const wallet = useWallet();

  const [poolList, setPoolList] = useState([]);
  const [totalTvl, setTotalTvl] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [starTotalMined, setStarTotalMined] = useState(0);
  const [starTotalStaked, setStarTotalStaked] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [zethPrice, setZethPrice] = useState(0);
  const [zbtcPrice, setZbtcPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [icaPrice, setIcaPrice] = useState(0);
  const [icaMarketCap, setIcaMarketCap] = useState(0);
  const [icaTotalMinted, setIcaTotalMinted] = useState(0);
  const [icaTotalBurned, setIcaTotalBurned] = useState(0);
  const [showActive, setShowActive] = useState(true);
  const [showDeposited, setShowDeposited] = useState(false);
  const [thirdPrices, setThirdPrice] = useState({});
  const mode = useSelector((state) => state.setting.mode);
  // const theme = useSelector((state) => state.setting.theme);

  // const [currentTab, setCurrentTab] = useState("zeth");
  const [loadingPools, setLoadingPools] = useState(false);

  // todo, add cancel when change tab
  const getPools = async () => {
    const zethResult = await axios.get(`/zeth/pools/available`);
    const zbtcResult = await axios.get(`/zbtc/pools/available`);
    // setPoolList(result.data.data);
    //todo, need to wait pool list finish
    await getPoolInfo(zethResult.data.data, "zeth");
    await getPoolInfo(zbtcResult.data.data, "zbtc");
    setLoadingPools(false);
  };

  const getPoolInfo = async (list, currentTab) => {
    if (!currentTab) {
      return;
    }
    if (!list || list.length === 0) {
      return false;
    }

    let totalTvlRaw = 0;

    for (let i = 0; i < list.length; i++) {
      const poolInfo = await axios.get(`/${currentTab}/pools/info`, {
        params: {
          pool: list[i].address,
        },
      });
      if (!poolInfo || !poolInfo.data.data) {
        continue;
      }
      if (
        list[i].address === "0x00A089b819856E81f1dd88BB79759CD8a85a6C4e" ||
        list[i].address === "0x07b40e5dc40f21b3E1Ba47845845E83dF5665DbF" ||
        list[i].address === "0x4E38E87bcAF375ccAF38CBa49d2b45DE58319f38" ||
        list[i].address === "0x5F8F5b526Ae06680547ffA91c76f7209639f779B" ||
        list[i].address === "0x105bde807777B695830d4e9D80ba65c308CEBd11" ||
        list[i].address === "0xe7bE10DDCDFb3301d94d95991A214e58b71924C5" ||
        list[i].address === "0x574B029F3159a1EF732f25d5f3b7C51Fad3bcfFE" ||
        list[i].address === "0x2dd1d9a0C8fDC66328eaBf27e166d281b3a5E670" ||
        list[i].address === "0xfB3Bf392552973B5Db8CEAaf9AB896a32F5c4e4A" ||
        list[i].address === "0xdd9937F73115AD155dF124eF0F64DA65Cf8Cc3d4" ||
        list[i].address === "0xA2B04f1409F741E59A175Eee43E998d3bFf36C6A" ||
        list[i].address === "0x568E19cD1d0fA3C6b06A9850287829B94449B28D"
        // list[i].address === "0xbcBDeCCd5cbD126E62A874e04178AccbcB7eE2A1"
      ) {
        list[i].inactive = true;
      }
      list[i].apy = poolInfo.data.data.apy;
      list[i].income_apy = poolInfo.data.data.income_apy;
      list[i].reward_apy = poolInfo.data.data.reward_apy;
      list[i].tvl = poolInfo.data.data.tvl;
      list[i].currentTab = currentTab;

      totalTvlRaw += Number(list[i].tvl);
    }
    setTotalTvl((prev) => prev + totalTvlRaw);
    setPoolList((prev) => prev.concat(list));

    // }
  };

  // const changeTheme = (param) => {
  //   dispatch({
  //     type: "SWITCH_THEME",
  //     payload: {
  //       theme: param ? "purple" : "light",
  //     },
  //   });
  // };

  const starBoostChange = (target, apr) => {
    setPoolList((prev) => {
      prev.forEach((poolItem) => {
        if (poolItem.address === target) {
          poolItem.boostAPR = apr;
        }
      });
      return [...prev];
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

  const getTokenPrice = async () => {
    axios
      .get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: "ethereum,bitcoin,pancakeswap-token,xditto,wbnb,dogecoin",
          vs_currencies: "usd",
        },
      })
      .then((res) => {
        if (res.data.ethereum) {
          setEthPrice(res.data.ethereum.usd);
        }
        if (res.data.bitcoin) {
          setBtcPrice(res.data.bitcoin.usd);
        }

        if (res.data) {
          setThirdPrice((prev) => ({
            ...prev,
            DOGE: res.data.dogecoin.usd,
            xDitto: res.data.xditto.usd,
            WBNB: res.data.wbnb.usd,
            CAKE: res.data["pancakeswap-token"].usd,
          }));
        }
      });

    axios.get("/ica/price").then((res) => {
      if (res.data.data) {
        setIcaPrice(Number(res.data.data.amount_pretty));
        setThirdPrice((prev) => ({
          ...prev,
          ICA: Number(res.data.data.amount_pretty),
        }));
      }
    });

    axios.get("/zeth/price").then((res) => {
      if (res.data.data) {
        setZethPrice(Number(res.data.data.price_pretty));
      }
    });

    axios.get("/zbtc/price").then((res) => {
      if (res.data.data) {
        setZbtcPrice(Number(res.data.data.price_pretty));
        setThirdPrice((prev) => ({
          ...prev,
          ZBTC: Number(res.data.data.price_pretty),
        }));
      }
    });
  };

  const getGeneralInfo = async () => {
    axios.get("/ica/supply_value").then((res) => {
      if (res.data.data) {
        setIcaMarketCap(res.data.data.amount_pretty);
      }
    });
    axios.get("/ica/supply").then((res) => {
      if (res.data.data) {
        setIcaTotalMinted(res.data.data.amount_pretty);
      }
    });
    axios.get("/ica/burnt").then((res) => {
      if (res.data.data) {
        setIcaTotalBurned(res.data.data.amount_pretty);
      }
    });
  };

  const userHasStaked = (index) => {
    setPoolList((prev) => {
      prev[index].hasStaked = true;
      return [...prev];
    });
  };

  useEffect(() => {
    if (!wallet.account) {
      return;
    }
    setTotalMined(0);
    setTotalStaked(0);
    setStarTotalMined(0);
    setStarTotalStaked(0);
    setPoolList([]);
    setLoadingPools(true);
    getPools();
    getTokenPrice();
    getGeneralInfo();
  }, [wallet.account]);

  useEffect(() => {
    const interval = setInterval(() => {
      getTokenPrice();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`page-mine ${
        location.pathname === "/star-cluster" ? "star-cluster" : ""
      }`}
    >
      <Row gutter={{ lg: 44 }} className="top-infos">
        <Col xs={24} lg={12}>
          <div className="tvl block">
            <img src={ICALogo} className="logo-img" />
            <a href="https://icarus.finance" target="_blank" className="logo">
              icarus.finance
            </a>
            <div className="num">
              <div className="title">TVL</div>${toThousands(totalTvl)}
            </div>
            <div className="prices">
              {/* <div>ETH: ${ethPrice}</div>
                <div>BTC: ${btcPrice}</div> */}
              <div>ICA: ${icaPrice.toFixed(3)}</div>
              <div>ZETH: ${zethPrice.toFixed(3)}</div>
              <div>ZBTC: ${zbtcPrice.toFixed(3)}</div>
            </div>
          </div>

          <Row gutter={44}>
            <Col xs={12} lg={12}>
              <div className="block second-line">
                <div className="title">
                  DEPOSITED{" "}
                  <Tooltip title="Total deposited amount across all pools in USD.">
                    <QuestionCircleOutlined className="title-icon" />
                  </Tooltip>
                </div>
                <div className="num">
                  ${toThousands(totalStaked.toFixed(2))}
                </div>
              </div>
            </Col>
            <Col xs={12} lg={12}>
              <div className="block second-line">
                <div className="title">
                  MINED{" "}
                  <Tooltip title="Total amount mined across all pools in USD.">
                    <QuestionCircleOutlined className="title-icon" />
                  </Tooltip>
                </div>
                <div className="num">${toThousands(totalMined.toFixed(2))}</div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={12}>
          <a
            href="https://icarus-finance.medium.com/video-contest-9a7d91bb0bf0"
            target="_blank"
            className="coingecko"
          >
            <img src={BannerImg} />
          </a>

          <div className="block second-line">
            <Row>
              <Col xs={8}>
                <img src={BuyIcaIcon} className="buy-icon" />
                <a
                  target="_blank"
                  href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x0ca2f09eca544b61b91d149dea2580c455c564b2"
                >
                  <Button className="btn">BUY ICA</Button>
                </a>
              </Col>
              <Col xs={8}>
                <img src={BuyZbtcIcon} className="buy-icon" />
                <a
                  target="_blank"
                  href="https://app.dodoex.io/exchange/BUSD-0xd0dff49de3e314fdfd3f93c5eeee7d5d2f5515cd?network=bsc-mainnet"
                >
                  <Button className="btn">BUY ZBTC</Button>
                </a>
              </Col>
              <Col xs={8}>
                <img src={BuyZethIcon} className="buy-icon" />
                <a
                  href="https://app.dodoex.io/exchange/BUSD-0xdbeb98858f5d4dca13ea0272b2b786e9415d3992"
                  target="_blank"
                >
                  <Button className="btn">BUY ZETH</Button>
                </a>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <div className="bar">
        <div>
          <span className="highlight">ICA</span> Market Cap: $
          {Number(icaMarketCap).toFixed(2)}
        </div>
        <div>Total Minted: {Number(icaTotalMinted).toFixed(2)}</div>
        <div>Total Burned: {Number(icaTotalBurned).toFixed(2)}</div>
      </div>

      <div className="star-cluster-dashboard">
        <div className="block">
          <div className="title">
            DEPOSITED{" "}
            <Tooltip title="Total deposited amount across all pools in USD.">
              <QuestionCircleOutlined className="title-icon" />
            </Tooltip>
          </div>
          <div className="num">${toThousands(starTotalStaked.toFixed(2))}</div>
        </div>

        <img src={StarClusterImg} className="star-cluster-img" />

        <div className="block">
          <div className="title">
            MINED{" "}
            <Tooltip title="Total amount mined across all pools in USD.">
              <QuestionCircleOutlined className="title-icon" />
            </Tooltip>
          </div>
          <div className="num">${toThousands(starTotalMined.toFixed(2))}</div>
        </div>
      </div>

      <div className="bar">
        <div className="block-switch">
          <div
            onClick={() => setShowActive(true)}
            className={`${showActive ? "active" : ""}`}
          >
            Active
          </div>
          <div
            onClick={() => setShowActive(false)}
            className={`${!showActive ? "active" : ""}`}
          >
            Inactive
          </div>
        </div>
        <div className="block handle-block">
          <span style={{ marginRight: "6px" }}>ONLY DEPOSITED</span>
          <Switch
            className="option-switch"
            checked={showDeposited === true}
            onChange={(checked) => setShowDeposited(checked)}
          />
        </div>
        {/* <div className="block handle-block theme-switch">
            <img className="moon-icon icon" src={MoonIcon} />
            <Switch
              className="option-switch"
              checked={theme === "purple"}
              onChange={changeTheme}
            />
          </div> */}
        <div className="block handle-block">
          <img className="mode-icon icon" src={ModeIcon} />
          <Switch
            className="option-switch"
            checked={mode === "card"}
            onChange={changeMode}
          />
        </div>
      </div>

      {!wallet.account && (
        <span className="connect-hint">
          Please connect your wallet to see the pools.
        </span>
      )}

      {loadingPools && <LoadingOutlined className="loading-icon" />}
      {!loadingPools && (
        <div className={mode === "line" ? "block line-wrapper" : ""}>
          <Row className="pool-list" gutter={44}>
            {poolList &&
              poolList.map((item, index) => (
                <Col
                  xs={24}
                  lg={mode === "line" ? 24 : 12}
                  xl={mode === "line" ? 24 : 6}
                  className={`${
                    (showDeposited && !item.hasStaked) ||
                    (showActive && item.inactive) ||
                    (!showActive && !item.inactive)
                      ? "hidden"
                      : ""
                  } pool-type-${item.type}`}
                  key={item.address}
                >
                  <MineDetail
                    item={item}
                    address={item.address}
                    currentToken={item.currentTab}
                    earnedChange={(value) =>
                      setTotalMined((prev) => prev + Number(value))
                    }
                    stakedChange={(value) =>
                      setTotalStaked((prev) => prev + Number(value))
                    }
                    starEarnedChange={(value) =>
                      setStarTotalMined((prev) => prev + Number(value))
                    }
                    starStakedChange={(value) =>
                      setStarTotalStaked((prev) => prev + Number(value))
                    }
                    starBoostChange={starBoostChange}
                    hasStaked={() => userHasStaked(index)}
                    thirdPrices={thirdPrices}
                    prices={{
                      ica: icaPrice,
                      btc: btcPrice,
                      eth: ethPrice,
                      zeth: zethPrice,
                      zbtc: zbtcPrice,
                    }}
                  />
                </Col>
              ))}
          </Row>
        </div>
      )}
    </div>
  );
}

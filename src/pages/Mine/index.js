import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Row, Col, Button, Tooltip, Switch } from "antd";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import BannerImg from "assets/banners/beefy.png";

import BuyIcaIcon from "assets/buy-ica.svg";
import BuyZbtcIcon from "assets/buy-zbtc.svg";
import BuyZethIcon from "assets/buy-zeth.svg";
import ICALogo from "assets/tokens/ica.svg";
import MoonIcon from "assets/moon.svg";
import ModeIcon from "assets/mode.svg";
// import { Link } from "react-router-dom";
import axios from "utils/axios";
import MineDetail from "../MineDetail";
import { toThousands } from "utils/Tools";

import "./style.scss";

export default function Mine() {
  const dispatch = useDispatch();

  const [poolList, setPoolList] = useState([]);
  const [totalTvl, setTotalTvl] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [zethPrice, setZethPrice] = useState(0);
  const [zbtcPrice, setZbtcPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [icaPrice, setIcaPrice] = useState(0);
  const [icaMarketCap, setIcaMarketCap] = useState(0);
  const [icaTotalMinted, setIcaTotalMinted] = useState(0);
  const [icaTotalBurned, setIcaTotalBurned] = useState(0);
  const mode = useSelector((state) => state.setting.mode);
  const theme = useSelector((state) => state.setting.theme);

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
      list[i].apy = poolInfo.data.data.apy;
      list[i].income_apy = poolInfo.data.data.income_apy;
      list[i].reward_apy = poolInfo.data.data.reward_apy;
      list[i].tvl = poolInfo.data.data.tvl;
      list[i].currentTab = currentTab;

      totalTvlRaw += Number(list[i].tvl);
    }
    setTotalTvl((prev) => prev + totalTvlRaw);
    setPoolList((prev) => prev.concat(list));
  };

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

  const getTokenPrice = async () => {
    axios
      .get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: "ethereum,bitcoin",
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
      });

    axios.get("/ica/price").then((res) => {
      if (res.data.data) {
        setIcaPrice(Number(res.data.data.amount_pretty));
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
      }
    });
  };

  const getGeneralInfo = async () => {
    axios.get("/ica/supply_value").then((res) => {
      if (res.data.data) {
        console.log(res.data.data, "nnnnnn");
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

  useEffect(() => {
    setPoolList([]);
    setLoadingPools(true);
    getPools();
    getTokenPrice();
    getGeneralInfo();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getTokenPrice();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-mine">
      <div className="container">
        <Row gutter={{ lg: 44 }}>
          <Col xs={24} lg={12}>
            <div className="tvl block">
              <img src={ICALogo} className="logo-img" />
              <div className="logo">icarus.finance</div>
              <div className="num">
                <div className="title">TVL</div>${toThousands(totalTvl)}
              </div>
              <div className="prices">
                <div>ETH: ${ethPrice}</div>
                <div>BTC: ${btcPrice}</div>
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
                  <div className="num">
                    ${toThousands(totalMined.toFixed(2))}
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={12}>
            <a
              href="https://app.beefy.finance"
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
                    href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x95111f630ac215eb74599ed42c67e2c2790d69e2"
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
            <span className="highlight">ICA</span> Market Cap: ${Number(icaMarketCap).toFixed(2)}
          </div>
          <div>Total Minted: {Number(icaTotalMinted).toFixed(2)}</div>
          <div>Total Burned: {Number(icaTotalBurned).toFixed(2)}</div>
        </div>

        <div className="bar">
          {/* <div className="block-switch">
            <div className="active">Active</div>
            <div>Inactive</div>
          </div> */}
          <div className="block handle-block">
            <img className="moon-icon icon" src={MoonIcon} />
            <Switch
              className="option-switch"
              checked={theme === "purple"}
              onChange={changeTheme}
            />
          </div>
          <div className="block handle-block">
            <img className="mode-icon icon" src={ModeIcon} />
            <Switch
              className="option-switch"
              checked={mode === "card"}
              onChange={changeMode}
            />
          </div>
        </div>

        {loadingPools && <LoadingOutlined className="loading-icon" />}
        {!loadingPools && (
          <div className={mode === "line" ? "block line-wrapper" : ""}>
            <Row className="pool-list" gutter={44}>
              {poolList &&
                poolList.map((item) => (
                  <Col
                    xs={24}
                    lg={mode === "line" ? 24 : 12}
                    xl={mode === "line" ? 24 : 6}
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
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Row, Col, Button, Tooltip, Switch } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import HomeIcon from "assets/home-icon.svg";
import MoonIcon from "assets/moon.svg";
import ModeIcon from "assets/mode.svg";

import BuyIcaIcon from "assets/buy-ica.svg";
import BuyZbtcIcon from "assets/buy-zbtc.svg";
import BuyZethIcon from "assets/buy-zeth.svg";

import tokenImg from "config/tokenImg";
import { Link } from "react-router-dom";
import config from "config";
import { useSelector, useDispatch } from "react-redux";
import axios from "utils/axios";
import MineDetail from "../MineDetail";

import "./style.scss";

export default function Mine() {
  const network = useSelector((state) => state.setting.network);
  const theme = useSelector((state) => state.setting.theme);
  const mode = useSelector((state) => state.setting.mode);

  const dispatch = useDispatch();

  const [poolList, setPoolList] = useState([]);
  const [totalTvl, setTotalTvl] = useState(0)
  // const [currentTab, setCurrentTab] = useState("zeth");
  const [loadingPools, setLoadingPools] = useState(false);

  const buyContractAddress = config[network].buyContractAddress;
  const scanUrl = config[network].scanUrl;

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
    let totalTvlRaw = 0
    for (let i = 0; i < list.length; i++) {
      const poolInfo = await axios.get(`/${currentTab}/pools/info`, {
        params: {
          pool: list[i].address,
        },
      });
      list[i].apy = poolInfo.data.data.apy;
      list[i].income_apy = poolInfo.data.data.income_apy;
      list[i].reward_apy = poolInfo.data.data.reward_apy;
      list[i].tvl = poolInfo.data.data.tvl;
      list[i].currentTab = currentTab;

      totalTvlRaw += Number(list[i].tvl)
    }
    setTotalTvl(prev => prev + totalTvlRaw)
    setPoolList((prev) => prev.concat(list));
  };

  useEffect(() => {
    setPoolList([]);
    setLoadingPools(true);
    getPools();
  }, []);

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
        mode: param ? "line" : "card",
      },
    });
  };

  return (
    <div className="page-mine">
      <div className="container">
        {/* <Row className="pool-tab">
          <Col xs={24} lg={12}>
            <div
              onClick={() => setCurrentTab("zeth")}
              className={`tab block ${currentTab !== "zeth" ? "inactive" : ""}`}
            >
              <img src={tokenImg["ZETH"]} className="token-item" /> ZETH POOL
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div
              onClick={() => setCurrentTab("zbtc")}
              className={`tab block ${currentTab !== "zbtc" ? "inactive" : ""}`}
            >
              <img src={tokenImg["ZBTC"]} className="token-item" /> ZBTC POOL
            </div>
          </Col>
        </Row> */}
        <Row gutter={44}>
          <Col xs={24} lg={12}>
            <div className="tvl block">
              <div className="title">TVL</div>
              <div className="num">${totalTvl}</div>
            </div>
            <Row gutter={44}>
              <Col xs={12} lg={12}>
                <div className="block second-line">
                  <div className="title">TOTAL</div>
                  <div className="num">$22720</div>
                </div>
              </Col>
              <Col xs={12} lg={12}>
                <div className="block second-line">
                  <div className="title">MINED</div>
                  <div className="num">$22720</div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={12}>
            <div className="handle-area">
              <div className="block">
                <a href="https://icarus.finance" target="_blank" className="home-icon-link">
                  <img className="home-icon icon" src={HomeIcon} />
                </a>
              </div>
              <div className="block">
                <img className="moon-icon icon" src={MoonIcon} />
                <Switch className="option-switch" checked={theme === "purple"} onChange={changeTheme} />
              </div>
              <div className="block">
                <img className="mode-icon icon" src={ModeIcon} />
                <Switch className="option-switch" checked={mode === "line"} onChange={changeMode} />
              </div>
            </div>
            <div className="block second-line">
              <Row>
                <Col xs={24} md={8}>
                  <img src={BuyIcaIcon} className="buy-icon" />
                  <Link to="/">
                    <Button className="btn">BUY ICA</Button>
                  </Link>
                </Col>
                <Col xs={24} md={8}>
                  <img src={BuyZbtcIcon} className="buy-icon" />
                  <Link to="/buy">
                    <Button className="btn">BUY ZBTC</Button>
                  </Link>
                </Col>
                <Col xs={24} md={8}>
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

        {loadingPools && <LoadingOutlined className="loading-icon" />}
        <Row className="pool-list">
          {poolList &&
            poolList.map((item) => (
              <Row key={item.address} type="flex" justify="center" gutter={44}>
                <Col xs={24} lg={6}>
                  <div className="pool-item block">
                    <div className="info-line top-line">
                      <span className="tokens">
                        {item.stake_token.split("-").map((token) => (
                          <a
                            target="_blank"
                            className="token-item-link"
                            href={
                              item.stake_token === "ZETH"
                                ? `${scanUrl}/${buyContractAddress}`
                                : ""
                            }
                          >
                            <img src={tokenImg[token]} className="token-item" />
                          </a>
                        ))}
                      </span>
                      <span className="deposit-by">
                        <a
                          target="_blank"
                          href={
                            item.stake_token === "ZETH"
                              ? `${scanUrl}/${buyContractAddress}`
                              : ""
                          }
                        >
                          {item.stake_token}
                        </a>
                      </span>
                    </div>
                    <div className="info-line">
                      <span>EARN:</span>
                      <span>
                        {item.reward_tokens.map((token, index) => (
                          <>
                            <span className={token === "ICA" ? "grey" : ""}>
                              {token}
                            </span>{" "}
                            {index !== item.reward_tokens.length - 1 ? "+" : ""}
                          </>
                        ))}
                      </span>
                    </div>
                    <div className="info-line">
                      <span>APR:</span>
                      {/* <span>45.72%</span> */}
                      <Tooltip
                        title={`${
                          item.income_apy
                            ? "ETH APR: " + item.income_apy + "%"
                            : ""
                        } | ${
                          item.reward_apy
                            ? "ICA APR: " + item.reward_apy + "%"
                            : ""
                        }`}
                      >
                        <span>{item.apy || 0}%</span>
                      </Tooltip>
                    </div>
                    <div className="info-line">
                      <span>TVL:</span>
                      <span>${item.tvl || 0}</span>
                    </div>

                    {/* <Link to={`/mine/${item.address}`}>
                      <Button className="btn">SELECT</Button>
                    </Link> */}
                  </div>
                </Col>

                <MineDetail
                  address={item.address}
                  currentToken={item.currentTab}
                />
              </Row>
            ))}
        </Row>
      </div>
    </div>
  );
}

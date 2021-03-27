import React, { useState, useEffect } from "react";
import { Row, Col, Button, Tooltip } from "antd";
import { LoadingOutlined } from '@ant-design/icons'
import tokenImg from "config/tokenImg";
import { Link } from "react-router-dom";
import config from "config";
import { useSelector } from "react-redux";
import axios from "utils/axios";

import "./style.scss";

export default function Mine() {
  const network = useSelector((state) => state.setting.network);

  const [poolList, setPoolList] = useState([]);
  // const [currentTab, setCurrentTab] = useState("zeth");
  const [loadingPools, setLoadingPools] = useState(false)

  const buyContractAddress = config[network].buyContractAddress;
  const scanUrl = config[network].scanUrl;

  // todo, add cancel when change tab
  const getPools = async () => {
    const zethResult = await axios.get(`/zeth/pools/available`);
    const zbtcResult = await axios.get(`/zbtc/pools/available`);
    // setPoolList(result.data.data);
    //todo, need to wait pool list finish
    await getPoolInfo(zethResult.data.data, 'zeth');
    await getPoolInfo(zbtcResult.data.data, 'zbtc');
    setLoadingPools(false)
  };

  const getPoolInfo = async (list, currentTab) => {
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
      list[i].currentTab = currentTab
    }
    setPoolList(prev => prev.concat(list));
  };

  useEffect(() => {
    console.log('YOOOOOOOOOOOOOO')
    setPoolList([])
    setLoadingPools(true)
    getPools();
  }, []);

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

        {loadingPools && <LoadingOutlined className="loading-icon" />}
        <Row className="pool-list">
          {poolList && poolList.map((item) => (
            <Col key={item.address} xs={24} lg={12}>
              <div className="pool-item block">
                <div className="info-line top-line">
                  <span className="tokens">
                    {item.stake_token.split("-").map((token) => (
                      <a
                        target="_blank"
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
                      item.income_apy ? "ETH APR: " + item.income_apy + "%" : ""
                    } | ${
                      item.reward_apy ? "ICA APR: " + item.reward_apy + "%" : ""
                    }`}
                  >
                    <span>{item.apy || 0}%</span>
                  </Tooltip>
                </div>
                <div className="info-line">
                  <span>TVL:</span>
                  <span>${item.tvl || 0}</span>
                </div>

                <Link to={`/mine/${item.address}?token=${item.currentTab}`}>
                  <Button className="btn">SELECT</Button>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

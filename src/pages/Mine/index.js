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
  const [currentTab, setCurrentTab] = useState("zeth");
  const [loadingPools, setLoadingPools] = useState(false)

  const buyContractAddress = config[network].buyContractAddress;
  const scanUrl = config[network].scanUrl;

  // todo, add cancel when change tab
  const getPools = async () => {
    const result = await axios.get(`/${currentTab}/pools/available`);
    // setPoolList(result.data.data);
    //todo, need to wait pool list finish
    getPoolInfo(result.data.data);
  };

  const getPoolInfo = async (list) => {
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
    }
    setPoolList(list);
    setLoadingPools(false)
    // list.forEach(async (pool, index) => {
    //   const poolInfo = await axios.get(`/${currentTab}/pools/info`, {
    //     params: {
    //       pool: pool.address,
    //     },
    //   });
    //   if (poolInfo.data.data) {
    //     console.log('ITIS', poolInfo.data.data, index)
    //     setPoolList((prev) => {
    //       prev[index].apy = poolInfo.data.data.apy;
    //       prev[index].income_apy = poolInfo.data.data.income_apy;
    //       prev[index].reward_apy = poolInfo.data.data.reward_apy;
    //       prev[index].tvl = poolInfo.data.data.tvl;

    //       return [...prev];
    //     });
    //   }
    // });
  };

  useEffect(() => {
    setPoolList([])
    setLoadingPools(true)
    getPools();
  }, [currentTab]);

  return (
    <div className="page-mine">
      <div className="container">
        <Row className="pool-tab">
          <Col xs={24} lg={12}>
            <div
              onClick={() => setCurrentTab("zeth")}
              className={`tab ${currentTab !== "zeth" ? "inactive" : ""}`}
            >
              <img src={tokenImg["ZETH"]} className="token-item" /> ZETH POOL
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div
              onClick={() => setCurrentTab("zbtc")}
              className={`tab ${currentTab !== "zbtc" ? "inactive" : ""}`}
            >
              <img src={tokenImg["ZBTC"]} className="token-item" /> ZBTC POOL
            </div>
          </Col>
        </Row>

        {loadingPools && <LoadingOutlined className="loading-icon" />}
        
        <Row className="pool-list">
          {poolList.map((item) => (
            <Col key={item.address} xs={24} lg={12}>
              <div className="pool-item">
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

                <Link to={`/mine/${item.address}?token=${currentTab}`}>
                  <Button className="btn-yellow">SELECT</Button>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

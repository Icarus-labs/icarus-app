import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Tooltip } from "antd";
// import { Link, useLocation } from "react-router-dom";
import tokenImg from "config/tokenImg";
import config from "config";
import axios from "utils/axios";
import { useWallet } from "use-wallet";
import mm from "components/mm";
import { useSelector } from "react-redux";
import DepositModal from "components/DepositModal";
// import BackButton from "assets/back.svg";

import "./style.scss";

export default function MineDetail(props) {
  const { address, currentToken, item, earnedChanged } = props;
  const [poolInfo, setPoolInfo] = useState({});
  const network = useSelector((state) => state.setting.network);
  const mode = useSelector((state) => state.setting.mode);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const wallet = useWallet();
  const { account } = wallet;
  const buyContractAddress = config[network].buyContractAddress;
  const scanUrl = config[network].scanUrl;
  // const location = useLocation()

  // const currentToken = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    getPool();
  }, []);

  useEffect(() => {
    if (!account) {
      return;
    }
    getOtherInfo(true);
    const interval = setInterval(() => {
      getOtherInfo();
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, [account]);

  const getOtherInfo = async (isFirst) => {
    const userStats = await axios.get(`/${currentToken}/pools/userstats`, {
      params: {
        account: account,
        pool: address,
      },
    });
    // trigger

    if (isFirst) {
      earnedChanged(userStats.data.data.income_amount_pretty);
    }

    setPoolInfo((prev) => {
      return {
        ...prev,
        staked: userStats.data.data.staked_amount_pretty,
        earnedBETH: userStats.data.data.income_amount_pretty,
        earnedICA: userStats.data.data.reward_amount_pretty,
        lpAmount: userStats.data.data.lp_amount_pretty,
      };
    });
  };

  const getPool = async () => {
    const result = await axios.get(`/${currentToken}/pools/info`, {
      params: {
        pool: address,
      },
    });
    setPoolInfo(result.data.data);
  };

  const doClaim = async () => {
    const result = await axios.post(`/${currentToken}/pools/claim`, {
      account: account,
      pool: address,
    });

    let txnParams = result.data.data.txs.map((item) => {
      return {
        from: account,
        to: item.contract,
        data: item.calldata,
      };
    });
    const status = await mm.sendTransaction(txnParams, "Claim Reward");

    if (status) {
      message.success("Success");
    }
  };

  const doExit = async () => {
    const result = await axios.post(`/${currentToken}/pools/exit`, {
      account: account,
      pool: address,
    });

    let txnParams = result.data.data.txs.map((item) => {
      return {
        from: account,
        to: item.contract,
        data: item.calldata,
      };
    });

    const status = await mm.sendTransaction(txnParams, "Claim Reward");

    if (status) {
      message.success("Success");
    }
  };

  // const LockedButton = () => {
  //   return <Button className="btn-yellow">LOCKED</Button>;
  // };

  return (
    <>
      {mode === "card" ? (
        <Row type="flex" justify="center" gutter={44}>
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
            </div>
          </Col>
          <Col xs={24} lg={6}>
            <div className="pool-item block">
              <div className="info-line top-line">
                <span className="tokens">
                  {poolInfo.stake_token &&
                    poolInfo.stake_token
                      .split("-")
                      .map((token) => (
                        <img
                          key={token}
                          src={tokenImg[token]}
                          className="token-item"
                        />
                      ))}
                </span>
                <span className="deposit-by">{poolInfo.stake_token}</span>
              </div>

              <div className="info-line">
                <span>STAKED:</span>
                <span>{poolInfo.staked ? Number(poolInfo.staked) : 0}</span>
              </div>
              <div className="info-line">
                <span>APR</span>
                {/* <span>45.72%</span> */}
                <Tooltip
                  title={`${
                    poolInfo.income_apy
                      ? "ETH APR: " + poolInfo.income_apy + "%"
                      : ""
                  }   ${
                    poolInfo.reward_apy
                      ? "ICA APR: " + poolInfo.reward_apy + "%"
                      : ""
                  }`}
                >
                  <span>{poolInfo.apy}%</span>
                </Tooltip>
              </div>
              <div className="info-line">
                <span>TVL:</span>
                <span>${poolInfo.tvl}</span>
              </div>
              <Button
                className="btn"
                onClick={() => {
                  setDepositModalVisible(true);
                }}
              >
                STAKE
              </Button>
            </div>
          </Col>
          <Col xs={24} lg={6}>
            <div className="pool-item block">
              <div className="info-line top-line">
                <span className="tokens">
                  {poolInfo &&
                    poolInfo.reward_tokens &&
                    poolInfo.reward_tokens.map((token) => (
                      <img
                        key={token}
                        src={tokenImg[token]}
                        className="token-item"
                      />
                    ))}
                </span>
                <span className="deposit-by">EARNED</span>
              </div>
              <div className="info-line">
                <span>{currentToken === "zeth" ? "ETH" : "BTC"}:</span>
                <span>{poolInfo.earnedBETH || 0}</span>
              </div>
              <div className="info-line">
                <Button
                  onClick={() => {
                    doClaim();
                  }}
                  className="btn"
                >
                  CLAIM
                </Button>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={6}>
            <div className="pool-item block">
              <div className="info-line top-line single">
                <span className="deposit-by">Withdraw</span>
              </div>
              <div className="info-line hint">
                As you unstake tokens from the pool, the smart contract will
                automatically harvest the ETH and ICA.
              </div>
              <div className="info-line">
                <Button
                  onClick={() => {
                    doExit();
                  }}
                  className="btn"
                >
                  Settle &amp; Withdraw
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="pool-item line-block block">
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
                  <span className={token === "ICA" ? "grey" : ""}>{token}</span>{" "}
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
          <div className="info-line">
            <span>STAKED:</span>
            <span>
              {poolInfo.staked ? Number(poolInfo.staked) : 0} {item.stake_token}
            </span>
          </div>

          <div className="info-line">
            <span>EARNED:</span>
            <span>
              {poolInfo.earnedBETH || 0}{" "}
              {currentToken === "zeth" ? "ETH" : "BTC"}
            </span>
          </div>

          <div className="btns">
            <Button
              className="btn"
              onClick={() => {
                setDepositModalVisible(true);
              }}
            >
              STAKE
            </Button>
            <Button
              onClick={() => {
                doClaim();
              }}
              className="btn"
            >
              CLAIM
            </Button>
            <Button
              onClick={() => {
                doExit();
              }}
              className="btn"
            >
              Settle &amp; Withdraw
            </Button>
          </div>
        </div>
      )}

      {depositModalVisible && (
        <DepositModal
          poolAddress={address}
          balance={poolInfo.lpAmount}
          stakeToken={poolInfo.stake_token}
          onCancel={() => {
            setDepositModalVisible(false);
          }}
        />
      )}
    </>
  );
}

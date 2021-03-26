import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Tooltip } from "antd";
import { useParams, Link, useLocation } from "react-router-dom";
import tokenImg from "config/tokenImg";
import axios from "utils/axios";
import { useWallet } from "use-wallet";
import mm from "components/mm";
import DepositModal from "components/DepositModal";
import BackButton from "assets/back.svg";

import "./style.scss";

export default function MineDetail() {
  const { address } = useParams();
  const [poolInfo, setPoolInfo] = useState({});
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const wallet = useWallet();
  const { account } = wallet;
  const location = useLocation()

  const currentToken = new URLSearchParams(location.search).get('token'); 

  useEffect(() => {
    getPool();
  }, []);

  useEffect(() => {
    if (!account) {
      return;
    }
    getOtherInfo();
    const interval = setInterval(() => {
      getOtherInfo();
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, [account]);

  const getOtherInfo = async () => {
    const userStats = await axios.get(`/${currentToken}/pools/userstats`, {
      params: {
        account: account,
        pool: address,
      },
    });
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
    <div className="page-mine-detail">
      <Link to="/mine">
        <img src={BackButton} className="back-button" />
      </Link>
      <div className="container">
        <Row
          gutter={{ md: 32 }}
          className="pool-list"
          type="flex"
          justify="center"
        >
          <Col xs={24} lg={12} xl={8}>
            <div className="pool-item">
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
                className="btn-yellow"
                onClick={() => {
                  setDepositModalVisible(true);
                }}
              >
                STAKE
              </Button>
            </div>
          </Col>
          <Col xs={24} lg={12} xl={8}>
            <div className="pool-item">
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
                <span>{currentToken === 'zeth' ? 'ETH' : 'BTC'}:</span>
                <span>{poolInfo.earnedBETH || 0}</span>
              </div>
              {/* <div className="info-line">
                <span>ICA:</span>
                <span>{poolInfo.earnedICA || 0}</span>
              </div> */}
              {/* {poolInfo &&
                poolInfo.reward_tokens &&
                poolInfo.reward_tokens.map((item) => (
                  <div className="info-line">
                    <span>{item}:</span>
                    <span>0</span>
                  </div>
                ))} */}
              <div className="info-line">
                <Button
                  onClick={() => {
                    doClaim();
                  }}
                  className="btn-yellow"
                >
                  CLAIM
                </Button>
              </div>
              {/* <div
                className={`info-line ${
                  poolInfo.reward_tokens && poolInfo.reward_tokens.length > 1
                    ? "multiple"
                    : ""
                }`}
              >
                {poolInfo &&
                  poolInfo.reward_tokens &&
                  poolInfo.reward_tokens.map((item) => (
                    <Button
                      onClick={() => {
                        setDepositModalVisible(true);
                      }}
                      className="btn-yellow"
                    >
                      CLAIM {item}
                    </Button>
                  ))}
              </div> */}
            </div>
          </Col>
        </Row>
        <div className="withdraw-area">
          <Button
            className="btn-yellow"
            onClick={() => {
              doExit();
            }}
          >
            Settle &amp; Withdraw
          </Button>
          <div className="hint">
            As you unstake tokens from the pool, the smart contract will
            automatically harvest the ETH and ICA.
          </div>
        </div>
      </div>
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
    </div>
  );
}

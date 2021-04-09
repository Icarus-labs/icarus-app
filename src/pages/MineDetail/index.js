import React, { useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
// import { Link, useLocation } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import tokenImg from "config/tokenImg";
import { useWallet } from "use-wallet";
import config from "config";
import axios from "utils/axios";
import mm from "components/mm";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import DepositModal from "components/DepositModal";
import UnstakeModal from "components/UnstakeModal";
import ConnectWallet from "components/ConnectWallet";
import { toThousands } from "utils/Tools";

// import BackButton from "assets/back.svg";

import "./style.scss";

export default function MineDetail(props) {
  const {
    address,
    currentToken,
    item,
    earnedChange,
    stakedChange,
    prices,
  } = props;
  const [poolInfo, setPoolInfo] = useState({});
  const [poolInfoTrigger, setPoolInfoTrigger] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [approveParams, setApproveParams] = useState({ txs: [] });
  const network = useSelector((state) => state.setting.network);
  const mode = useSelector((state) => state.setting.mode);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [unstakeModalVisible, setUnstakeModalVisible] = useState(false);
  const wallet = useWallet();
  const { account } = wallet;
  // const buyContractAddress = config[network].buyContractAddress;
  const scanUrl = config[network].scanUrl;
  // const location = useLocation()

  // const currentToken = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    getPool();
  }, []);

  useEffect(() => {
    if (!account || poolInfoTrigger === 1) {
      return;
    }
    getOtherInfo(true);
    const interval = setInterval(() => {
      getOtherInfo();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [account, poolInfoTrigger]);

  const getOtherInfo = async (isFirst) => {
    const userStats = await axios.get(`/${currentToken}/pools/userstats`, {
      params: {
        account: account,
        pool: address,
      },
    });
    // trigger

    let totalStakedUsd = 0;

    if (isFirst && Object.keys(poolInfo).length > 0) {
      // calculate total earned usd value
      let totalUsd = 0;
      if (poolInfo.reward_tokens.indexOf("ETH") > -1) {
        totalUsd += userStats.data.data.income_amount_pretty * prices.eth;
      }
      if (poolInfo.reward_tokens.indexOf("BTCB") > -1) {
        totalUsd += userStats.data.data.income_amount_pretty * prices.btc;
      }
      if (poolInfo.reward_tokens.indexOf("ICA") > -1) {
        totalUsd += userStats.data.data.reward_amount_pretty * prices.ica;
      }
      earnedChange(totalUsd);
      // calculate total staked usd value

      totalStakedUsd =
        userStats.data.data.staked_amount_pretty * poolInfo.value_per_stake;

      stakedChange(totalStakedUsd);

      setPoolInfo((prev) => {
        return {
          ...prev,
          stakedInUsd: totalStakedUsd,
        };
      });
    }

    if (userStats && userStats.data.data) {
      setPoolInfo((prev) => {
        return {
          ...prev,
          staked: userStats.data.data.staked_amount_pretty,
          earned: userStats.data.data.income_amount_pretty,
          earnedICA: userStats.data.data.reward_amount_pretty,
          lpAmount: userStats.data.data.lp_amount_pretty,
        };
      });
    }
  };

  const getPool = async () => {
    const result = await axios.get(`/${currentToken}/pools/info`, {
      params: {
        pool: address,
      },
    });

    setPoolInfo(result.data.data);

    setPoolInfoTrigger((prev) => prev + 1);

    // check allowance
    const approveResult = await axios.post(`/${currentToken}/pools/approve`, {
      pool: address,
      account: account,
    });

    setApproveParams(approveResult.data.data);
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

  const doApprove = async () => {
    let txnParams = approveParams.txs.map((item) => {
      return {
        from: account,
        to: item.contract,
        data: item.calldata,
      };
    });

    const status = await mm.sendTransaction(txnParams, "Approve");

    if (status) {
      // message.success("Success");
      setApproveParams({ txs: [] });
      getPool();
    }
  };

  const LockedButton = () => {
    return <Button className="btn">Locked</Button>;
  };

  return (
    <>
      <div
        className={`pool-item handle-card line-block ${
          mode === "card" ? "block is-card" : "is-line"
        }`}
      >
        <div className="card-top">
          <div className="info-line top-line">
            <div className="top-line-wrapper">
              <span className="tokens">
                {item.stake_token.split("-").map((token) => (
                  <a
                    target="_blank"
                    className="token-item-link"
                    key={token}
                    href={`${scanUrl}/${poolInfo.stake_address}`}
                  >
                    <img src={tokenImg[token]} className="token-item" />
                  </a>
                ))}
              </span>
              <span>
                <span className="deposit-by">
                  <a
                    target="_blank"
                    href={`${scanUrl}/${poolInfo.stake_address}`}
                  >
                    {item.stake_token}
                  </a>
                </span>
                <span className="tvl">TVL: ${toThousands(item.tvl) || 0}</span>
              </span>
            </div>
            {mode === "line" && (
              <div>
                <span>APR:</span>
                <Tooltip
                  title={`${
                    item.income_apy ? "ETH APR: " + item.income_apy + "%" : ""
                  } ${item.income_apy && item.reward_apy && "|"} ${
                    item.reward_apy ? "ICA APR: " + item.reward_apy + "%" : ""
                  }`}
                >
                  <span>{item.apy || 0}% </span>
                </Tooltip>
                {poolInfo.stake_token === "ZBTC" && (
                  <Tooltip title="Due to current migration schedule, mining hashrate is recorded at 12.00 AM UTC+8 while ZBTC is exchanged at 5.00 PM daily. Hashrate differences might result in temporary fluctuation of rewards.">
                    <QuestionCircleOutlined className="question-icon" />
                  </Tooltip>
                )}

                {showMore ? (
                  <UpOutlined
                    className="toggle-btn"
                    onClick={() => setShowMore(false)}
                  />
                ) : (
                  <DownOutlined
                    className="toggle-btn"
                    onClick={() => setShowMore(true)}
                  />
                )}
              </div>
            )}
          </div>
          <div className="info-line apr">
            {mode === "card" && (
              <>
                <span>APR:</span>
                <div>
                  <Tooltip
                    title={`${
                      item.reward_apy ? "ICA APR: " + item.reward_apy + "%" : ""
                    } ${
                      item.income_apy
                        ? ` | ${
                            item.reward_tokens.indexOf("BTCB") > -1
                              ? "BTCB"
                              : "ETH"
                          } APR: ` +
                          item.income_apy +
                          "%"
                        : ""
                    }`}
                  >
                    <span>{item.apy || 0}% </span>
                  </Tooltip>
                  {poolInfo.stake_token === "ZBTC" && (
                    <Tooltip title="Due to current migration schedule, mining hashrate is recorded at 12.00 AM UTC+8 while ZBTC is exchanged at 5.00 PM daily. Hashrate differences might result in temporary fluctuation of rewards.">
                      <QuestionCircleOutlined className="question-icon" />
                    </Tooltip>
                  )}
                </div>
              </>
            )}
          </div>
          {(mode === "card" || showMore) && (
            <>
              <div className="info-line">
                <span>EARN:</span>
                <span>
                  {item.reward_tokens.map((token, index) => (
                    <span key={index}>
                      <span>{token}</span>{" "}
                      {index !== item.reward_tokens.length - 1 ? "+" : ""}
                    </span>
                  ))}
                </span>
              </div>

              <div className="info-line">
                <span>STAKED:</span>
                <span>
                  {poolInfo.staked ? Number(poolInfo.staked) : 0}{" "}
                  {item.stake_token}
                </span>
              </div>

              <div className="info-line">
                <span>EARNED:</span>
                <span style={{ textAlign: "right" }}>
                  {poolInfo.reward_tokens &&
                    poolInfo.reward_tokens.map((reward, index) => (
                      <div key={index}>
                        {reward === "ICA"
                          ? `${poolInfo.earnedICA || 0} ${reward}`
                          : `${poolInfo.earned || 0} ${reward}`}
                      </div>
                    ))}
                  {/* {poolInfo.earned || 0}{" "}
                {currentToken === "zeth" ? "ETH" : "BTCB"} */}
                </span>
              </div>
            </>
          )}
        </div>

        {(mode === "card" || showMore) && (
          <div className="card-bottom">
            <div
              className={`btns ${
                Number(poolInfo.staked) > 0 ? "" : "single-btn"
              }`}
            >
              {wallet.status === "connected" ? (
                poolInfo.stake_token === "ICA-BTCB" ? (
                  <LockedButton />
                ) : approveParams.txs && approveParams.txs.length > 0 ? (
                  <Button onClick={doApprove} className="btn">
                    Approve
                  </Button>
                ) : Number(poolInfo.staked) > 0 ? (
                  <>
                    <div className="quick-btns">
                      <Button
                        onClick={() => {
                          setDepositModalVisible(true);
                        }}
                        className="btn"
                      >
                        +
                      </Button>
                      <Button
                        onClick={() => {
                          setUnstakeModalVisible(true);
                        }}
                        className="btn"
                      >
                        -
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        doClaim();
                      }}
                      className="btn"
                    >
                      CLAIM
                    </Button>
                  </>
                ) : (
                  <Button
                    className="btn"
                    onClick={() => {
                      setDepositModalVisible(true);
                    }}
                  >
                    STAKE
                  </Button>
                )
              ) : (
                <ConnectWallet />
              )}
            </div>
            <div className="info-line user-tvl">
              <span>TVL:</span>
              <span>
                ${poolInfo.stakedInUsd ? toThousands(poolInfo.stakedInUsd) : 0}
              </span>
            </div>
          </div>
        )}
      </div>

      {depositModalVisible && (
        <DepositModal
          poolAddress={address}
          balance={poolInfo.lpAmount}
          stakeToken={poolInfo.stake_token}
          currentToken={currentToken}
          onCancel={() => {
            setDepositModalVisible(false);
          }}
        />
      )}

      {unstakeModalVisible && (
        <UnstakeModal
          poolAddress={address}
          balance={poolInfo.staked}
          stakeToken={poolInfo.stake_token}
          currentToken={currentToken}
          onCancel={() => {
            setUnstakeModalVisible(false);
          }}
        />
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
// import { Link, useLocation } from "react-router-dom";
// import { QuestionCircleOutlined } from "@ant-design/icons";
import tokenImg from "config/tokenImg";
import { useWallet } from "use-wallet";
import config, { blocksLeftMapping } from "config";
import axios from "utils/axios";
import mm from "components/mm";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import DepositModal from "components/DepositModal";
import UnstakeModal from "components/UnstakeModal";
import ConnectWallet from "components/ConnectWallet";
import { toThousands } from "utils/Tools";
import MetamaskIcon from "assets/metamask.svg";

import "./style.scss";

export default function MineDetail(props) {
  const {
    address,
    currentToken,
    item,
    earnedChange,
    stakedChange,
    starBoostChange,
    starEarnedChange,
    starStakedChange,
    prices,
    thirdPrices,
    hasStaked,
  } = props;
  const [poolInfo, setPoolInfo] = useState({});
  const [poolInfoTrigger, setPoolInfoTrigger] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [blocksLeft, setBlocksLeft] = useState(0);
  const [approveParams, setApproveParams] = useState({ txs: [] });
  const network = useSelector((state) => state.setting.network);
  const mode = useSelector((state) => state.setting.mode);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [unstakeModalVisible, setUnstakeModalVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const wallet = useWallet();
  const { account } = wallet;
  const scanUrl = config[network].scanUrl;

  useEffect(() => {
    getPool();
    // checkLock();
  }, []);

  useEffect(() => {
    if (
      !(
        poolInfo &&
        poolInfo.reward_tokens &&
        poolInfo.reward_tokens[0] &&
        blocksLeftMapping[poolInfo.reward_tokens[0]]
      )
    ) {
      return;
    }
    const interval = setInterval(() => {
      const timeLeft =
        blocksLeftMapping[poolInfo.reward_tokens[0]] -
        new Date().valueOf() / 1000;
      
      const blocks = parseInt(timeLeft / 3)
      setBlocksLeft(blocks);
      // if(blocks <= 0){
      //   item.inactive = true
      // }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [poolInfo]);

  const checkLock = () => {
    if (
      address === "0xEbdD674EE1b9d4f97a2F09bAD39A37a30CD09907" ||
      address === "0xdd9937F73115AD155dF124eF0F64DA65Cf8Cc3d4" ||
      address === "0xA2B04f1409F741E59A175Eee43E998d3bFf36C6A"
    ) {
      setIsLocked(true);
    }
  };

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
    let starTotalStakedUsd = 0;

    if (isFirst && Object.keys(poolInfo).length > 0 && userStats.data.data) {
      // calculate total earned usd value
      let totalUsd = 0;
      let starTotalUsd = 0;

      if (poolInfo.type !== "reward3rd") {
        if (poolInfo.reward_tokens.indexOf("ETH") > -1) {
          totalUsd += userStats.data.data.income_amount_pretty * prices.eth;
        }
        if (poolInfo.reward_tokens.indexOf("BTCB") > -1) {
          totalUsd += userStats.data.data.income_amount_pretty * prices.btc;
        }
        if (poolInfo.reward_tokens.indexOf("ICA") > -1) {
          totalUsd += userStats.data.data.reward_amount_pretty * prices.ica;
        }
      }

      if (
        poolInfo.type === "reward3rd" &&
        thirdPrices[poolInfo.reward_tokens[0]]
      ) {
        starTotalUsd +=
          userStats.data.data.reward_amount_pretty *
          thirdPrices[poolInfo.reward_tokens[0]];
      }

      earnedChange(totalUsd);
      starEarnedChange(starTotalUsd);
      // calculate total staked usd value

      if (isNaN(poolInfo.value_per_stake)) {
        return;
      }

      if (poolInfo.type !== "reward3rd") {
        totalStakedUsd =
          userStats.data.data.staked_amount_pretty * poolInfo.value_per_stake;
        stakedChange(totalStakedUsd);
      }

      if (poolInfo.type === "reward3rd") {
        starTotalStakedUsd =
          userStats.data.data.staked_amount_pretty * poolInfo.value_per_stake;
        starStakedChange(starTotalStakedUsd);
      }

      setPoolInfo((prev) => {
        return {
          ...prev,
          stakedInUsd: totalStakedUsd,
          starStakedInUsd: starTotalStakedUsd,
        };
      });
    }

    if (userStats && userStats.data.data) {
      if (Number(userStats.data.data.staked_amount_pretty) > 0) {
        hasStaked();
      }
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

  const addToMetamask = async () => {
    const tokenAddress =
      poolInfo.type === "reward3rd"
        ? poolInfo.reward_addresses[0]
        : poolInfo.stake_address;
    const tokenDecimals = poolInfo.reward_tokens[0] === "DOGE" ? 8 : 18;
    const tokenSymbol =
      poolInfo.type === "reward3rd"
        ? poolInfo.reward_tokens[0]
        : poolInfo.stake_token;
    const tokenImage =
      "https://app.icarus.finance/tokens/" + tokenSymbol + ".svg";

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        message.success("Token Added");
      } else {
        message.error("Failed to add token");
      }
    } catch (error) {
      console.log(error, "err");
      message.error("Failed to add token");
    }
  };

  const getPool = async () => {
    if (!currentToken) {
      setPoolInfo({});
      return;
    }

    const result = await axios.get(`/${currentToken}/pools/info`, {
      params: {
        pool: address,
      },
    });

    setPoolInfo(result.data.data || {});

    setPoolInfoTrigger((prev) => prev + 1);

    if (address === "0x568E19cD1d0fA3C6b06A9850287829B94449B28D") {
      // 1. pool address to change, 2. the apr
      starBoostChange("0x765DD0504aDA79eF6D5cB2694AbfBC0ba36633cD", item.apy);
    }

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
        {/* {item.boostAPR && <div className="star-boost">{item.boostAPR}%</div>} */}
        <div className="card-top">
          <div className="info-line top-line">
            {poolInfo.type === "reward3rd" && (
              <div className="top-line-wrapper">
                <span className="tokens">
                  <a
                    target="_blank"
                    className="token-item-link"
                    href={`${scanUrl}/${poolInfo.stake_address}`}
                  >
                    <img
                      src={
                        tokenImg[
                          String(poolInfo.reward_tokens[0]).toUpperCase()
                        ]
                      }
                      className="token-item"
                    />
                  </a>
                </span>
                <span>
                  <span className="deposit-by">
                    <a
                      target="_blank"
                      href={`${scanUrl}/${poolInfo.stake_address}`}
                    >
                      {poolInfo.reward_tokens[0]}
                    </a>
                  </span>
                  <span className="tvl">
                    TVL: ${toThousands(item.tvl) || 0}
                  </span>
                </span>
              </div>
            )}

            {poolInfo.type !== "reward3rd" && (
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
                      href={
                        poolInfo.lp_url
                          ? poolInfo.lp_url
                          : `${scanUrl}/${poolInfo.stake_address}`
                      }
                    >
                      {item.stake_token}
                    </a>
                  </span>
                  <span className="tvl">
                    TVL: ${toThousands(item.tvl) || 0}
                  </span>
                </span>
              </div>
            )}

            {mode === "line" && (
              <div>
                <span>APR:</span>
                {poolInfo.type === "reward3rd" ? (
                  <Tooltip
                    title={`${item.reward_tokens[0]} APR: ${item.apy || 0}%`}
                  >
                    <span>{item.apy || 0}% </span>
                  </Tooltip>
                ) : (
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
                  {poolInfo.type === "reward3rd" ? (
                    <Tooltip
                      title={`${item.reward_tokens[0]} APR: ${item.apy || 0}%`}
                    >
                      <span>{item.apy || 0}% </span>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={`${
                        item.reward_apy
                          ? "ICA APR: " + item.reward_apy + "%"
                          : ""
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
                        {poolInfo.type === "reward3rd" || reward === "ICA"
                          ? `${poolInfo.earnedICA || 0} ${reward}`
                          : `${poolInfo.earned || 0} ${reward}`}
                      </div>
                    ))}
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
              {isLocked ? (
                <LockedButton />
              ) : wallet.status === "connected" ? (
                approveParams &&
                approveParams.txs &&
                approveParams.txs.length > 0 ? (
                  <Button onClick={doApprove} className="btn">
                    Approve
                  </Button>
                ) : true ||
                  Number(poolInfo.staked) > 0 ||
                  Number(poolInfo.earnedICA) > 0 ||
                  Number(poolInfo.earned) > 0 ? (
                  <>
                    <div className="quick-btns">
                      {!item.inactive && (
                        <div>
                          <Button
                            onClick={() => {
                              setDepositModalVisible(true);
                            }}
                            className="btn"
                          >
                            +
                          </Button>
                          <span
                            className={`action-hint ${
                              item.version == 2 && item.fee ? "" : "v-hidden"
                            }`}
                          >
                            DEPOSIT FEE: {item.fee.split(" ")[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <Button
                          onClick={() => {
                            setUnstakeModalVisible(true);
                          }}
                          className="btn"
                        >
                          -
                        </Button>
                        <span
                          className={`action-hint ${
                            item.version == 2 && item.fee ? "" : "v-hidden"
                          }`}
                        >
                          WITHDRAW FEE: {item.fee.split(" ")[1]}
                        </span>
                      </div>
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
                  !item.inactive && (
                    <Button
                      className="btn"
                      onClick={() => {
                        setDepositModalVisible(true);
                      }}
                    >
                      STAKE
                    </Button>
                  )
                )
              ) : (
                <ConnectWallet />
              )}
            </div>
            <div className="info-line user-tvl">
              <span>
                {poolInfo.lp_url && (
                  <a
                    className="add-liquidity"
                    href={poolInfo.lp_url}
                    target="_blank"
                  >
                    Add Liquidity
                  </a>
                )}
                {(poolInfo.type === "single" ||
                  poolInfo.type === "reward3rd") && (
                  <a
                    className="add-metamask"
                    onClick={addToMetamask}
                    target="_blank"
                  >
                    Add to Metamask
                    <img src={MetamaskIcon} className="metamask-icon" />
                  </a>
                )}
              </span>
              <span>
                TVL: $
                {poolInfo.type === "reward3rd"
                  ? poolInfo.starStakedInUsd
                    ? toThousands(poolInfo.starStakedInUsd)
                    : 0
                  : poolInfo.stakedInUsd
                  ? toThousands(poolInfo.stakedInUsd)
                  : 0}
              </span>
            </div>
            {poolInfo.type === "reward3rd" && !item.inactive && (
              <div className={`info-line end-block ${blocksLeft <= 0 ? 'hide' : ''}`}>
                <span>End</span>
                <span>{blocksLeft} BLOCKS</span>
              </div>
            )}
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

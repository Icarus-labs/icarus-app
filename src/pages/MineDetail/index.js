import React, { useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
// import { Link, useLocation } from "react-router-dom";
// import { QuestionCircleOutlined } from "@ant-design/icons";
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
  const { address, currentToken, item, earnedChange, stakedChange, prices } =
    props;
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

    if (isFirst && Object.keys(poolInfo).length > 0 && userStats.data.data) {
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
      // if (poolInfo.reward_tokens.indexOf("ZETH") > -1) {
      //   totalUsd += userStats.data.data.reward_amount_pretty * prices.zeth;
      // }
      earnedChange(totalUsd);
      // calculate total staked usd value

      if (isNaN(poolInfo.value_per_stake)) {
        return;
      }

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

  const addToMetamask = async () => {
    const tokenAddress = poolInfo.stake_address;
    const tokenDecimals = 18;
    const tokenSymbol = poolInfo.stake_token;
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

  // const LockedButton = () => {
  //   return <Button className="btn">Locked</Button>;
  // };

  return (
    <>
      <div
        className={`pool-item handle-card line-block ${
          mode === "card" ? "block is-card" : "is-line"
        }`}
      >
        <div className="card-top">
          <div className="info-line top-line">
            {address === "0x00A089b819856E81f1dd88BB79759CD8a85a6C4e" && (
              <div className="top-line-wrapper">
                <span className="tokens">
                  <a
                    target="_blank"
                    className="token-item-link"
                    href={`${scanUrl}/${poolInfo.stake_address}`}
                  >
                    <img src={tokenImg["XDITTO"]} className="token-item" />
                  </a>
                </span>
                <span>
                  <span className="deposit-by">
                    <a
                      target="_blank"
                      href={`${scanUrl}/${poolInfo.stake_address}`}
                    >
                      XDITTO
                    </a>
                  </span>
                  <span className="tvl">
                    TVL: ${toThousands(item.tvl) || 0}
                  </span>
                </span>
              </div>
            )}

            {address === "0x07b40e5dc40f21b3E1Ba47845845E83dF5665DbF" && (
              <div className="top-line-wrapper">
                <span className="tokens">
                  <a
                    target="_blank"
                    className="token-item-link"
                    href={`${scanUrl}/${poolInfo.stake_address}`}
                  >
                    <img src={tokenImg["CAKE"]} className="token-item" />
                  </a>
                </span>
                <span>
                  <span className="deposit-by">
                    <a
                      target="_blank"
                      href={`${scanUrl}/${poolInfo.stake_address}`}
                    >
                      CAKE
                    </a>
                  </span>
                  <span className="tvl">
                    TVL: ${toThousands(item.tvl) || 0}
                  </span>
                </span>
              </div>
            )}

            {address !== "0x00A089b819856E81f1dd88BB79759CD8a85a6C4e" &&
              address !== "0x07b40e5dc40f21b3E1Ba47845845E83dF5665DbF" && (
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
                {address === "0x00A089b819856E81f1dd88BB79759CD8a85a6C4e" ||
                address === "0x07b40e5dc40f21b3E1Ba47845845E83dF5665DbF" ? (
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
                  {address === "0x00A089b819856E81f1dd88BB79759CD8a85a6C4e" ||
                  address === "0x07b40e5dc40f21b3E1Ba47845845E83dF5665DbF" ? (
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
                        {reward === "ICA" ||
                        reward === "xDitto" ||
                        reward === "CAKE"
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

        {(mode === "card" || showMore) && !item.inactive && (
          <div className="card-bottom">
            <div
              className={`btns ${
                Number(poolInfo.staked) > 0 ? "" : "single-btn"
              }`}
            >
              {wallet.status === "connected" ? (
                approveParams &&
                approveParams.txs &&
                approveParams.txs.length > 0 ? (
                  <Button onClick={doApprove} className="btn">
                    Approve
                  </Button>
                ) : Number(poolInfo.staked) > 0 ||
                  Number(poolInfo.earnedICA) > 0 ||
                  Number(poolInfo.earned) > 0 ? (
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
                {(poolInfo.stake_token === "ZETH" ||
                  poolInfo.stake_token === "ZBTC") && (
                  <a
                    className="add-metamask"
                    onClick={addToMetamask}
                    target="_blank"
                  >
                    Add to Metamask
                  </a>
                )}
              </span>
              <span>
                TVL: $
                {poolInfo.stakedInUsd ? toThousands(poolInfo.stakedInUsd) : 0}
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

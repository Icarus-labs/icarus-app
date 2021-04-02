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
import ConnectWallet from "components/ConnectWallet";
import { toThousands } from "utils/Tools";

// import BackButton from "assets/back.svg";

import "./style.scss";

export default function MineDetail(props) {
  const { address, currentToken, item, earnedChanged } = props;
  const [poolInfo, setPoolInfo] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [approveParams, setApproveParams] = useState({ txs: [] });
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
    }, 30000);
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

    await mm.sendTransaction(txnParams, "Claim Reward");

    // if (status) {
    //   message.success("Success");
    // }
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
        className={`pool-item line-block ${
          mode === "card" ? "block is-card" : "is-line"
        }`}
      >
        {(poolInfo.stake_token === "ICA-BUSD" ||
          poolInfo.stake_token === "ICA-ETH") && (
          <div className="open-soon">
            Open Soon{" "}
            <Tooltip title="The pool will be available on 2nd April">
              <QuestionCircleOutlined className="question-icon" />
            </Tooltip>
          </div>
        )}
        <div className="info-line top-line">
          <div className="top-line-wrapper">
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
            <span>
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
              <span className="tvl">TVL: ${toThousands(item.tvl) || 0}</span>
            </span>
          </div>
          {mode === "line" && (
            <div>
              <span>APR:</span>
              <Tooltip
                title={`${
                  item.income_apy ? "ETH APR: " + item.income_apy + "%" : ""
                } | ${
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
                    item.income_apy ? "ETH APR: " + item.income_apy + "%" : ""
                  } | ${
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
              <span>STAKED:</span>
              <span>
                {poolInfo.staked ? Number(poolInfo.staked) : 0}{" "}
                {item.stake_token}
              </span>
            </div>

            <div className="info-line">
              <span>EARNED:</span>
              <span>
                {/* {poolInfo.reward_tokens &&
                  poolInfo.reward_tokens.map((reward, index) => (
                    <div>
                      {reward === "ICA"
                        ? `${poolInfo.earnedICA} ${reward}`
                        : `${poolInfo.earned} ${reward}`}
                    </div>
                  ))} */}
                {poolInfo.earned || 0}{" "}
                {currentToken === "zeth" ? "ETH" : "BTCB"}
              </span>
            </div>

            <div
              className={`btns ${
                Number(poolInfo.staked) > 0 ? "" : "single-btn"
              }`}
            >
              {wallet.status === "connected" ? (
                approveParams.txs && approveParams.txs.length > 0 ? (
                  <Button onClick={doApprove} className="btn">
                    Approve
                  </Button>
                ) : Number(poolInfo.staked) > 0 ? (
                  <>
                    <div className="quick-btns">
                      {poolInfo.stake_token !== "ICA-BUSD" &&
                        poolInfo.stake_token !== "ICA-ETH" && (
                          <Button
                            onClick={() => {
                              setDepositModalVisible(true);
                            }}
                            className="btn"
                          >
                            +
                          </Button>
                        )}

                      <Button
                        onClick={() => {
                          doExit();
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
                ) : poolInfo.stake_token !== "ICA-BUSD" &&
                  poolInfo.stake_token !== "ICA-ETH" ? (
                  <Button
                    className="btn"
                    onClick={() => {
                      setDepositModalVisible(true);
                    }}
                  >
                    STAKE
                  </Button>
                ) : (
                  <LockedButton />
                )
              ) : (
                <ConnectWallet />
              )}
            </div>
          </>
        )}
      </div>

      {/* {mode === "card" ? (
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
            <span>
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
              <span className="tvl">TVL: ${item.tvl || 0}</span>
            </span>
          </div>
          <div className="info-line apr">
            <span>APR:</span>
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
            {wallet.status === "connected" ? (
              approveParams.txs && approveParams.txs.length > 0 ? (
                <Button onClick={doApprove} className="btn">
                  Approve
                </Button>
              ) : poolInfo.earnedBETH > 0 ? (
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
                        doExit();
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
        </div>
      ) : (
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
      )} */}

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
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Button, Row, Col, Tooltip, Input, Slider } from "antd";
import ArrowDown from "assets/arrow-down.svg";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import FarmContractApi from "contract/FarmContractApi";
import StrategyContractApi from "contract/StrategyContractApi";
import CommonContractApi from "contract/CommonContractApi";
import ActionButton from "components/ActionButton";
import config from "config";
import { useWallet } from "use-wallet";

import "./style.scss";

const sliderMarks = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};

export default function FarmItem(props) {
  const { item } = props;
  const wallet = useWallet();
  const [info, setInfo] = useState({});
  const network = useSelector((state) => state.setting.network);
  const [showDetail, setShowDetail] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositPercent, setDepositPercent] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawPercent, setWithdrawPercent] = useState(0);
  const [rewardList, setRewardList] = useState([
    {
      period: "1d",
      lp: "0.0000",
      ica: "0.0000",
    },
    {
      period: "1w",
      lp: "0.0000",
      ica: "0.0000",
    },
    {
      period: "1m",
      lp: "0.0000",
      ica: "0.0000",
    },
    {
      period: "3m",
      lp: "0.0000",
      ica: "0.0000",
    },
    {
      period: "6m",
      lp: "0.0000",
      ica: "0.0000",
    },
    {
      period: "1y",
      lp: "0.0000",
      ica: "0.0000",
    },
  ]);

  const toggleShowDetail = () => {
    setShowDetail((prev) => {
      return !prev;
    });
  };

  const doDeposit = async () => {
    await FarmContractApi.deposit(item.pid, depositAmount, wallet);
    getPoolInfo()
  };
  const doDepositAll = async () => {
    depositAmountChange(info.balance);
    await FarmContractApi.deposit(item.pid, depositAmount, wallet);
    getPoolInfo()
  };
  const doWithdraw = async () => {
    await FarmContractApi.withdraw(item.pid, withdrawAmount, wallet);
    getPoolInfo()
  };
  const doWithdrawAll = async () => {
    withdrawAmountChange(info.deposited);
    await FarmContractApi.withdrawAll(item.pid, wallet);
    getPoolInfo()
  };

  const doClaim = async () => {
    await FarmContractApi.withdraw(item.pid, 0, wallet);
    getPoolInfo()
  };

  const doEarn = async () => {
    await StrategyContractApi.earn(item.strategy, wallet);
    getPoolInfo()
  };

  const getPoolInfo = async () => {
    const poolInfo = await FarmContractApi.getPoolInfo(item.pid, wallet);
    const balance = await CommonContractApi.balanceOf(poolInfo.want, wallet);
    const deposited = await FarmContractApi.getDeposited(item.pid, wallet);
    const pendingReward = await FarmContractApi.getPendingReward(
      item.pid,
      wallet
    );
    const {apy, dailyApy} = await FarmContractApi.getApy(
      item.pid,
      poolInfo,
      item.tokens,
      wallet
    );
    console.log("pool info", poolInfo);
    const tvl = await FarmContractApi.getTVL(poolInfo.want, item, wallet);
    setInfo((prev) => {
      return {
        ...prev,
        ...poolInfo,
        apy,
        dailyApy,
        deposited,
        pendingReward,
        balance,
        tvl,
      };
    });
  };

  useEffect(async () => {
    if (wallet.account) {
      getPoolInfo();
    }
  }, [wallet]);

  const depositAmountChange = (val) => {
    setDepositAmount(val);
    setDepositPercent((val / info.balance) * 100);
  };

  const depositSliderChange = async (val) => {
    setDepositPercent(val);
    setDepositAmount((info.balance * val) / 100);
  };

  const withdrawAmountChange = (val) => {
    setWithdrawAmount(val);
    setWithdrawPercent((val / info.deposited) * 100);
  };

  const withdrawSliderChange = async (val) => {
    setWithdrawPercent(val);
    setWithdrawAmount((info.deposited * val) / 100);
  };

  return (
    <div className="farm-item">
      <div className="main-area">
        <div className="left">
          <div className="lp-info">
            <div className="token-pair">
              <img src={`/tokens/${item.want[0]}.svg`} className="token0" />
              {item.want[1] && (
                <img src={`/tokens/${item.want[1]}.svg`} className="token1" />
              )}
            </div>
            <div>
              <div className="lp-name">{item.want.join("-")} {item.want.length > 1 && <span>LP</span>}</div>
              <div className="uses">Uses: icarus.finance</div>
            </div>
          </div>
          <div className="buttons">
            <Button className="btn-purple">Buy Tokens</Button>
            <Button className="btn-black">Add Liquidity</Button>
          </div>
        </div>
        <div className="right">
          <div className="num-box purple-line">
            <div className="label">Wallet</div>
            <div className="value">{Number(info.balance).toFixed(2)}</div>
          </div>
          <div className="num-box purple">
            <div className="label">Deposited</div>
            <div className="value">{info.deposited}</div>
          </div>
          <div className="num-box">
            <div className="label">APY</div>
            <div className="value">138.21%</div>
          </div>
          <div className="num-box">
            <div className="label">Daily</div>
            <div className="value">1.45%</div>
          </div>
          <div className="num-box">
            <div className="label">TVL</div>
            <div className="value">${info.tvl}</div>
          </div>
          {/* <div className="num-box">
            <div className="label">Deposited</div>
            <div className="value">465.769</div>
          </div> */}
          <img
            src={ArrowDown}
            className={`arrow-down ${showDetail && "reverse"}`}
            onClick={toggleShowDetail}
          />
        </div>
      </div>
      {showDetail && (
        <div className="action-area">
          <Row gutter={24} type="flex" align="center">
            <Col xs={24} md={12} lg={6}>
              <div className="reward-table">
                <div className="reward-head">
                  <div>Period</div>
                  <div>{item.want.join("-")} {item.want.length > 1 && <span>LP</span>}</div>
                  <div>ICA</div>
                </div>
                <div className="reward-body">
                  {rewardList.map((reward) => (
                    <div className="reward-row">
                      <div>{reward.period}</div>
                      <div>{reward.lp}</div>
                      <div>{reward.ica}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="input-zone">
                <div>
                  <span className="strong-title">Balance:</span> {Number(info.balance).toFixed(8)}{" "}
                  {item.want.join("-")} {item.want.length > 1 && <span>LP</span>}
                </div>
                <Input
                  value={depositAmount}
                  onChange={(e) => depositAmountChange(e.target.value)}
                />
                <Slider
                  marks={sliderMarks}
                  tooltipPlacement="bottom"
                  value={depositPercent}
                  onChange={(val) => depositSliderChange(val)}
                />
                <div className="buttons-area">
                  <ActionButton
                    tokenAddress={info.want}
                    contractAddress={config[network].contracts.farm}
                  >
                    <Button className="btn-purple-line" onClick={doDeposit}>
                      Deposit
                    </Button>
                    <Button className="btn-purple" onClick={doDepositAll}>
                      Deposit All
                    </Button>
                  </ActionButton>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="input-zone">
                <div>
                  <span className="strong-title">Deposited:</span>{" "}
                  {Number(info.deposited).toFixed(8)} {item.want.join("-")} {item.want.length > 1 && <span>LP</span>}
                </div>
                <Input
                  value={withdrawAmount}
                  onChange={(e) => withdrawAmountChange(e.target.value)}
                />
                <Slider
                  marks={sliderMarks}
                  value={withdrawPercent}
                  tooltipPlacement="bottom"
                  onChange={(val) => withdrawSliderChange(val)}
                />
                <div className="buttons-area">
                  <Button className="btn-purple-line" onClick={doWithdraw}>
                    Withdraw
                  </Button>
                  <Button className="btn-trans" onClick={doWithdrawAll}>
                    Withdraw All
                  </Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="claim-area">
                <div>
                  <span className="strong-title">ICA Rewards:</span>{" "}
                  {info.pendingReward}
                </div>
                <Button className="btn-purple btn-claim" onClick={doClaim}>
                  Claim
                </Button>
                <Button className="btn-purple btn-claim" onClick={doEarn} style={{marginLeft: '2px'}}>
                  Compounding
                </Button>
                <div>
                  <span className="strong-title">ICA APR:</span> 18%
                </div>

                <div className="breakdown">
                  Breakdown
                  <Tooltip title="placeholder">
                    <InfoCircleOutlined className="info-circle" />
                  </Tooltip>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Button, Row, Col, Tooltip, Input, Slider } from "antd";
import ArrowDown from "assets/arrow-down.svg";
import { InfoCircleOutlined } from "@ant-design/icons";
import FarmContractApi from "contract/FarmContractApi";
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
  const [showDetail, setShowDetail] = useState(false);
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

  useEffect(async () => {
    if (wallet.account) {
      const foo = await FarmContractApi.getPoolInfo(item.pid, wallet);
      console.log(foo, "foooooo");
    }
  }, [wallet]);

  return (
    <div className="farm-item">
      <div className="main-area">
        <div className="left">
          <div className="lp-info">
            <div className="token-pair">
              <img src={`/tokens/${item.want}.svg`} className="token0" />
              {/* <img
                  src={`/tokens/${item.token1}.svg`}
                  className="token1"
                /> */}
            </div>
            <div>
              <div className="lp-name">{item.want} LP</div>
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
            <div className="value">0</div>
          </div>
          <div className="num-box purple">
            <div className="label">Deposited</div>
            <div className="value">465.769</div>
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
            <div className="value">$54,639</div>
          </div>
          <div className="num-box">
            <div className="label">Deposited</div>
            <div className="value">465.769</div>
          </div>
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
                  <div>
                    {item.token0}-{item.token1} LP
                  </div>
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
                  <span className="strong-title">Balance:</span> 0.0{" "}
                  {item.token0}-{item.token1} LP
                </div>
                <Input />
                <Slider marks={sliderMarks} />
                <div className="buttons-area">
                  <Button className="btn-purple-line">Deposit</Button>
                  <Button className="btn-purple">Deposit All</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="input-zone">
                <div>
                  <span className="strong-title">Deposited:</span> 0.0{" "}
                  {item.token0}-{item.token1} LP
                </div>
                <Input />
                <Slider marks={sliderMarks} />
                <div className="buttons-area">
                  <Button className="btn-purple-line">Withdraw</Button>
                  <Button className="btn-trans">Withdraw All</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="claim-area">
                <div>
                  <span className="strong-title">ICA Rewards:</span> 666.42
                </div>
                <Button className="btn-purple btn-claim">Claim</Button>
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

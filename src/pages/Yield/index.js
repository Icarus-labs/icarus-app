import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  message,
  Checkbox,
  Tooltip,
  Select,
  Slider,
} from "antd";
import { useWallet } from "use-wallet";
import TokenSelect from "components/TokenSelect";
import AdvancedSetting from "components/AdvancedSetting";
import { LoadingOutlined } from "@ant-design/icons";
import ActionButton from "components/ActionButton";
import { useSelector } from "react-redux";
import config from "config";
import ArrowDown from "assets/arrow-down.svg";
import TelescopeIcon from "assets/yield/telescope.svg";
import { InfoCircleOutlined } from "@ant-design/icons";
import CommonContractApi from "contract/CommonContractApi";
import RouterContractApi from "contract/RouterContractApi";

import "./style.scss";

const sliderMarks = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};

export default function Yield() {
  const wallet = useWallet();
  const [tab, setTab] = useState("swap");
  const [fromToken, setFromToken] = useState({});
  const [fromAmount, setFromAmount] = useState("");
  const [toToken, setToToken] = useState({});
  const [setting, setSetting] = useState({
    slippage: 1.0,
  });
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);
  // const [routeText, setRouteText] = useState("");
  const [loadingResult, setLoadingResult] = useState(false);
  const [advancedSettingVisible, setAdvancedSettingVisible] = useState(false);
  const [swaping, setSwaping] = useState(false);
  const [errHint, setErrHint] = useState();
  const [tokenSelectType, setTokenSelectType] = useState("");
  const [vaultList, setVaultList] = useState([
    {
      token0: "ICA",
      token1: "WBNB",
      showDetail: false,
    },
  ]);
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
  const network = useSelector((state) => state.setting.network);

  const routerContractAddress = config[network].contracts.router;

  // const getTokenBalance = async (token) => {
  //   const tokenBalance = await CommonContractApi.balanceOf(
  //     token.address,
  //     wallet
  //   );
  //   return tokenBalance;
  // };

  const toggleShowDetail = (index, showDetail) => {
    setVaultList((prev) => {
      prev[index].showDetail = !showDetail;
      return [...prev];
    });
  };

  return (
    <div className="yield-hubble">
      <Row type="flex" justify="center" align="center" className="banner">
        <Col xs={24} md={12} lg={12}>
          <div className="banner-left">
            <img src={TelescopeIcon} className="telescope-icon" />
            <span className="title">
              Yield
              <br /> Hubble
            </span>
          </div>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <div className="desc">
            Having a bigger understanding of your portfolio makes you a better
            investor. To assist icarians with tools that improve asset
            management and tracking records, Yield Hubble concept was designed.
            <br />
            <br />
            Just relax and enjoy seeing your gains max!
          </div>
        </Col>
      </Row>
      <Row type="flex" className="filter-zone" gutter={32}>
        <Col xs={12} lg={6}>
          <Checkbox>Hide Zero Balance</Checkbox>
          <div className="select-label">Platform</div>
          <Select value={"all"}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="1">2</Select.Option>
            <Select.Option value="1">3</Select.Option>
          </Select>
        </Col>
        <Col xs={12} lg={6}>
          <Checkbox>Retired Vaults</Checkbox>
          <div className="select-label">Vault Type</div>
          <Select value={"all"}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="1">2</Select.Option>
            <Select.Option value="1">3</Select.Option>
          </Select>
        </Col>
        <Col xs={12} lg={6}>
          <Checkbox>Deposited Vaults</Checkbox>
          <div className="select-label">Deposited Vaults</div>
          <Select value={"all"}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="1">2</Select.Option>
            <Select.Option value="1">3</Select.Option>
          </Select>
        </Col>
        <Col xs={12} lg={6}>
          <Checkbox>Boost</Checkbox>
          <div className="select-label">Platform</div>
          <Select value={"all"}>
            <Select.Option value="all">Sort by</Select.Option>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="1">2</Select.Option>
            <Select.Option value="1">3</Select.Option>
          </Select>
        </Col>
      </Row>
      <div className="vault-list">
        {vaultList.map((item, index) => (
          <div className="vault-item">
            <div className="main-area">
              <div className="left">
                <div className="lp-info">
                  <div className="token-pair">
                    <img
                      src={`/tokens/${item.token0}.svg`}
                      className="token0"
                    />
                    <img
                      src={`/tokens/${item.token1}.svg`}
                      className="token1"
                    />
                  </div>
                  <div>
                    <div className="lp-name">
                      {item.token0}-{item.token1} LP
                    </div>
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
                  className={`arrow-down ${item.showDetail && "reverse"}`}
                  onClick={() => toggleShowDetail(index, item.showDetail)}
                />
              </div>
            </div>
            {item.showDetail && (
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
                        <span className="strong-title">ICA Rewards:</span>{" "}
                        666.42
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
        ))}
      </div>
    </div>
  );
}

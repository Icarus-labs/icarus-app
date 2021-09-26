import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, message, Checkbox, Select } from "antd";
import { useWallet } from "use-wallet";
import TokenSelect from "components/TokenSelect";
import AdvancedSetting from "components/AdvancedSetting";
import { LoadingOutlined } from "@ant-design/icons";
import ActionButton from "components/ActionButton";
import { useSelector } from "react-redux";
import config from "config";
import ArrowDown from "assets/arrow-down.svg";
import TelescopeIcon from "assets/yield/telescope.svg";
import CommonContractApi from "contract/CommonContractApi";
import RouterContractApi from "contract/RouterContractApi";

import "./style.scss";

const vaultList = [
  {
    token0: "ICA",
    token1: "WBNB",
    showDetail: false
  },
];

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
  const network = useSelector((state) => state.setting.network);

  const routerContractAddress = config[network].contracts.router;

  // const getTokenBalance = async (token) => {
  //   const tokenBalance = await CommonContractApi.balanceOf(
  //     token.address,
  //     wallet
  //   );
  //   return tokenBalance;
  // };

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
        {vaultList.map((item) => (
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
              </div>
            </div>
            <div className="action-area"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

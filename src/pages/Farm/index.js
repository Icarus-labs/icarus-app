import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Checkbox,
  Select,
} from "antd";
import { useWallet } from "use-wallet";
// import TokenSelect from "components/TokenSelect";
import AdvancedSetting from "components/AdvancedSetting";
import { LoadingOutlined } from "@ant-design/icons";
import ActionButton from "components/ActionButton";
import { useSelector } from "react-redux";
import config from "config";
import TelescopeIcon from "assets/yield/telescope.svg";
import CommonContractApi from "contract/CommonContractApi";
import RouterContractApi from "contract/RouterContractApi";
import FarmItem from 'components/FarmItem'
import "./style.scss";

export default function Farm() {
  const network = useSelector((state) => state.setting.network);
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);
  // const [routeText, setRouteText] = useState("");
  const [loadingResult, setLoadingResult] = useState(false);
  const [advancedSettingVisible, setAdvancedSettingVisible] = useState(false);
  const [swaping, setSwaping] = useState(false);
  const [errHint, setErrHint] = useState();
  const [tokenSelectType, setTokenSelectType] = useState("");
  const [poolList, setPoolList] = useState(config[network].poolList);

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
        {poolList.map((item, index) => (
          <FarmItem item={item} />
        ))}
      </div>
    </div>
  );
}

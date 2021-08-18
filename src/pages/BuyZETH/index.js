import React, { useEffect, useState } from "react";
import { Row, Col, Button, Input, message } from "antd";
import { useWallet } from "use-wallet";
import { useSelector } from "react-redux";
import tokenImg from "config/tokenImg";
import axios from "utils/axios";
import Timer from "react-compound-timer";
import config from "config";
import zethLogo from "assets/tokens/zeth.svg";
import mm from "components/mm";

import "./style.scss";

export default function BuyZETH() {
  const network = useSelector((state) => state.setting.network);
  const [amount, setAmount] = useState();
  const [buying, setBuying] = useState(false);
  const [balance, setBalance] = useState(0);
  const [available, setAvailable] = useState(0);
  // const [totalSupply, setTotalSupply] = useState(50000);
  const [price, setPrice] = useState(0);
  const [isMax, setIsMax] = useState(false);

  const totalSupply = 50000;

  const buyContractAddress = config[network].buyETHContractAddress;
  const scanUrl = config[network].scanUrl;

  const wallet = useWallet();

  const { account } = wallet;

  useEffect(() => {
    getPresaleAvailable();
    getPresalePrice();
    // getTotalSupply();
  }, []);

  useEffect(() => {
    if (account) {
      getAssetBalance();
    }
  }, [account]);

  const doBuy = async () => {
    if (!amount) {
      message.error("Please input amount!");
      return;
    }
    if (!wallet.account) {
      message.error("Wallet not connected!");
      return;
    }
    try {
      setBuying(true);
      const result = await axios.post("/zeth/privatesale/buy", {
        amount: isMax ? "-1" : amount,
        address: wallet.account,
      });

      let txnParams = result.data.data.txs.map((item, index) => {
        return {
          from: wallet.account,
          to: item.contract,
          data: item.calldata,
          isApprove: item.action_type === "Approve",
        };
      });

      const status = await mm.sendTransaction(txnParams, "Buy ZETH");
      if (status) {
        message.success("Success");
      }
      setBuying(false);
    } catch (err) {
      message.error("Something wrong happended");
      setBuying(false);
    }
  };

  const doSetMax = () => {
    const zethAmount = Number(balance) / Number(price);
    setAmount(zethAmount);
    setIsMax(true);
  };

  const getAssetBalance = async () => {
    if (!account) {
      return;
    }
    const result = await axios.get(
      `/zeth/privatesale/balances?address=${account}`
    );
    setBalance(result.data.data.busd_pretty);
  };

  const getPresaleAvailable = async () => {
    const result = await axios.get("/zeth/privatesale/available");
    setAvailable(result.data.data.amount_pretty);
  };

  // const getTotalSupply = async () => {
  //   const result = await axios.get("/zeth/totalsupply");
  //   setTotalSupply(result.data.data.amount_pretty);
  // };

  const getPresalePrice = async () => {
    const result = await axios.get("/zeth/privatesale/price");
    setPrice(result.data.data.price_pretty);
  };

  return (
    <div className="page-buy">
      {/* <Row type="flex" justify="center">
          <Col xs={24} md={12} lg={8}>
            <a
              href="https://app.dodoex.io/exchange/BUSD-0xdbeb98858f5d4dca13ea0272b2b786e9415d3992"
              target="_blank"
              className="buy-tab block"
            >
              <img src={tokenImg["ZETH"]} className="token-item" /> BUY ZETH ON
              DODO
            </a>
          </Col>
        </Row> */}

      <Row className="pool-list" type="flex" justify="center">
        <Col xs={24} md={12} lg={8}>
          <div className="pool-item block">
            <div className="info-line top-line">
              <span className="title">
                <span className="main-title">FIXED-WRAP</span> <br />
                $BUSD <br />
                <a target="_blank" href={`${scanUrl}/${buyContractAddress}`}>
                  {buyContractAddress.slice(0, 5)}...
                  {buyContractAddress.slice(-5)}
                </a>
              </span>
              <span className="deposit-by">
                <a target="_blank" href={`${scanUrl}/${buyContractAddress}`}>
                  <img src={zethLogo} className="token-item" /> ZETH
                </a>
              </span>
            </div>
            <div className="info-line">
              <span>FIXED WRAP RATIO:</span>
              <span>1 ZETH= {Number(price)} BUSD</span>
            </div>
            <div className="info-line amount-input-box">
              <span>AMOUNT:</span>
              <span className="amount-input-wrapper">
                <Input
                  className="amount-input"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setIsMax(false);
                  }}
                />{" "}
                ZETH
                <span
                  className="max"
                  onClick={() => {
                    doSetMax();
                  }}
                >
                  MAX
                </span>
              </span>
            </div>
            <Button onClick={doBuy} className="btn">
              SWAP &amp; LOCK IN 3 MONTHS {buying && "..."}
            </Button>
            <div className="progress">
              AUCTION PROGRESS:{" "}
              {(Number(totalSupply) - Number(available)).toFixed(4)} ZETH /{" "}
              {Number(totalSupply)} ZETH
            </div>
            {/* <div className="progress">Auction ends in 14 days</div> */}
            {/* <div className="progress">
                AUCTION ENDS:{" "}
                <Timer
                  initialTime={1616155200000 - new Date().getTime()}
                  direction="backward"
                >
                  <Timer.Days /> days <Timer.Hours />h <Timer.Minutes />m
                </Timer>
              </div> */}
            <div className="progress">TIP: one purchase per wallet</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

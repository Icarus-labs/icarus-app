import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button } from "antd";
import { useWallet } from "use-wallet";
import TokenSelect from "components/TokenSelect";
import { CaretDownOutlined, LoadingOutlined } from "@ant-design/icons";
import ActionButton from "components/ActionButton";
import { useSelector } from "react-redux";
import config from "config";
import ArrowDown from "assets/arrow-down.svg";
import PlusIcon from "assets/plus-icon.svg";
import CommonContractApi from "contract/CommonContractApi";
import RouterContractApi from "contract/RouterContractApi";
// import web3 from "components/web3";
// import mm from "components/mm";

import "./style.scss";

export default function TokenSwap() {
  const wallet = useWallet();
  const [tab, setTab] = useState("swap");
  const [fromToken, setFromToken] = useState({});
  const [fromAmount, setFromAmount] = useState("");
  const [toToken, setToToken] = useState({});
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);
  // const [routeText, setRouteText] = useState("");
  const [loadingResult, setLoadingResult] = useState(false);
  const [swaping, setSwaping] = useState(false);
  const [errHint, setErrHint] = useState();
  // const [contractName, setContractName] = useState({});
  // const [actionInfo, setActionInfo] = useState({});
  const [tokenSelectType, setTokenSelectType] = useState("");
  const network = useSelector((state) => state.setting.network);

  const routerContractAddress = config[network].contracts.router;

  // const [actionInfoTrigger, setActionInfoTrigger] = useState(1);

  const getToAmount = async () => {
    setLoadingResult(true);
    setToAmount("");
    setExchangeRate("");
    // const response = await RouterContractApi.getAmountsOut(
    //   fromAmount,
    //   fromToken,
    //   toToken,
    //   wallet
    // );

    const bestRoute = await RouterContractApi.getAmountsOut(
      fromAmount,
      fromToken.address,
      toToken.address,
      wallet
    );
    setLoadingResult(false);
    setToAmount(bestRoute.amountsOut);
    
    // setRouteText(response.routeText);
    // setToAmount(response.expectedConvertQuote);
  };

  useEffect(() => {
    if (fromAmount && toAmount) {
      setExchangeRate(toAmount / fromAmount);
    }
  }, [fromAmount, toAmount]);

  useEffect(() => {
    if (fromToken.address && toToken.address) {
      if (fromToken.address === toToken.address) {
        setErrHint("Please choose two different tokens");
      } else {
        setErrHint("");
      }
    }
  }, [fromToken.address, toToken.address]);

  useEffect(async () => {
    if (fromAmount && fromToken.address && toToken.address) {
      getToAmount();
    }
  }, [fromAmount, fromToken.address, toToken.address]);

  const onSelectToken = async (tokenSelectType, token) => {
    token.balance = await getTokenBalance(token);

    if (tokenSelectType === "from") {
      setFromToken(token);
    } else if (tokenSelectType === "to") {
      setToToken(token);
    }
  };

  const getTokenBalance = async (token) => {
    const tokenBalance = await CommonContractApi.balanceOf(
      token.address,
      wallet
    );
    return tokenBalance;
  };

  const changeTokenOrder = () => {
    const nextFromToken = toToken;
    const nextToToken = fromToken;
    setFromToken(nextFromToken);
    setToToken(nextToToken);
    setFromAmount(toAmount);
    setToAmount("");
  };

  // const doApprove = () => {
  //   const transactionParameters = {
  //     from: wallet.account,
  //     to: actionInfo.from_token_addr,
  //     data: actionInfo.allowance_data,
  //   };
  //   console.log(transactionParameters, "parammm");
  //   // do it
  //   mm.sendTransaction(transactionParameters, "Approve").then((res) => {
  //     // setActionInfoTrigger((prev) => prev + 1);
  //   });
  // };

  const doSwap = async () => {
    setSwaping(true);
    try {
      await RouterContractApi.swapExactTokensForTokens(
        fromAmount,
        fromToken,
        toToken,
        wallet
      );
      setSwaping(false);
    } catch (err) {
      setSwaping(false);
    }

    // const transactionParameters = {
    //   from: wallet.account,
    //   to: actionInfo.contract_addr,
    //   value: web3.utils.toHex(
    //     fromToken.symbol === "ETH" ? actionInfo.from_token_amount : 0
    //   ),
    //   data: actionInfo.data,
    // };
    // mm.sendTransaction(transactionParameters, "Swap").then((res) => {});
  };

  // useEffect(() => {
  //   if (fromToken.symbol && toToken.symbol && fromAmount) {
  //     setToAmount("");
  //     setExchangeRate("");
  //     setActionInfo({});
  //     // setContractName("");
  //     axios
  //       .post("/swap/aggrInfo", {
  //         from: fromToken.symbol,
  //         to: toToken.symbol,
  //         amount: fromAmount.toString(),
  //       })
  //       .then((res) => {
  //         if (res.data.exchange_pairs.length >= 1) {
  //           // const exchangePairs = res.data.exchange_pairs;
  //           // setToAmount(
  //           //   new BigNumber(exchangePairs[0].amount_out)
  //           //     .shiftedBy(-18)
  //           //     .toFixed(4)
  //           // );
  //           // setExchangeRate(
  //           //   new BigNumber(exchangePairs[0].exchange_ratio)
  //           //     .shiftedBy(-18)
  //           //     .toFixed(4)
  //           // );
  //           // setContractName(exchangePairs[0].contract_name);
  //         }
  //       });
  //   }
  // }, [fromToken.symbol, toToken.symbol, fromAmount]);

  // useEffect(() => {
  //   if (contractName) {
  //     axios
  //       .post("/swap/swapInfo", {
  //         contract: contractName,
  //         from: fromToken.symbol,
  //         to: toToken.symbol,
  //         amount: fromAmount.toString(),
  //         user: wallet.account,
  //         slippage: "500",
  //       })
  //       .then((res) => {
  //         setActionInfo(res.data);
  //       });
  //   }
  // }, [contractName, actionInfoTrigger]);

  return (
    <div className="token-swap">
      <Row type="flex" justify="center">
        <Col xs={24} lg={10}>
          <div className="swap-card block">
            <div className="tabs">
              <span
                onClick={() => setTab("swap")}
                className={`tab ${tab === "swap" ? "active" : ""}`}
              >
                Swap
              </span>
              <span
                onClick={() => setTab("liquidity")}
                className={`tab ${tab === "liquidity" ? "active" : ""}`}
              >
                +Liquidity
              </span>
            </div>
            <div className="token-box">
              <div className="top">
                <div className="title">From:</div>
                {fromToken.balance && (
                  <div>
                    <span className="balance-title">Balance:</span>{" "}
                    <span className="balance-num">{fromToken.balance}</span>
                  </div>
                )}
              </div>
              <div className="bottom">
                <div>
                  <Input
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                  />
                </div>
                <div>
                  <div
                    onClick={() => {
                      setFromAmount(fromToken.balance);
                    }}
                    className="max"
                  >
                    MAX
                  </div>
                  <div
                    className="token-select"
                    onClick={() => setTokenSelectType("from")}
                  >
                    {fromToken.symbol ? (
                      <>
                        <img className="token-logo" src={fromToken.logoURI} />{" "}
                        <span>{fromToken.symbol}</span>
                      </>
                    ) : (
                      <>Select Token</>
                    )}
                    <CaretDownOutlined className="caret" />
                  </div>
                </div>
              </div>
            </div>
            <img
              src={tab === "swap" ? ArrowDown : PlusIcon}
              className="arrow-down"
              onClick={changeTokenOrder}
            />
            <div className="token-box">
              <div className="top">
                <div className="title">To:</div>
                {toToken.balance && (
                  <div>
                    <span className="balance-title">Balance:</span>{" "}
                    <span className="balance-num">{toToken.balance}</span>
                  </div>
                )}
              </div>
              <div className="bottom">
                <div>
                  <Input placeholder="0.0" value={toAmount} />
                </div>
                <div>
                  <div
                    className="token-select"
                    onClick={() => setTokenSelectType("to")}
                  >
                    {toToken.symbol ? (
                      <>
                        <img className="token-logo" src={toToken.logoURI} />{" "}
                        <span>{toToken.symbol}</span>
                      </>
                    ) : (
                      <>Select Token</>
                    )}
                    <CaretDownOutlined className="caret" />
                  </div>
                </div>
              </div>
            </div>
            {loadingResult && <LoadingOutlined className="loading-result" />}
            {exchangeRate > 0 && (
              <>
                <div className="exchange-rate">
                  <span>Exchange Rate:</span>
                  <span>
                    1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
                  </span>
                </div>
                {/* <div className="exchange-rate">
                  <span>Route:</span>
                  <span>{routeText}</span>
                </div> */}
                {errHint && (
                  <div className="error-hint exchange-rate">{errHint}</div>
                )}
              </>
            )}
            {tab === "liquidity" && (
              <div>
                <div className="prices-pool-share-title">
                  Prices and pool share
                </div>
                <div className="prices-pool-share">
                  <div>
                    0.0497975
                    <br />
                    CAKE per BUSD
                  </div>
                  <div>
                    20.0813
                    <br />
                    BUSD per CAKE
                  </div>
                  <div>
                    &lt;0.01%
                    <br />
                    Share of Pool
                  </div>
                </div>
              </div>
            )}
            <div className="handle-area">
              <ActionButton
                tokenAddress={fromToken.address}
                contractAddress={routerContractAddress}
              >
                <Button
                  disabled={!fromToken.address}
                  onClick={doSwap}
                  className={`${
                    fromToken.address &&
                    toToken.address &&
                    fromAmount &&
                    !swaping
                      ? "btn-black"
                      : "btn-black-disabled"
                  }`}
                >
                  Swap{" "}
                  {swaping && <LoadingOutlined className="swaping-loading" />}
                </Button>
              </ActionButton>
            </div>
            {/* <div className="advanced-trigger">
              Advanced Setting <CaretDownOutlined className="caret" />
            </div> */}
          </div>
        </Col>
      </Row>
      <TokenSelect
        onSelect={onSelectToken}
        onCancel={() => setTokenSelectType("")}
        tokenSelectType={tokenSelectType}
      />
    </div>
  );
}

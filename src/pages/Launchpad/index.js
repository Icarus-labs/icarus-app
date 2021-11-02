import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button } from "antd";
import { useWallet } from "use-wallet";
import { useSelector } from "react-redux";
import graph from "utils/graph";
import ActionButton from "components/ActionButton";
import StakerContractApi from "contract/StakerContractApi";
import CommonContractApi from "contract/CommonContractApi";
import LaunchpadLogo from "assets/launchpad-logo.svg";
import config from "config";
import IcaIcon from "assets/tokens/ica.svg";
import TimerIcon from "assets/timer.svg";
import CapsuleCard from "components/CapsuleCard";
import RocketCard from "components/RocketCard";
import BN from "bignumber.js";
import "./style.scss";

BN.config({
  ROUNDING_MODE: 1,
});

export default function Launchpad() {
  const wallet = useWallet();
  const [amount, setAmount] = useState("100");
  const [maxAmount, setMaxAmount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [getBoxAmount, setGetBoxAmount] = useState(0);
  const [blindboxList, setBlindboxList] = useState([]);
  const network = useSelector((state) => state.setting.network);

  const tokenAddress = config[network].contracts.vICA;
  const stakerContractAddress = config[network].contracts.staker;

  const doStake = async () => {
    await StakerContractApi.lock(amount, wallet);
    console.log("finished stake");
    getBlindBox(wallet.account);
  };

  const getBlindBox = async (owner) => {
    const result = await graph.getBlindBox(owner);
    setBlindboxList(result);
  };

  const getIcaBalance = async () => {
    const result = await CommonContractApi.balanceOf(
      config[network].contracts.vICA,
      wallet
    );
    setBalance(result);
  };

  const amountChange = (e) => {
    const newVal = e.target.value;
    setAmount(newVal);

    // if (new BN(newVal).isGreaterThan(maxAmount)) {
    //   setAmount(maxAmount.toString());
    // } else {
    //   setAmount(e.target.value);
    // }
  };

  useEffect(async () => {
    if (amount && wallet.account) {
      const reserves = await CommonContractApi.getBoxPrice(wallet);
      if (config.defaultNetwork === "test") {
        const maxAmount = new BN(20)
          .shiftedBy(18)
          .times(100)
          .times(reserves[1])
          .div(reserves[0])
          .integerValue(BN.ROUND_FLOOR)
          .shiftedBy(-18)
          .plus(1);
        setMaxAmount(maxAmount);

        setGetBoxAmount(
          new BN(amount)
            .shiftedBy(18)
            .times(reserves[0])
            .div(reserves[1])
            .integerValue(BN.ROUND_FLOOR)
            .div(100)
            .integerValue(BN.ROUND_FLOOR)
            .shiftedBy(-18)
            .integerValue(BN.ROUND_FLOOR)
            .toString()
        );
      } else {
        const maxAmount = new BN(20)
          .shiftedBy(18)
          .times(100)
          .times(reserves[0])
          .div(reserves[1])
          .integerValue(BN.ROUND_FLOOR)
          .shiftedBy(-18)
          .plus(1);
        setMaxAmount(maxAmount);

        setGetBoxAmount(
          new BN(amount)
            .shiftedBy(18)
            .times(reserves[1])
            .div(reserves[0])
            .integerValue(BN.ROUND_FLOOR)
            .div(100)
            .integerValue(BN.ROUND_FLOOR)
            .shiftedBy(-18)
            .integerValue(BN.ROUND_FLOOR)
            .toString()
        );
      }
    } else {
      setGetBoxAmount(0);
    }
  }, [amount, wallet]);

  useEffect(() => {
    if (wallet.account) {
      getIcaBalance();
      getBlindBox(wallet.account);
    }
  }, [wallet]);

  return (
    <div className="page-launchpad">
      <img src={LaunchpadLogo} className="launchpad-logo" />
      <Row gutter={28}>
        <Col xs={24} lg={10}>
          <RocketCard>
            <p>
              <span className="hightlight">
                Each capsule contains 1 random generated NFT
              </span>{" "}
              that unlocks the gamefi applications and play to earn gameplay.
            </p>
            <p>
              Each character holds a power level according to their rarity and
              you can customize it to obtain even better stats and special
              effects!
            </p>
            <p>
              You can only obtain these capsules by staking vICA with a lock
              period of 30 days (100$ worth of $ICA = 1 NFT)
            </p>
          </RocketCard>
        </Col>
        <Col xs={24} lg={14}>
          <div className="table-box">
            <div className="action-area">
              <div className="capsule-timer">
                Capsule Timer <img src={TimerIcon} className="timer-icon" />
              </div>
              <div className="stake-ica">
                <div>
                  <img src={IcaIcon} className="ica-icon" />
                  <div className="title">
                    STAKE <span className="lower">v</span>ICA
                  </div>
                </div>
                <div>
                  <span className="amount-input-wrapper">
                    <Input
                      value={amount}
                      placeholder="0"
                      onChange={amountChange}
                    />
                    <span
                      className="max"
                      onClick={() => {
                        amountChange({ target: { value: balance } });
                      }}
                    >
                      MAX
                    </span>
                  </span>
                  <div className="will-get">You will get: {getBoxAmount}</div>
                  <ActionButton
                    tokenAddress={tokenAddress}
                    contractAddress={stakerContractAddress}
                  >
                    <Button className="btn btn-green" onClick={doStake}>
                      Stake
                    </Button>
                  </ActionButton>
                </div>
              </div>
            </div>
            <CapsuleCard
              mode="claim"
              list={blindboxList}
              onRefresh={getBlindBox}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

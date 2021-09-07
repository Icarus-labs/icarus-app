import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button } from "antd";
import { useWallet } from "use-wallet";
import { useSelector } from "react-redux";
import graph from 'utils/graph'
import ActionButton from "components/ActionButton";
import StakerContractApi from "contract/StakerContractApi";
import CommonContractApi from "contract/CommonContractApi";
import LaunchpadLogo from "assets/launchpad-logo.svg";
import config from "config";
import IcaIcon from "assets/tokens/ica.svg";
import TimerIcon from "assets/timer.svg";
import CapsuleCard from "components/CapsuleCard";
import RocketCard from "components/RocketCard";

import "./style.scss";

export default function Launchpad() {
  const wallet = useWallet();
  const [amount, setAmount] = useState("100");
  const [balance, setBalance] = useState("0");
  const [blindboxList, setBlindboxList] = useState([])
  const network = useSelector((state) => state.setting.network);

  const tokenAddress = config[network].contracts.vica;
  const stakerContractAddress = config[network].contracts.staker;

  const doStake = async () => {
    await StakerContractApi.lock(amount, wallet);
    console.log('finished stake')
    getBlindBox()
  };

  const getBlindBox = async (owner) => {
    const result = await graph.getBlindBox(owner)
    setBlindboxList(result)
  };

  const getIcaBalance = async () => {
    const result = await CommonContractApi.balanceOf(
      config[network].contracts.vica,
      wallet
    );
    setBalance(result);
  };

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
            EACH CAPSULE CONTAINS 1 RANDOM GENERATED NFT THAT UNLOCKS THE GAMEFI APPLICATIONS AND USERS CAN PARTICIPATE INTO ICA PLAY-TO-EARN ECONOMY.
            </p>
            <p>
              Each character holds a power level according to their rarity and
              you can customize it to obtain even better stats and special
              effects!
            </p>
            <p>
              You can only obtain these capsules by staking $ICA with a lock
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
                  <div className="title">STAKE $ICA</div>
                </div>
                <div>
                  <span className="amount-input-wrapper">
                    <Input
                      value={amount}
                      placeholder="0"
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                    <span
                      className="max"
                      onClick={() => {
                        setAmount(balance);
                      }}
                    >
                      MAX
                    </span>
                  </span>
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
            <CapsuleCard mode="claim" list={blindboxList} onRefresh={getBlindBox} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

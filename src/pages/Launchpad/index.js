import React, { useState } from "react";
import { Row, Col, Input, Button } from "antd";
import LaunchpadLogo from "assets/launchpad-logo.svg";

import IcaIcon from "assets/tokens/ica.svg";
import TimerIcon from "assets/timer.svg";
import CapsuleCard from "components/CapsuleCard";
import RocketCard from "components/RocketCard";

import "./style.scss";

export default function Launchpad() {
  const [amount, setAmount] = useState("");

  return (
    <div className="page-launchpad">
      <img src={LaunchpadLogo} className="launchpad-logo" />
      <Row gutter={28}>
        <Col lg={10}>
          <RocketCard>
            <p>
              Each capsule contains 1 random generated NFT that unlocks the
              gamefi applications and play to earn gameplay.
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
        <Col lg={14}>
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
                        alert("max");
                      }}
                    >
                      MAX
                    </span>
                  </span>
                  <Button className="btn btn-green">Stake</Button>
                </div>
              </div>
            </div>
            <CapsuleCard />
          </div>
        </Col>
      </Row>
    </div>
  );
}

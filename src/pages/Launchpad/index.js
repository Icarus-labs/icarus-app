import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button, Switch } from "antd";
import LaunchpadLogo from "assets/launchpad-logo.svg";
import LaunchpadRocket from "assets/launchpad-rocket.png";
import IdeaIcon from "assets/idea.svg";
import IcaIcon from "assets/tokens/ica.svg";
import TimerIcon from "assets/timer.svg";
import TimeIcon from "assets/launchpad/time.svg";
import DateIcon from "assets/launchpad/date.svg";

import "./style.scss";

export default function Launchpad() {
  const [amount, setAmount] = useState("");
  const [showActive, setShowActive] = useState(true);
  // useEffect(() => {
  //   document.querySelector(".main-content").className =
  //     "main-content profile-bg";
  //   const ele = document.createElement("img");
  //   ele.setAttribute("src", "/profile-pc.svg");
  //   ele.setAttribute("class", "/profile-img");
  //   document.querySelector(".main-content").append(ele);
  //   return () => {
  //     document.querySelector(".main-content").removeChild(ele);
  //     document.querySelector(".main-content").className = "main-content";
  //   };
  // }, []);

  return (
    <div className="page-launchpad">
      <img src={LaunchpadLogo} className="launchpad-logo" />
      <Row gutter={28}>
        <Col lg={10}>
          <div className="info-box">
            <img src={LaunchpadRocket} className="launchpad-rocket" />
            <div>
              <img src={IdeaIcon} />
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
            </div>
          </div>
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

            <div className="selection">
              <div>
                ONLY READY
                <Switch />
              </div>
              <div className="block-switch">
                <div
                  onClick={() => setShowActive(true)}
                  className={`${showActive ? "active" : ""}`}
                >
                  Active
                </div>
                <div
                  onClick={() => setShowActive(false)}
                  className={`${!showActive ? "active" : ""}`}
                >
                  Inactive
                </div>
              </div>
            </div>
            <div className="entry-item">
              <div>1ST ENTRY</div>
              <div>
                <Button className="btn-green">CLAIM</Button>
              </div>
              <div>
                <img src={LaunchpadRocket} className="rocket" />
              </div>
            </div>
            <div className="entry-item">
              <div>2RD ENTRY</div>
              <div className="time-wrapper">
                <div className="time-block">
                  <img src={TimeIcon} className="icon" />
                  TIMELOCK:
                  <span>719H:59M:59S</span>
                </div>
                <div className="time-block time-block-end">
                  <img src={DateIcon} className="icon" />
                  END:
                  <span>30/08/2021</span>
                </div>
              </div>
              <div>
                <img src={LaunchpadRocket} className="rocket" />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

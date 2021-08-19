import React, { useState } from "react";
import { Switch, Button } from "antd";
import TimeIcon from "assets/launchpad/time.svg";
import DateIcon from "assets/launchpad/date.svg";
import LaunchpadRocket from "assets/launchpad-rocket.png";
import "./style.scss";

export default function CapsuleCard(props) {
  const { showTitle } = props;
  const [showActive, setShowActive] = useState(true);

  return (
    <div className="capsule-card">
      <div className="selection">
        <div>
          {showTitle && (
            <div className="title">
              YOUR <br />
              CAPSULES
            </div>
          )}
        </div>
        <div className="selection-right">
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
  );
}

import React, { useState } from "react";
import { Switch, Button } from "antd";
import StakerContractApi from "contract/StakerContractApi";
import HolderContractApi from "contract/HolderContractApi";
import { useWallet } from "use-wallet";
import Countdown from "react-countdown";
import { numberSuffix } from "utils/Tools";
import TimeIcon from "assets/launchpad/time.svg";
import DateIcon from "assets/launchpad/date.svg";
import LaunchpadRocket from "assets/launchpad-rocket.png";
import "./style.scss";

export default function CapsuleCard(props) {
  const { showTitle, mode, list } = props;
  const [showActive, setShowActive] = useState(true);
  const wallet = useWallet();

  const doClaim = async (index) => {
    await HolderContractApi.claim(index, wallet);
  };

  const doOpen = async () => {
    await HolderContractApi.open(wallet);
  };

  const doRedeem = async () => {
    await StakerContractApi.redeem(wallet);
  };

  const timer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Time reached</span>;
    } else {
      return (
        <span>
          {hours}H:{minutes}M:{seconds}S{" "}
        </span>
      );
    }
  };

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
      <div className="entry-list">
        {list.map((item, index) => (
          <div className="entry-item" key={item.id}>
            <div>{numberSuffix(index + 1)} ENTRY</div>
            {item.endtime > new Date().valueOf() ? (
              <div className="time-wrapper">
                <div className="time-block">
                  <img src={TimeIcon} className="icon" />
                  TIMELOCK:
                  <span>
                    <Countdown date={item.endtime} renderer={timer} />
                  </span>
                </div>
                <div className="time-block time-block-end">
                  <img src={DateIcon} className="icon" />
                  END:
                  <span>30/08/2021</span>
                </div>
              </div>
            ) : (
              <div>
                {mode === "claim" && (
                  <>
                    <Button
                      className="btn-green"
                      onClick={() => doClaim(index)}
                    >
                      CLAIM
                    </Button>
                    <Button className="btn-green" onClick={doRedeem}>
                      UNSTAKE
                    </Button>
                  </>
                )}
                {mode === "open" && (
                  <Button className="btn-green" onClick={doOpen}>
                    OPEN
                  </Button>
                )}
              </div>
            )}
            <div>
              <img src={LaunchpadRocket} className="rocket" />
            </div>
          </div>
        ))}
        {/* <div className="entry-item">
        <div>1ST ENTRY</div>
        <div>
          {mode === "claim" && (
            <>
              <Button className="btn-green" onClick={() => doClaim(1)}>
                CLAIM
              </Button>
              <Button className="btn-green" onClick={doRedeem}>
                UNSTAKE
              </Button>
            </>
          )}
          {mode === "open" && (
            <Button className="btn-green" onClick={doOpen}>
              OPEN
            </Button>
          )}
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
      </div> */}
      </div>
    </div>
  );
}

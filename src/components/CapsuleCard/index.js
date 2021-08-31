import React, { useState, useEffect } from "react";
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
  const { showTitle, mode, list, onRefresh } = props;
  const [showActive, setShowActive] = useState(true);
  const [showReady, setShowReady] = useState(false);
  const [capsuleList, setCapsuleList] = useState([]);
  const wallet = useWallet();

  const doClaim = async (boxId) => {
    await HolderContractApi.claim(boxId, wallet);
    onRefresh();
  };

  const doOpen = async (boxId) => {
    await HolderContractApi.open(boxId, wallet);
    onRefresh();
  };

  const doRedeem = async () => {
    await StakerContractApi.redeem(wallet);
    onRefresh();
  };

  const ActionWrapper = (props) => {
    const { item } = props;
    return (
      <div>
        {mode === "claim" && item.state === 0 && (
          <>
            <Button className="btn-green" onClick={() => doClaim(item.id)}>
              CLAIM
            </Button>
            <Button className="btn-green" onClick={doRedeem}>
              UNSTAKE
            </Button>
          </>
        )}
        {mode === "open" && item.state === 1 && (
          <Button className="btn-green" onClick={() => doOpen(item.id)}>
            OPEN
          </Button>
        )}
      </div>
    );
  };

  const TimeWrapper = (props) => {
    const { item, hours, minutes, seconds } = props;
    return (
      <div className="time-wrapper">
        <div className="time-block">
          <img src={TimeIcon} className="icon" />
          TIMELOCK:
          <span>
            {hours}H:{minutes}M:{seconds}S{" "}
          </span>
        </div>
        <div className="time-block time-block-end">
          <img src={DateIcon} className="icon" />
          END:
          <span>{new Date(item.endAt).toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  const timer = ({ hours, minutes, seconds, completed, props }) => {
    const { item } = props;
    if (completed) {
      return <ActionWrapper item={item} />;
    } else {
      return (
        <TimeWrapper
          item={item}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
  };

  useEffect(() => {
    if (mode === "claim") {
      setCapsuleList(
        showActive
          ? list.filter((item) => item.state === 0)
          : list.filter((item) => item.state === 1)
      );
    } else if (mode === "open") {
      setCapsuleList(
        showActive
          ? list.filter((item) => item.state === 1)
          : list.filter((item) => item.state === 2)
      );
    }
  }, [list, mode, showActive]);

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
          {mode === "claim" && (
            <div>
              ONLY READY
              <Switch
                checked={showReady}
                onChange={(val) => {
                  console.log(val);
                  setShowReady(val);
                }}
              />
            </div>
          )}

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
      <div className="entry-list scrollbar">
        {capsuleList.length > 0 ? (
          capsuleList.map((item, index) => (
            <div
              className={`entry-item ${
                showReady && item.endAt > new Date().valueOf() ? "hidden" : ""
              }`}
              key={item.id}
            >
              <div>{numberSuffix(index + 1)} ENTRY</div>
              <div>
                <Countdown date={item.endAt} renderer={timer} item={item} />
              </div>
              <div className="capsule-wrapper">
                <img src={LaunchpadRocket} className="rocket" />
                {item.capsule && (
                  <div className="capsule-num">{item.capsule} CAPSULE</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-entries">No entries yet.</div>
        )}
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

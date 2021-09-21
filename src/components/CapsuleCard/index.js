import React, { useState, useEffect } from "react";
import { subscribe } from "@nextcloud/event-bus";
import { Switch, Button } from "antd";
import StakerContractApi from "contract/StakerContractApi";
import HolderContractApi from "contract/HolderContractApi";
import { useWallet } from "use-wallet";
import Countdown from "react-countdown";
import { numberSuffix } from "utils/Tools";
import TimeIcon from "assets/launchpad/time.svg";
import DateIcon from "assets/launchpad/date.svg";
import NftGiftModal from "components/NftGiftModal";
import ClaimedModal from "components/ClaimedModal";
import LaunchpadRocket from "assets/launchpad-rocket.png";
import ICALogo from "assets/tokens/ica.svg";
import "./style.scss";

export default function CapsuleCard(props) {
  const { showTitle, mode, list, onRefresh } = props;
  const [showActive, setShowActive] = useState(true);
  const [showReady, setShowReady] = useState(false);
  const [nftGiftModalVisible, setNftGiftModalVisible] = useState(false);
  const [claimedModalVisible, setClaimedModalVisible] = useState(false);

  const [userLockedAmount, setUserLockedAmount] = useState(0);

  const [nftGiftList, setNftGiftList] = useState([]);
  const [capsuleList, setCapsuleList] = useState([]);
  const wallet = useWallet();

  const doClaim = async (boxId) => {
    await HolderContractApi.claim(boxId, wallet);
    setClaimedModalVisible(true);
    onRefresh();
  };

  const doOpen = async (boxId, capsuleNum) => {
    const txId = await HolderContractApi.open(boxId, wallet);

    setNftGiftList(new Array(capsuleNum).fill({}));

    subscribe(txId, (val) => {
      if (!val.tokenId) {
        return;
      }
      setNftGiftList((prev) => {
        prev.unshift(val);
        prev.pop();
        return prev;
      });
    });

    setNftGiftModalVisible(true);
    onRefresh();
  };

  // useEffect(() => {
  //   setNftGiftList(new Array(4).fill({}));
  //   setNftGiftModalVisible(true);
  // }, []);
  const getUserLockedAmount = async (wallet) => {
    const lockedAmount = await StakerContractApi.balanceOf(wallet);
    setUserLockedAmount(lockedAmount);
  };

  useEffect(() => {
    if (wallet.account) {
      getUserLockedAmount(wallet);
    }
  }, [wallet.account, list]);

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
          </>
        )}

        {mode === "open" && item.state === 1 && (
          <Button
            className="btn-green"
            onClick={() => doOpen(item.id, item.capsule)}
          >
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

  useEffect(async () => {
    if (!list || list.length === 0) {
      return;
    }
    list.forEach((item) => {
      item.stakedPretty = (Number(item.staked) / Math.pow(10, 18)).toFixed(4);
    });
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

  const toggleDetail = (index) => {
    setCapsuleList((prev) => {
      prev[index].showDetail = !prev[index].showDetail;
      return [...prev];
    });
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

          {mode === "claim" && !showActive && userLockedAmount > 0 && (
            <Button
              className="btn-green"
              style={{ marginLeft: "8px" }}
              onClick={doRedeem}
            >
              UNSTAKE ALL
            </Button>
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
              <div>
                <div>{numberSuffix(index + 1)} ENTRY</div>
                <div className="details" onClick={() => toggleDetail(index)}>
                  DETAILS {item.showDetail ? "⋀" : "⋁"}
                </div>
              </div>
              <div>
                <Countdown date={item.endAt} renderer={timer} item={item} />
                {item.showDetail && (
                  <div className="show-more">
                    <div>
                      <img src={ICALogo} className="ica-logo" /> STAKED:{" "}
                      {item.stakedPretty} &nbsp;&nbsp;&nbsp;&nbsp; TVL:{" "}
                      ${item.value}
                    </div>
                  </div>
                )}
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
      </div>
      {nftGiftModalVisible && (
        <NftGiftModal
          onCancel={() => setNftGiftModalVisible(false)}
          gifts={nftGiftList}
        />
      )}
      {claimedModalVisible && (
        <ClaimedModal onCancel={() => setClaimedModalVisible(false)} />
      )}
    </div>
  );
}

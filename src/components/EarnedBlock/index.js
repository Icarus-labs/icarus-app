import React from "react";
import tokenImg from "config/tokenImg";
import "./style.scss";

export default function EarnedBlock(props) {
  const { poolInfo } = props;
  return (
    <div className="earned-block">
      <div className="title">EARNED:</div>

      {poolInfo.reward_tokens &&
        poolInfo.reward_tokens.map((reward, index) => (
          <div className="token-circle" key={index}>
            <span className="tokens">
              <img
                src={tokenImg[String(reward).toUpperCase()]}
                className="token-item"
              />
            </span>
            <div>
              <div className="value">
                {poolInfo.type === "reward3rd" || reward === "ICA"
                  ? `${poolInfo.earnedICA || 0}`
                  : `${poolInfo.earned || 0}`}
              </div>
              <div className="deposited">{reward}</div>
            </div>
          </div>
        ))}
    </div>
  );
}

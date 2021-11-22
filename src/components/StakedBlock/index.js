import React from "react";
import tokenImg from "config/tokenImg";
import "./style.scss";

export default function StakedBlock(props) {
  const { poolInfo, item } = props;
  return (
    <div className="staked-block">
      <div className="title">STAKED:</div>
      <div className="token-circle">
        <span className="tokens">
          {poolInfo.type === "reward3rd" ? (
            <img
              src={tokenImg[String(poolInfo.reward_tokens[0]).toUpperCase()]}
              className="token-item"
            />
          ) : (
            <span>
              {item.stake_token.split("-").map((token) => (
                <img src={tokenImg[token]} className="token-item" />
              ))}
            </span>
          )}
        </span>
        <div>
          <div className="value">
            {poolInfo.staked ? Number(poolInfo.staked) : 0}
          </div>
          <div className="deposited">{item.stake_token}</div>
        </div>
      </div>
    </div>
  );
}

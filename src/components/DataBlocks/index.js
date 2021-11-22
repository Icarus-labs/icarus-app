import React from "react";
import { Tooltip } from "antd";
import { toThousands } from "utils/Tools";
import "./style.scss";

export default function DataBlocks(props) {
  const { poolInfo, item, isLine } = props;
  return (
    <div className={`data-blocks ${isLine}`}>
      <div className="data-block highlight">
        <div className="title">TVL:</div>
        <div className="value">
          $
          {poolInfo.type === "reward3rd"
            ? poolInfo.starStakedInUsd
              ? toThousands(poolInfo.starStakedInUsd)
              : 0
            : poolInfo.stakedInUsd
            ? toThousands(poolInfo.stakedInUsd)
            : 0}
        </div>
      </div>
      <div className="data-block">
        <div className="title">APR:</div>
        <div className="value">
          {poolInfo.type === "reward3rd" ? (
            <Tooltip title={`${item.reward_tokens[0]} APR: ${item.apy || 0}%`}>
              <span>{item.apy || 0}% </span>
            </Tooltip>
          ) : (
            <Tooltip
              title={`${
                item.reward_apy ? "ICA APR: " + item.reward_apy + "%" : ""
              } ${
                item.income_apy
                  ? ` | ${
                      item.reward_tokens.indexOf("BTCB") > -1 ? "BTCB" : "ETH"
                    } APR: ` +
                    item.income_apy +
                    "%"
                  : ""
              }`}
            >
              <span>{item.apy || 0}% </span>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="data-block">
        <div className="title">EARN:</div>
        <div className="value">
          {item.reward_tokens.map((token, index) => (
            <span key={index}>
              <span>{token}</span>{" "}
              {index !== item.reward_tokens.length - 1 ? "+" : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

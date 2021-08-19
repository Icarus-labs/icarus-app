import React from "react";
import "./style.scss";

export default function NftCard(props) {
  const { info } = props;
  return (
    <div className="card-item">
      <div className="name">{info.name}</div>
      <img src={`/cards/${info.card}.png`} className="card" />
      <div className="drop-rate">DROP RATE: {info.dropRate}%</div>
    </div>
  );
}

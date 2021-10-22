import React from "react";
import "./style.scss";

export default function NftCard(props) {
  const { item } = props;
  return (
    <div className="card-item">
      <div className="name">{item.name}</div>
      {item.contentURI ? (
        <video src={item.contentURI} autoPlay muted loop className="card" />
      ) : (
        <img src={`/cards/${item.card}.png`} className="card" />
      )}
      <div className="drop-rate">DROP RATE: {item.dropRate}%</div>
    </div>
  );
}

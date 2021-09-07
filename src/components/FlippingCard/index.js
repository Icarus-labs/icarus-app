import React from "react";
import "./style.scss";

export default function FlippingCard() {
  return (
    <div className="flipping-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src="/cards/normal.png" alt="Avatar" className="flip-img" />
        </div>
        <div className="flip-card-back">
          <img src="/cards/normal.png" alt="Avatar" className="flip-img" />
        </div>
      </div>
    </div>
  );
}

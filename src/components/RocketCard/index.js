import React from "react";
import IdeaIcon from "assets/idea.svg";
import LaunchpadRocket from "assets/launchpad-rocket.png";
import "./style.scss";

export default function RocketCard(props) {
  const { shortText } = props;
  return (
    <div className={`rocket-card ${shortText ? 'short-text' : ''}`}>
      <img src={LaunchpadRocket} className="launchpad-rocket" />
      <div>
        <p>
          <img src={IdeaIcon} />
        </p>
        {props.children}
      </div>
    </div>
  );
}

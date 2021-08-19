import React from "react";
import IdeaIcon from "assets/idea.svg";
import LaunchpadRocket from "assets/launchpad-rocket.png";
import "./style.scss";

export default function RocketCard(props) {
  console.log(props.children);
  return (
    <div className="rocket-card">
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

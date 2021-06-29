import React, { useEffect } from "react";

import "./style.scss";

export default function Profile() {
  useEffect(() => {
    document.querySelector(".main-content").className =
      "main-content profile-bg";
    const ele = document.createElement("img");
    ele.setAttribute("src", "/profile-pc.svg");
    ele.setAttribute("class", "/profile-img");
    document.querySelector(".main-content").append(ele);
    return () => {
      document.querySelector(".main-content").removeChild(ele);
      document.querySelector(".main-content").className = "main-content";
    };
  }, []);

  return <div className="page-profile"></div>;
}

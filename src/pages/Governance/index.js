import React from "react";
import { Row, Col, Button } from "antd";
import poolList from "config/poolList";
import { Link } from "react-router-dom";
import zethLogo from "assets/tokens/zeth.svg";

import "./style.scss";

export default function Governance() {
  return (
    <div className="page-governance">
      <div className="governance-box"></div>
    </div>
  );
}

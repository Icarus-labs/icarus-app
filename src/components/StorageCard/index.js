import React from "react";
import { Button, Row, Col } from "antd";

import "./style.scss";

export default function StorageCard(props) {
  const { item } = props;

  return (
    <div className="storage-card">
      <div className="name">{item.name}</div>
      <div className="avatar">
        <img src={`/storages/${item.src}.png`} />
        <div className="level">
          LEVEL: <span className="num">{item.level}</span>
        </div>
      </div>
      <div className="action">
        <Button className="btn-green">EQUIP</Button>
        <div className="action-btns">
          <Row gutter={5}>
            <Col lg={12}>
              <Button className="btn-green-line">UPGRADE</Button>
            </Col>
            <Col lg={12}>
              <Button className="btn-green-line">TRADE</Button>
            </Col>
          </Row>
        </div>
      </div>
      <div className="quantity">
        QUANTITY: <span className="num">{item.quantity}</span>
      </div>
    </div>
  );
}

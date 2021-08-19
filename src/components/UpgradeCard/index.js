import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import LeftIcon from "assets/profile/left.svg";
import RightIcon from "assets/profile/right.svg";

import "./style.scss";

export default function UpgradeCard(props) {
  const { list, name } = props;
  const [currentSelected, setCurrentSelected] = useState(0);
  const currentItem = list[currentSelected];

  const goLeft = () => {
    if (currentSelected === 0) {
      setCurrentSelected(list.length - 1);
    } else {
      setCurrentSelected((prev) => prev - 1);
    }
  };

  const goRight = () => {
    if (currentSelected === list.length - 1) {
      setCurrentSelected(0);
    } else {
      setCurrentSelected((prev) => prev + 1);
    }
  };

  return (
    <div className="upgrade-card">
      <div className="show-board">
        <img src={LeftIcon} className="left-icon" onClick={goLeft} />
        <img src={RightIcon} className="right-icon" onClick={goRight} />
        <img src={`/upgrades/${currentItem.src}.png`} />
        <div dangerouslySetInnerHTML={{ __html: currentItem.desc }}></div>
      </div>
      <div className="choose-board">
        <div className="name">{name}</div>
        <div className="choose-list">
          <Row gutter={32}>
            {list.map((item, index) => (
              <Col lg={8} key={item.name}>
                <div className="choose-item">
                  <div className="name">{item.name}</div>
                  <div className="avatar">
                    <img src={`/upgrades/${item.src}.png`} />
                  </div>
                  <div className="quantity">
                    QUANTITY: <span className="num">{item.quantity}</span>
                  </div>
                  <div className="actions">
                    <Button
                      className="btn-green"
                      onClick={() => setCurrentSelected(index)}
                    >
                      USE
                    </Button>
                    <Button className="btn-green-line">UPGRADE</Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}

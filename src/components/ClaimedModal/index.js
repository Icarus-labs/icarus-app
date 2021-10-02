import React, {useEffect, useState} from "react";
import { Modal, Button } from "antd";
import { Link } from "react-router-dom";
import RocketImg from "assets/launchpad-rocket.png";
import "./style.scss";

export default function ClaimedModal(props) {
  const { onCancel } = props;
 

  return (
    <Modal
      footer={null}
      visible={true}
      centered={true}
      width={380}
      wrapClassName="claimed-modal"
      // maskClosable={false}
      onCancel={() => {
        onCancel();
      }}
    >
      <img src={RocketImg} className="rocket" />
      <Link to={{ pathname: "/profile", hash: "#capsule" }}>
        <Button className="btn-green">OPEN YOUR CAPSULE</Button>
      </Link>
    </Modal>
  );
}

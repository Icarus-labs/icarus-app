import React from "react";
import { Modal } from "antd";
import "./style.scss";

export default function NftGiftModal(props) {
  const { onCancel, gifts } = props;

  console.log("gifts are", gifts);

  return (
    <Modal
      footer={null}
      visible={true}
      width={320}
      wrapClassName="nft-gift-modal"
      maskClosable={false}
      onCancel={() => {
        onCancel();
      }}
    >
      <img src="/cards/samos.png" />
    </Modal>
  );
}

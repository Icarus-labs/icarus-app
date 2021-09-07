import React from "react";
import { Modal } from "antd";
import FlippingCard from "components/FlippingCard";
import "./style.scss";

export default function NftGiftModal(props) {
  const { onCancel, gifts } = props;

  console.log("gifts are", gifts);

  return (
    <Modal
      footer={null}
      visible={true}
      width={"70%"}
      wrapClassName="nft-gift-modal"
      maskClosable={false}
      onCancel={() => {
        onCancel();
      }}
    >
      {gifts.map((item) =>
        item.tokenId ? <img src={`/cards/samos.png`} /> : <FlippingCard />
      )}
    </Modal>
  );
}

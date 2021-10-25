import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import FlippingCard from "components/FlippingCard";
// import graph from "utils/graph";
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
        item.animation_url ? (
          <video src={item.animation_url} autoPlay muted loop className="card" />
        ) : (
          <FlippingCard />
        )
      )}
    </Modal>
  );
}

import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import FlippingCard from "components/FlippingCard";
import graph from "utils/graph";
import "./style.scss";

export default function NftGiftModal(props) {
  const { onCancel, gifts } = props;

  console.log("gifts are", gifts);

  const [giftList, setGiftList] = useState(gifts);

  useEffect(async () => {
    if (!gifts || gifts.length === 0 || !gifts[0].tokenId) {
      return;
    }
    const result = gifts;
    for (let i = 0; i < gifts.length; i++) {
      try {
        let externalInfo = await graph.getContentURI(result[i].tokenId);
        if (!externalInfo) {
          continue;
        }
        console.log("EXTERNAL", externalInfo);
        externalInfo.dropRate = externalInfo.attributes[0].drop_rate;
        externalInfo.contentURI = externalInfo.animation_url;
        result[i] = {
          ...result[i],
          ...externalInfo,
        };
      } catch (err) {
        console.log(err);
      }
    }
    setGiftList(result);
    console.log("handled", gifts);
  }, [gifts]);

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
      {giftList.map((item) =>
        item.contentURI ? (
          <video src={item.contentURI} autoPlay muted loop className="card" />
        ) : (
          <FlippingCard />
        )
      )}
    </Modal>
  );
}

import React, { useEffect } from "react";
import { Row, Col } from "antd";
import Banner from "assets/profile/banner.png";
import MineIcon from "assets/profile/mine-icon.svg";
import NftCollectionTitle from "assets/profile/titles/nft-collection.svg";
import CapsuleTitle from "assets/profile/titles/capsule.svg";
import ItemsTitle from "assets/profile/titles/items.svg";
import NftCard from "components/NftCard";
import CapsuleCard from "components/CapsuleCard";
import RocketCard from "components/RocketCard";
import "./style.scss";

export default function Profile() {
  const nftCollectionList = [
    {
      id: 1,
      name: "SAMOS",
      dropRate: 23,
      card: "normal",
    },
    // {
    //   id: 2,
    //   name: "?????",
    //   dropRate: 23,
    //   card: "normal",
    // },
    // {
    //   id: 3,
    //   name: "?????",
    //   dropRate: 13.8,
    //   card: "normal",
    // },
    {
      id: 4,
      name: "?????",
      dropRate: 13.8,
      card: "normal",
    },
    {
      id: 5,
      name: "?????",
      dropRate: 7.66,
      card: "green",
    },
    {
      id: 6,
      name: "?????",
      dropRate: 7.66,
      card: "green",
    },
    {
      id: 7,
      name: "?????",
      dropRate: 7.66,
      card: "blue",
    },
    {
      id: 8,
      name: "?????",
      dropRate: 4.6,
      card: "blue",
    },
    {
      id: 9,
      name: "?????",
      dropRate: 3.68,
      card: "purple",
    },
    {
      id: 10,
      name: "?????",
      dropRate: 0.61,
      card: "gold",
    },
  ];

  const itemsList = [
    {
      id: 1,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
    {
      id: 2,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
    {
      id: 3,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
    {
      id: 4,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
    {
      id: 5,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
    {
      id: 6,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
    {
      id: 7,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
    {
      id: 8,
      name: "?????",
      dropRate: "????",
      card: "normal",
    },
  ];

  return (
    <div className="page-profile">
      <nav className="page-nav">
        <ul className="page-navigation">
          <li>NET COLLECTION</li>
          <li>CAPSULE</li>
          <li>ITEMS</li>
          <li>UPGRADES</li>
          <li>STORAGE</li>
        </ul>

        <ul className="outer-navigation">
          <li>
            <img src={MineIcon} className="icon" /> MINE
          </li>
        </ul>
      </nav>
      <img src={Banner} className="banner" />
      <div className="nft-collection-section" id="nft-collection">
        <img src={NftCollectionTitle} className="section-title" />
        <Row gutter={{ lg: 64 }}>
          {nftCollectionList.map((item) => (
            <Col lg={6} key={item.id}>
              <NftCard info={item} />
            </Col>
          ))}
        </Row>
      </div>
      <div className="capsule-section" id="capsule">
        <img src={CapsuleTitle} className="section-title" />
        <Row type="flex" align="bottom" gutter={{ lg: 32 }}>
          <Col lg={14}>
            <CapsuleCard showTitle={true} />
          </Col>
          <Col lg={10}>
            <RocketCard>
              Each capsule contains 1 random generated NFT that unlocks the
              gamefi applications and play to earn gameplay.
            </RocketCard>
          </Col>
        </Row>
      </div>
      <div className="items-section" id="items">
        <img src={ItemsTitle} className="section-title" />
        <Row gutter={{ lg: 64 }}>
          {itemsList.map((item) => (
            <Col lg={6} key={item.id}>
              <NftCard info={item} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

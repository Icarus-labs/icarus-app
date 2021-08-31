import React, { useEffect, useState } from "react";
import { Row, Col, Button, Input, Checkbox } from "antd";
import { useWallet } from "use-wallet";
import graph from "utils/graph";
import { Link } from "react-router-dom";
import Banner from "assets/profile/banner.png";
import MineIcon from "assets/profile/mine-icon.svg";
import NftCollectionTitle from "assets/profile/titles/nft-collection.svg";
import CapsuleTitle from "assets/profile/titles/capsule.svg";
import ItemsTitle from "assets/profile/titles/items.svg";
import UpgradesTitle from "assets/profile/titles/upgrades.svg";
import TeamTitle from "assets/profile/titles/team.svg";
import StorageTitle from "assets/profile/titles/storage.svg";
import SearchIcon from "assets/profile/search.svg";

import NftCard from "components/NftCard";
import CapsuleCard from "components/CapsuleCard";
import RocketCard from "components/RocketCard";
import UpgradeCard from "components/UpgradeCard";
import StorageCard from "components/StorageCard";
import "./style.scss";

export default function Profile() {
  const nftCollectionList = [
    {
      id: 1,
      name: "SAMOS",
      dropRate: 23,
      card: "normal",
    },
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

  const chestList = [
    {
      name: "COMMON CHEST",
      src: "chest-common",
      quantity: 3,
      desc: `<p>By providing liquidity on ICA-BUSD/ETH/BTC pools, users have a chance of dropping a chest.</p><p>Collect as much as you can and turn them into epic units. These upgrades allow your NFTs to become even stronger!</p><p>*requires card to unlock</p> `,
    },
    {
      name: "RARE CHEST",
      src: "chest-rare",
      quantity: 2,

      desc: `<p>To upgrade for a rare chest it is needed 5 common ones, 5 rares to create an epic.</p><p>Keep stacking and Hit upgrade when you’re ready for it!</p><p>(racio 25:5:1)</p> `,
    },
    {
      name: "EPIC CHEST",
      src: "chest-epic",
      quantity: 1,

      desc: `<p>To become the elite, you must look like it!</p><p>Improve your stats, collect the best ingame items.</p><p>Do you have what it takes to reach the top?</p> `,
    },
  ];

  const cardList = [
    {
      name: "COMMON CARD",
      src: "card-common",
      quantity: 25,

      desc: `<p>By providing liquidity on zeth-busd / zbtc-busd pools, users have a chance of dropping a Key.</p><p>The loot inside the chests can be either ingame items, NFT level upgrade or resources, depending on the rarity.</p><p>even a simple Private may one day become a fearsome General!</p> <p>*requires equivalent chest to unlock loot</p>`,
    },
    {
      name: "RARE CARD",
      src: "card-rare",
      quantity: 3,

      desc: `<p>To upgrade for a rare key it is needed 5 common ones, 5 rares to create an epic.</p><p>Keep stacking and Hit upgrade when you’re ready for it!</p><p>(racio 25:5:1)</p> `,
    },
    {
      name: "EPIC CARD",
      src: "card-epic",
      quantity: 0,

      desc: `<p>Better, faster, stronger..<br/>It’s said the most feared enemy is the most resourceful one!</p><p>Once you have enough of these, nothing can stop you to become the space lord.</p>`,
    },
  ];

  const teamList = [
    {
      name: "SLOT 1",
    },
    {
      name: "SLOT 2",
    },
    {
      name: "SLOT 3",
    },
  ];

  const storageList = [
    {
      name: "ITEM X",
      src: "normal",
      level: 2,
      quantity: 3,
    },
    {
      name: "ITEM Y",
      src: "normal",
      level: 2,
      quantity: 3,
    },
    {
      name: "ITEM Z",
      src: "normal",
      level: 2,
      quantity: 3,
    },
    {
      name: "SAMOS",
      src: "samos",
      level: 2,
      quantity: 3,
    },
    {
      name: "SAMOS",
      src: "samos",
      level: 2,
      quantity: 3,
    },
    {
      name: "SAMOS",
      src: "samos",
      level: 2,
      quantity: 3,
    },
  ];

  const wallet = useWallet();
  const [blindboxList, setBlindboxList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const getBlindBox = async () => {
    const result = await graph.getBlindBox();
    setBlindboxList(result);
  };

  const getCollection = async (owner) => {
    const result = await graph.getCollection(owner);
    result.forEach((item) => {
      item.name = "SAMOS TEST";
      item.card = "samos";
      item.dropRate = 23;
      // {
      //   id: 1,
      //   name: "SAMOS",
      //   dropRate: 23,
      //   card: "normal",
      // },
    });
    setCollectionList(result);
  };

  useEffect(() => {
    if (wallet.account) {
      getBlindBox();
      getCollection(wallet.account);
    }
  }, [wallet]);

  return (
    <div className="page-profile">
      <nav className="page-nav">
        <ul className="page-navigation">
          <li>
            <a href="#nft-collection">NET COLLECTION</a>
          </li>
          <li>
            <a href="#capsule"> CAPSULE </a>
          </li>
          <li>
            <a href="#items"> ITEMS</a>
          </li>
          <li>
            <a href="#upgrades"> UPGRADES</a>
          </li>
          <li>
            <a href="#storage"> STORAGE</a>
          </li>
        </ul>
        <ul className="outer-navigation">
          <li>
            <Link to="mine">
              <img src={MineIcon} className="icon" /> MINE
            </Link>
          </li>
        </ul>
      </nav>
      <img src={Banner} className="banner" />
      <div className="nft-collection-section" id="nft-collection">
        <img src={NftCollectionTitle} className="section-title" />
        <Row
          gutter={{
            xs: 24,
            lg: 64,
          }}
        >
          {collectionList.concat(nftCollectionList).map((item, index) => (
            <Col xs={12} lg={6} key={index}>
              <NftCard info={item} />
            </Col>
          ))}
        </Row>
      </div>
      <div className="capsule-section" id="capsule">
        <img src={CapsuleTitle} className="section-title" />
        <Row
          type="flex"
          align="bottom"
          gutter={{
            lg: 32,
          }}
        >
          <Col xs={24} lg={14}>
            <CapsuleCard showTitle={true} mode="open" list={blindboxList} onRefresh={getBlindBox} />
          </Col>
          <Col xs={24} lg={10}>
            <RocketCard>
              Each capsule contains 1 random generated NFT that unlocks the
              gamefi applications and play to earn gameplay.
            </RocketCard>
          </Col>
        </Row>
      </div>
      <div className="items-section" id="items">
        <img src={ItemsTitle} className="section-title" />
        <Row
          gutter={{
            xs: 24,
            lg: 64,
          }}
        >
          {itemsList.map((item) => (
            <Col xs={12} lg={6} key={item.id}>
              <NftCard info={item} />
            </Col>
          ))}
        </Row>
      </div>
      <div className="upgrades-section" id="upgrades">
        <img src={UpgradesTitle} className="section-title" />
        <Row gutter={32} type="flex" align="middle">
          <Col xs={24} lg={9}>
            <UpgradeCard list={chestList} name="CHEST" />
          </Col>
          <Col xs={24} lg={6}>
            <div className="drop-circle">
              DROP YOUR <br />
              CARD HERE
            </div>
            <Button className="btn-purple btn-open">OPEN</Button>
            <div className="drop-circle">
              DROP YOUR <br />
              CARD HERE
            </div>
          </Col>
          <Col xs={24} lg={9}>
            <UpgradeCard list={cardList} name="CARD" />
          </Col>
        </Row>
      </div>
      <div className="bottom-area">
        <Row type="flex" align="middle" gutter={{ xl: 44 }}>
          <Col xs={24} xl={12} id="team" className="team-section">
            <img src={TeamTitle} className="section-title" />
            <div className="section-subtitle">
              Build your team and win prizes exploring the universe
            </div>
            <div className="team-list">
              <Row gutter={24}>
                {teamList.map((item) => (
                  <Col xs={24} md={12} lg={8}>
                    <div className="team-item">
                      <div className="avatar" />
                      <div className="name">{item.name}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
          <Col xs={24} xl={12} id="storage" className="storage-section">
            <img src={StorageTitle} className="section-title" />
            <div className="filter-zone">
              <div className="search-block">
                <span className="search-title">SEARCH</span>
                <Input
                  className="search-input"
                  prefix={<img src={SearchIcon} />}
                />
              </div>
              <div className="filter-right">
                <div className="check-block">
                  <span className="check-block-title">ONLY NFT'S</span>
                  <Checkbox />
                </div>
                <div className="check-block">
                  <span className="check-block-title">ONLY ITEMS</span>
                  <Checkbox />
                </div>
              </div>
            </div>
            <div className="storage-list">
              <Row gutter={12}>
                {storageList.map((item) => (
                  <Col xs={24} lg={8}>
                    <StorageCard item={item} />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

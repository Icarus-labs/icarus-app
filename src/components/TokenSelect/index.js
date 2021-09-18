import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Input } from "antd";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import CommonContractApi from "contract/CommonContractApi";
// import { LoadingOutlined } from "@ant-design/icons";
import config from "config";

import "./style.scss";

export default function TokenSelect(props) {
  const { tokenSelectType, onCancel, onSelect } = props;
  const network = useSelector((state) => state.setting.network);
  const wallet = useWallet();

  const web3 = new Web3(wallet.ethereum);

  const [search, setSearch] = useState("");

  const userTokensRaw = localStorage.getItem("userTokens");

  const userTokens = userTokensRaw ? JSON.parse(userTokensRaw) : [];

  let tokenList = config[network].tokensList;

  if (userTokens.length > 0) {
    tokenList = userTokens.concat(tokenList);
  }

  const selectToken = (token) => {
    onSelect(tokenSelectType, token);
    setSearch("");
    onCancel();
  };

  const searchToken = async (val) => {
    if (
      web3.utils.isAddress(val) &&
      tokenList.filter((item) => item.address === val).length === 0
    ) {
      const symbol = await CommonContractApi.getSymbol(val, wallet);
      if (symbol) {
        const findToken = {
          symbol,
          logoURI: `https://pancakeswap.finance/images/tokens/${val}.png`,
          address: val,
        };

        if (userTokens.filter((item) => item.address === val).length === 0) {
          localStorage.setItem(
            "userTokens",
            JSON.stringify([findToken, ...userTokens])
          );
        }
        tokenList.unshift(findToken);
      }
      setSearch(val);
    } else {
      setSearch(val);
    }
  };

  return (
    <Modal
      wrapClassName="token-select-modal"
      visible={tokenSelectType}
      footer={null}
      onCancel={() => {
        setSearch("");
        onCancel();
      }}
    >
      <div className="title">Select a token</div>
      <Input
        className="search-input"
        placeholder="Search for a token"
        value={search}
        onChange={(e) => searchToken(e.target.value)}
      />

      <div className="token-name">Token name</div>
      <div className="token-list">
        {tokenList.map((token) => (
          <div
            key={token.symbol}
            onClick={() => {
              selectToken(token);
            }}
            className={`token-item ${
              search &&
              token.symbol.toLowerCase().indexOf(search.toLowerCase()) < 0 &&
              token.address.toLowerCase().indexOf(search.toLowerCase()) < 0
                ? "hidden"
                : ""
            }`}
          >
            <img
              src={token.logoURI || "/img/default-token.svg"}
              className="token-logo"
            />
            <span className="token-symbol">{token.symbol}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

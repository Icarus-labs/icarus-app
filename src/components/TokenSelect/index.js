import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Modal, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./style.scss";

export default function TokenSelect(props) {
  const { tokenSelectType, onCancel, onSelect } = props;
  const [search, setSearch] = useState("");
  const [tokenList, setTokenList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const selectToken = (token) => {
    onSelect(tokenSelectType, token);
    setSearch('')
    onCancel();
  };

  const getTokenList = useCallback(async () => {
    setLoadingList(true);
    const tokenListRaw = await axios.get("/tokenlist");
    setLoadingList(false);

    setTokenList(tokenListRaw.data);
  });

  useEffect(() => {
    getTokenList();
  }, []);

  return (
    <Modal
      wrapClassName="token-select-modal"
      visible={tokenSelectType}
      footer={null}
      onCancel={()=> { setSearch(''); onCancel();}}
    >
      <div className="title">Select a token</div>
      <Input
        className="search-input"
        placeholder="Search for a token"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <div className="token-name">Token name</div>
      <div className="token-list">
        {loadingList && <LoadingOutlined className="loading-icon" />}
        {tokenList.map((token) => (
          <div
            key={token.symbol}
            onClick={() => {
              selectToken(token);
            }}
            className={`token-item ${
              search && token.symbol.toLowerCase().indexOf(search) < 0
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

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Input, Button, Checkbox, message } from "antd";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import ModalCloseIcon from "assets/modal-close-icon.svg";
import CommonContractApi from "contract/CommonContractApi";
// import { LoadingOutlined } from "@ant-design/icons";
import config from "config";

import "./style.scss";

export default function TokenSelect(props) {
  const { tokenSelectType, onCancel, onSelect } = props;
  const network = useSelector((state) => state.setting.network);
  const theme = useSelector((state) => state.setting.theme);
  const wallet = useWallet();

  const web3 = new Web3(wallet.ethereum);

  const [search, setSearch] = useState("");

  const [searchedToken, setSearchedToken] = useState({});

  const [balanceMapping, setBalanceMapping] = useState({});

  const [importHintVisible, setImportHintVisible] = useState(false);
  const [importRead, setImportRead] = useState(false);

  const userTokensRaw = localStorage.getItem("userTokens");

  const userTokens = userTokensRaw ? JSON.parse(userTokensRaw) : [];

  let tokenList = config[network].tokensList;

  if (userTokens.length > 0) {
    tokenList = userTokens.concat(tokenList);
  }

  useEffect(() => {
    // once token list changes, update the balance
    if (!wallet.account) {
      return;
    }
    getBalanceMapping();
  }, [wallet]);

  const selectToken = (token) => {
    onSelect(tokenSelectType, token);
    setSearch("");
    onCancel();
  };

  const getBalanceMapping = () => {
    tokenList.forEach(async (item) => {
      console.log("addr", item.address);
      const balance = await CommonContractApi.balanceOf(item.address, wallet);
      setBalanceMapping((prev) => {
        return {
          ...prev,
          [item.address]: balance,
        };
      });
    });
  };

  const addTokenList = async () => {
    if (!importRead) {
      message.error("Please be sure to understand your risk");
      return false;
    }
    // if (userTokens.filter((item) => item.address === val).length === 0) {
    localStorage.setItem(
      "userTokens",
      JSON.stringify([searchedToken, ...userTokens])
    );
    // }

    const balance = await CommonContractApi.balanceOf(
      searchedToken.address,
      wallet
    );

    setBalanceMapping((prev) => {
      return {
        ...prev,
        [searchedToken.address]: balance,
      };
    });

    resetFields();
  };

  const resetFields = () => {
    setSearch("");
    setImportHintVisible(false);
    setImportRead(false);
    setSearchedToken({});
  };

  const searchToken = async (val) => {
    if (
      web3.utils.isAddress(val) &&
      tokenList.filter((item) => item.address === val).length === 0
    ) {
      const symbol = await CommonContractApi.getSymbol(val, wallet);
      if (symbol) {
        setSearchedToken({
          symbol,
          logoURI: `https://pancakeswap.finance/images/tokens/${val}.png`,
          address: val,
        });
      }
      setSearch(val);
    } else {
      setSearch(val);
    }
  };

  return (
    <Modal
      wrapClassName={`token-select-modal ${theme === "purple" ? "purple" : ""}`}
      visible={tokenSelectType}
      footer={null}
      closeIcon={<img src={ModalCloseIcon} className="modal-close-icon" />}
      onCancel={() => {
        resetFields();
        onCancel();
      }}
    >
      <div className="title">CHOOSE YOUR TOKEN</div>
      <Input
        className="search-input"
        placeholder="Search name or paste address"
        value={search}
        onChange={(e) => searchToken(e.target.value)}
      />
      {importHintVisible && (
        <div className="risk-hint">
          <div className="title">Trade at your own risk!</div>
          <div className="desc">
            <strong>Bad actors in the space may try to scam you.</strong>
            <br />
            Beware of token contracts, always make sure it’s the one you’re
            looking for.
          </div>
          <Checkbox
            className="hint-check"
            checked={importRead}
            onChange={(e) => {
              setImportRead(e.target.checked);
            }}
          >
            I understand
          </Checkbox>
          <Button className="btn-purple" onClick={addTokenList}>
            Import
          </Button>
        </div>
      )}
      {!importHintVisible &&
        (searchedToken && searchedToken.address ? (
          <div className="token-list">
            <div className="token-item searched-token">
              <div>
                <img
                  src={searchedToken.logoURI || "/img/default-token.svg"}
                  className="token-logo"
                />
                <span className="token-symbol">{searchedToken.symbol}</span>
              </div>
              <Button
                className="btn-purple"
                onClick={() => setImportHintVisible(true)}
              >
                Import
              </Button>
            </div>
          </div>
        ) : (
          <div className="token-list">
            {tokenList.map((token) => (
              <div
                key={token.symbol}
                onClick={() => {
                  selectToken(token);
                }}
                className={`token-item ${
                  search &&
                  token.symbol.toLowerCase().indexOf(search.toLowerCase()) <
                    0 &&
                  token.address.toLowerCase().indexOf(search.toLowerCase()) < 0
                    ? "hidden"
                    : ""
                }`}
              >
                <div>
                  <img
                    src={token.logoURI || "/img/default-token.svg"}
                    className="token-logo"
                  />
                  <span className="token-symbol">{token.symbol}</span>
                </div>
                <div className="balance">{balanceMapping[token.address]}</div>
              </div>
            ))}
          </div>
        ))}
    </Modal>
  );
}

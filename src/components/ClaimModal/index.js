import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
// import axios from "utils/axios";
// import Web3 from "web3";
// import mm from "components/mm";
// import erc20ABI from "contract/abi/ERC20.json";
import ClaimGirl from "assets/claim-girl.png";
import ClaimApi from 'contract/ClaimContractApi'
import { useWallet } from "use-wallet";
import "./style.scss";

export default function ClaimModal(props) {
  const { onCancel } = props;
  const wallet = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(async()=>{
    const result = await ClaimApi.balanceOf(wallet)
    setBalance(result)
  })

  const doClaim = async () => {
    await ClaimApi.claim(wallet)
  };
  return (
    <Modal
      footer={null}
      visible={true}
      width={400}
      wrapClassName="claim-modal"
      onCancel={() => {
        onCancel();
      }}
    >
      <div className="modal-title">Claim your share of </div>
      <div className="modal-subtitle">100K $ica airdrop</div>
      <div className="amount-box">
        <span className="title">AMOUNT:</span>
        <span className="value">{balance} $ICA</span>
        <img src={ClaimGirl} className="claim-girl" />
      </div>
      <Button
        onClick={() => {
          doClaim();
        }}
        className="btn"
      >
        CLAIM
      </Button>
    </Modal>
  );
}

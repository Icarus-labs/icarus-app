import React, { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "utils/axios";
import Web3 from "web3";
import mm from "components/mm";
import erc20ABI from "contract/abi/ERC20.json";
import ClaimGirl from "assets/claim-girl.png";
import { useWallet } from "use-wallet";
import "./style.scss";

export default function ClaimModal(props) {
  const { onCancel } = props;
  const wallet = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(async () => {
    const web3 = new Web3("https://bsc-dataseed.binance.org");
    const icaContract = new web3.eth.Contract(
      erc20ABI,
      "0x95111f630ac215eb74599ed42c67e2c2790d69e2"
    );
    const balanceInWei = await icaContract.methods
      .balanceOf(wallet.account)
      .call();
    const balance = web3.utils.fromWei(String(balanceInWei));
    setBalance(Number(balance).toFixed(6));
  }, []);

  const doClaim = async () => {
    const result = await axios.post("/ica/transform", {
      address: wallet.account,
    });
    let txnParams = result.data.data.txs.map((item, index) => {
      return {
        from: wallet.account,
        to: item.contract,
        data: item.calldata,
        isApprove: item.action_type === "Approve",
      };
    });
    const status = await mm.sendTransaction(txnParams, "Migrate");
    if (status) {
      message.success("Success");
      onCancel();
    }
  };
  return (
    <Modal
      footer={null}
      visible={true}
      width={320}
      wrapClassName="claim-modal"
      onCancel={() => {
        onCancel();
      }}
    >
      <div className="modal-title">Claim your share of </div>
      <div className="modal-subtitle">100K $ica airdrop</div>
      <div className="amount-box">
        <span className="title">AMOUNT:</span>
        <span className="value">10000 $ICA</span>
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

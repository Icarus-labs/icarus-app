import React, { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import axios from "utils/axios";
import Web3 from "web3";
import mm from "components/mm";
import erc20ABI from "contract/abi/ERC20.json";
import BuyIcaIcon from "assets/buy-ica.svg";
import { useWallet } from "use-wallet";
import "./style.scss";

export default function MigrateModal(props) {
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

  const doMigrate = async () => {
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
      wrapClassName="migrate-modal"
      onCancel={() => {
        onCancel();
      }}
    >
      <div className="modal-title">MIGRATE</div>
      <img src={BuyIcaIcon} className="buy-icon" />
      <div className="info-line">
        <span>WALLET BALANCE:</span>
        <span>{balance ? Number(balance) : 0}</span>
      </div>
      <Button
        onClick={() => {
          doMigrate();
        }}
        className="btn"
      >
        MIGRATE
      </Button>
    </Modal>
  );
}

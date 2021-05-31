import React from "react";
import { Modal, Button, message } from "antd";
import axios from "utils/axios";
import mm from "components/mm";
import BuyIcaIcon from "assets/buy-ica.svg";
import { useWallet } from "use-wallet";
import "./style.scss";

export default function MigrateModal(props) {
  const { onCancel, balance } = props;
  const wallet = useWallet();

  const doMigrate = async () => {
    // const result = await axios.post(`${currentToken}/pools/stake`, {
    //   amount: isMax ? "-1" : amount,
    //   account: wallet.account,
    //   pool: poolAddress,
    // });
    // let txnParams = result.data.data.txs.map((item, index) => {
    //   return {
    //     from: wallet.account,
    //     to: item.contract,
    //     data: item.calldata,
    //     isApprove: item.action_type === "Approve",
    //   };
    // });
    // const status = await mm.sendTransaction(txnParams, `Stake ${stakeToken}`);
    // if (status) {
    //   message.success("Success");
    // }
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

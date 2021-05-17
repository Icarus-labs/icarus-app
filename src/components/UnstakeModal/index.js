import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message } from "antd";
import axios from "utils/axios";
import mm from "components/mm";
import { useWallet } from "use-wallet";
import "./style.scss";

export default function UnstakeModal(props) {
  const { onCancel, poolAddress, balance, stakeToken, currentToken } = props;
  const [amount, setAmount] = useState();
  const [isMax, setIsMax] = useState(false);
  const wallet = useWallet();

  const doExit = async () => {
    const result = await axios.post(`/${currentToken}/pools/exit`, {
      account: wallet.account,
      pool: poolAddress,
    });

    let txnParams = result.data.data.txs.map((item) => {
      return {
        from: wallet.account,
        to: item.contract,
        data: item.calldata,
      };
    });

    await mm.sendTransaction(txnParams, "Exit");
  };

  const doUnstake = async () => {
    if (!isMax && !amount) {
      message.error("Please input amount!");
      return false;
    }
    if (isMax) {
      doExit();
    } else {
    }
    const result = await axios.post(`${currentToken}/pools/withdraw`, {
      amount: isMax ? "-1" : amount,
      account: wallet.account,
      pool: poolAddress,
    });

    let txnParams = result.data.data.txs.map((item, index) => {
      return {
        from: wallet.account,
        to: item.contract,
        data: item.calldata,
        isApprove: item.action_type === "Approve",
      };
    });

    await mm.sendTransaction(txnParams, `Unstake ${stakeToken}`);
  };
  return (
    <Modal
      footer={null}
      visible={true}
      width={320}
      wrapClassName="action-modal"
      onCancel={() => {
        onCancel();
      }}
    >
      <span className="amount-input-wrapper">
        <Input
          value={amount}
          placeholder="0"
          disabled={Number(balance) <= 0}
          onChange={(e) => {
            setAmount(e.target.value);
            setIsMax(false);
          }}
        />
        {balance > 0 && (
          <span
            className="max"
            onClick={() => {
              setAmount(balance);
              setIsMax(true);
            }}
          >
            MAX
          </span>
        )}
      </span>

      <div className="info-line">
        <span>BALANCE:</span>
        <span>{balance ? Number(balance) : 0}</span>
      </div>
      <Button
        onClick={() => {
          doUnstake();
        }}
        className="btn"
      >
        UNSTAKE
      </Button>
    </Modal>
  );
}

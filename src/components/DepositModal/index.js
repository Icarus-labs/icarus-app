import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message } from "antd";
import axios from "utils/axios";
import mm from "components/mm";
import { useWallet } from "use-wallet";
import "./style.scss";

export default function DepositModal(props) {
  const { onCancel, poolAddress, balance, stakeToken, currentToken } = props;
  const [amount, setAmount] = useState();
  const [isMax, setIsMax] = useState(false)
  const wallet = useWallet();

  // const getAssetBalance = async () => {
  //   const result = await axios.get(
  //     `/presale/balances?address=${wallet.account}`
  //   );
  //   setBalance(result.data.data.zeth_pretty);
  // };

  const doStake = async () => {
    if (!isMax && !amount) {
      message.error("Please input amount!");
      return false;
    }
    const result = await axios.post(`${currentToken}/pools/stake`, {
      amount: isMax ? '-1' : amount,
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

    const status = await mm.sendTransaction(txnParams, `Stake ${stakeToken}`);
    if (status) {
      message.success("Success");
    }
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
            setIsMax(false)
          }}
        />
        {balance > 0 && (
          <span
            className="max"
            onClick={() => {
              setAmount(balance);
              setIsMax(true)
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
          doStake();
        }}
        className="btn"
      >
        STAKE
      </Button>
    </Modal>
  );
}

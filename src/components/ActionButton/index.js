import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useWallet } from "use-wallet";
import CommonContractApi from "contract/CommonContractApi";

export default function ActionButton(props) {
  const { tokenAddress, tokenSymbol, contractAddress, isPurple, children } = props;
  const [allowance, setAllowance] = useState(0);
  const [approving, setApproving] = useState(false);
  const wallet = useWallet();
  const currentAccount = wallet.account;

  const checkAllowance = async () => {
    const result = await CommonContractApi.getAllowance(
      tokenAddress,
      contractAddress,
      wallet
    );
    setAllowance(result);
  };

  useEffect(() => {
    if (currentAccount && tokenAddress && contractAddress) {
      checkAllowance();
    }
  }, [tokenAddress, contractAddress, currentAccount]);

  const doApprove = async () => {
    setApproving(true);
    try {
      await CommonContractApi.doApprove(tokenAddress, contractAddress, wallet);
      console.log("ready to check allowance");
      setApproving(false);
      checkAllowance();
    } catch (err) {
      setApproving(false);
    }
  };

  return allowance > 0 || !tokenAddress || tokenSymbol === 'BNB' ? (
    <>{children}</>
  ) : (
    <Button
      type="submit"
      onClick={doApprove}
      className={`${isPurple ? "btn-purple" : "btn btn-main"} center-block`}
      disabled={approving}
    >
      {approving && <span>APPROVING</span>}
      {!approving && <span>APPROVE</span>}
    </Button>
  );
}

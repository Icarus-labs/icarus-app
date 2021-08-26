import React, { useEffect, useState } from "react";
import { message, Button } from "antd";
import { useWallet } from "use-wallet";
import CommonContractApi from "contract/CommonContractApi";

export default function ActionButton(props) {
  const { tokenAddress, contractAddress, children } = props;
  const [allowance, setAllowance] = useState(0);
  const [approving, setApproving] = useState(false);
  const wallet = useWallet();
  const currentAccount = wallet.account;

  useEffect(() => {
    const checkAllowance = async () => {
      const result = await CommonContractApi.getAllowance(
        tokenAddress,
        contractAddress,
        wallet
      );
      setAllowance(result);
      console.log("allow", result);
    };

    if (currentAccount) {
      checkAllowance();
    }
  }, [tokenAddress, contractAddress, currentAccount]);

  const doApprove = async () => {
    setApproving(true);
    message.info({
      message: "Approving",
    });
    try {
      await CommonContractApi.doApprove(
        tokenAddress,
        contractAddress,
        wallet
      );
    } catch (err) {
      console.log(err);
    } finally {
      setApproving(false);
    }
  };

  return allowance > 0 ? (
    <span>{children}</span>
  ) : (
    <Button
      type="submit"
      onClick={doApprove}
      className="btn btn-main center-block"
      disabled={approving}
    >
      {approving && <span>APPROVING</span>}
      {!approving && <span>APPROVE</span>}
    </Button>
  );
}

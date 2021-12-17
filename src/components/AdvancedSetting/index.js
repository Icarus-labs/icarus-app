import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Input, Button, message } from "antd";
import ModalCloseIcon from "assets/modal-close-icon.svg";

import "./style.scss";

export default function AdvancedSetting(props) {
  const { setting, onSetting, onCancel } = props;
  const [isCustom, setIsCustom] = useState(false);
  const [slippage, setSlippage] = useState();
  const theme = useSelector((state) => state.setting.theme);

  useState(() => {
    if (setting.slippage) {
      setSlippage(setting.slippage);
    }
  }, [setting]);

  useEffect(() => {
    setIsCustom(
      slippage === 0.1 || slippage === 0.5 || slippage === 1.0 ? false : true
    );
  }, [slippage]);

  const slippageChange = (val) => {
    setSlippage(val);
  };

  const doChangeSetting = () => {
    if (!slippage || typeof slippage !== "number" || slippage > 100) {
      message.error("Slippage not valid");
      return false;
    }
    onSetting({
      slippage,
    });
    onCancel();
  };
  return (
    <Modal
      wrapClassName={`advanced-setting-modal ${theme === 'purple' ? 'purple' :''}`}
      visible={true}
      footer={null}
      closeIcon={<img src={ModalCloseIcon} className="modal-close-icon" />}
      onCancel={() => {
        onCancel();
      }}
    >
      <div className="title">Slippage Tolerance</div>
      <div className="tabs">
        <div
          onClick={() => slippageChange(0.1)}
          className={`tab ${slippage === 0.1 ? "active" : ""}`}
        >
          0.1%
        </div>
        <div
          onClick={() => slippageChange(0.5)}
          className={`tab ${slippage === 0.5 ? "active" : ""}`}
        >
          0.5%
        </div>
        <div
          onClick={() => slippageChange(1.0)}
          className={`tab ${slippage === 1.0 ? "active" : ""}`}
        >
          1.0%
        </div>
      </div>
      <div className={`custom-tab ${isCustom ? "active" : ""}`}>
        <div>Custom</div>
        <Input
          onChange={(e) => slippageChange(Number(e.target.value))}
          defaultValue={slippage}
          className="custom-slippage"
          suffix="%"
        />
      </div>
      <Button className="btn-purple" onClick={doChangeSetting}>
        Confirm
      </Button>
    </Modal>
  );
}

import React from "react";

import "./style.scss";

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="links">
          <a href="https://twitter.com/zetta_icarus">TWITTER</a>
          <a href="https://t.me/icarus_finance">TELEGRAM</a>
          <a href="https://discord.gg/FW5QtuzPdS">DISCORD</a>
          <a href="https://icarus-finance.medium.com">MEDIUM</a>
          <a href="https://solidity.finance/audits/Icarus">AUDIT</a>
        </div>
        <div className="year">2021</div>
      </div>
    </footer>
  );
}

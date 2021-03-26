import zethLogo from "assets/tokens/zeth.svg";
import busdLogo from "assets/tokens/busd.svg";
import icaLogo from "assets/tokens/ica.svg";
import ethLogo from "assets/tokens/eth.svg";

export const poolList = [
  {
    id: 0,
    apy: "0% + 0%",
    // pageTitle: "zETH Hash Mining!",
    // pageLogo: zethLogo,
    byTokens: [zethLogo],
    earn: ["ETH", "ICA"],
    earnTokens: [ethLogo, icaLogo],
    by: "ZETH",
    tvl: "0",
  },
  {
    id: 1,
    apy: "0% + 0%",
    byTokens: [zethLogo, busdLogo],
    earnTokens: [ethLogo, icaLogo],
    earn: ["ETH", "ICA"],
    by: "ZETH-BUSD",
    tvl: "0",
  },
  {
    id: 2,
    apy: "0%",
    byTokens: [icaLogo, busdLogo],
    earnTokens: [icaLogo],
    earn: ["ICA"],
    by: "ICA-BUSD",
    tvl: "0",
  },
  {
    id: 2,
    apy: "0%",
    byTokens: [icaLogo, zethLogo],
    earnTokens: [icaLogo],
    earn: ["ICA"],
    by: "ZETH-ICA",
    tvl: "0",
  },
];

export default poolList;

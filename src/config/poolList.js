// import zethLogo from "assets/tokens/zeth.svg";
// import busdLogo from "assets/tokens/busd.svg";
// import icaLogo from "assets/tokens/ica.svg";
// import ethLogo from "assets/tokens/eth.svg";

const poolList = [
  {
    pid: 0,
    want: ['CAKE'],
    earned: 'AUTO',
    strategy: '0x56907709132027f8E004f99205cb21D40885B461',
    tokens: ['pancakeswap-token']
  },
  {
    pid: 1,
    want: ['BUSD', 'ETH'],
    earned: 'AUTO',
    strategy: '0xd85b8d869b4abb4351d76d08FC9Cd32c5dEc78a4',
    tokens: ['binance-usd', 'ethereum']
  }
];

export default poolList;

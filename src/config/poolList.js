// import zethLogo from "assets/tokens/zeth.svg";
// import busdLogo from "assets/tokens/busd.svg";
// import icaLogo from "assets/tokens/ica.svg";
// import ethLogo from "assets/tokens/eth.svg";

const poolList = [
  {
    pid: 0,
    want: ['CAKE'],
    earned: 'AUTO',
    //used for track price
    tokens: ['pancakeswap-token']
  },
  {
    pid: 1,
    want: ['vICA', 'BUSD'],
    earned: '',
    tokens: ['icarus-finance', 'binance-usd']
  }
];

export default poolList;

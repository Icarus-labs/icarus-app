const commonABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "isPauser",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renouncePauser",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "addPauser",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "addMinter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceMinter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "isMinter",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "symbol",
        type: "string",
      },
      {
        name: "decimals",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address",
      },
    ],
    name: "MinterAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address",
      },
    ],
    name: "MinterRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address",
      },
    ],
    name: "PauserAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address",
      },
    ],
    name: "PauserRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
];

export const chainIdMapping = {
  1: "ETH Mainnet",
  56: "BSC Mainnet",
  128: "HECO Mainnet",
  97: "BSC Testnet",
};

export const blocksLeftMapping = {
  xDitto: 1626339826,
  WBNB: 1626168009,
  BUSD: 1626167400,
  MATIC: 1626165053,
};
//template_id 1: moneyDao 定时筹款，投票释放
// template_id 2: moneyDaoFullRelease 定时筹款，全款释放
// template_id 3: moneyDaoFixRaise 定期筹款，投票释放
// template_id 4: moneyDaoFixRaiseFullRelease 定期筹款，全款释放

export default {
  // 默认要连接的network，测试环境默认用 test，生产环境默认用 ethereum
  defaultNetwork: "binance",
  //test(binance)
  test: {
    contracts: {
      vica: "0xa14c51Fe67eb2756298Bb0A22d757C62be01AEAF",
      core: "0xF14e233B9e78ce096445dBA4792adbbab6315947",
      market: "0xa527213aFa6d074A44018774191D1E01B18ffcf8",
      media: "0x5d1707406DAb46c84ff24F11B56ef412668017Cd",
      holder: "0xCfaa4F77ae18b51511390929D2647C9896BCB414",
      staker: "0xb7767882FBc74b01966558a153416a2FacDBcc8a",

      box: "0x80E94eaF3c828535700bFe0e0393F2c8365c2966",
    },
    network: "test",
    //区分测试环境与生产环境。目前只用在了网络环境切换的判断
    mode: "test",
    decimal: 18,
    provider: "https://data-seed-prebsc-1-s1.binance.org:8545",
    buyContractAddress: "0x848DF83e236eF9B88E635f65cC71a125C89D6B3f",
    buyETHContractAddress: "0x...",
    scanUrl: "https://testnet.bscscan.com/address",
    chainId: 97,
    // 后端 api
    baseURL: "https://api-test.icarus.finance",
    // 通用ABI
    commonABI,
    blocksLeftMapping,
  },

  // binance
  binance: {
    contracts: {
      vica: "0xbcbdeccd5cbd126e62a874e04178accbcb7ee2a1",
      core: "0x51d91ece0e099d76cdb2713b81b378d29876452e",
      market: "0x8bbc20c2237d156fe0bcb3e10c76d7a4cf42d669",
      media: "0xefe0cd4fff3143b016bd982ca271d8fc1826894b",
      holder: "0xBD265D3b9572Ea4039eb83f8fdfF46B7Fadd9Fe6",
      staker: "0xF3831F3fC64e5D44AfFD25afbd2Fc5e724a670d2",

      box: "0xdabd923235127e4d70f6da2cdfba0efb3f674d5f",

      router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      cake: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      bnb: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    },
    swapMediumTokens: [
      // busd
      "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      // weth
      "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      // wbnb
      "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    ],
    tokensList: [
      {
        symbol: "ICA",
        logoURI: "/poolTokens/ica.svg",
        address: "0x0ca2f09eca544b61b91d149dea2580c455c564b2",
      },
      {
        symbol: "BUSD",
        logoURI: "/poolTokens/busd.svg",
        address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      },
      {
        symbol: "BTCB",
        logoURI: "/poolTokens/btc.svg",
        address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
      },
      {
        symbol: "ETH",
        logoURI: "/poolTokens/eth.svg",
        address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      },
      {
        name: "WBNB Token",
        symbol: "WBNB",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png",
      },
      {
        name: "Tether USD",
        symbol: "USDT",
        address: "0x55d398326f99059fF775485246999027B3197955",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0x55d398326f99059ff775485246999027b3197955.png",
      },
      {
        name: "PancakeSwap Token",
        symbol: "CAKE",
        address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png",
      },
      {
        name: "Venus",
        symbol: "XVS",
        address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63.png",
      },
      {
        name: "VAI Stablecoin",
        symbol: "VAI",
        address: "0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0x4bd17003473389a42daf6a0a729f6fdb328bbbd7.png",
      },
      {
        name: "Pancake Bunny",
        symbol: "BUNNY",
        address: "0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51.png",
      },
      // {
      //   "name": "SafeMoon",
      //   "symbol": "SAFEMOON",
      //   "address": "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
      //   "chainId": 56,
      //   "decimals": 9,
      //   "logoURI": "https://pancakeswap.finance/images/tokens/0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3.png"
      // },
      {
        name: "Alpaca",
        symbol: "ALPACA",
        address: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0x8f0528ce5ef7b51152a59745befdd91d97091d2f.png",
      },
      {
        name: "Belt",
        symbol: "BELT",
        address: "0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f.png",
      },
      {
        name: "TokoCrypto",
        symbol: "TKO",
        address: "0x9f589e3eabe42ebC94A44727b3f3531C0c877809",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0x9f589e3eabe42ebc94a44727b3f3531c0c877809.png",
      },
      {
        name: "Nerve Finance",
        symbol: "NRV",
        address: "0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0x42f6f551ae042cbe50c739158b4f0cac0edb9096.png",
      },
      {
        name: "Ellipsis",
        symbol: "EPS",
        address: "0xA7f552078dcC247C2684336020c03648500C6d9F",
        chainId: 56,
        decimals: 18,
        logoURI:
          "https://pancakeswap.finance/images/tokens/0xa7f552078dcc247c2684336020c03648500c6d9f.png",
      },
    ],
    network: "binance",
    mode: "prod",
    provider: "https://bsc-dataseed.binance.org",
    buyContractAddress: "0xd0dff49de3e314fdfd3f93c5eeee7d5d2f5515cd",
    buyETHContractAddress: "0x1c56AcE0C0391205e775EeCA3fF1AC05FE382105",
    scanUrl: "https://bscscan.com/address",
    chainId: 56,
    baseURL: "https://api.icarus.finance",
    commonABI,
    blocksLeftMapping,
  },
};

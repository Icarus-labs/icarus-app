# icarus.finance dApp

## Quick Start

1. Installing dependencies
`yarn install`

2. Development environment
`yarn start`

3. Packing Code
`yarn build`

4. Deployment Code
Use the `build` folder generated in step 4 to place on a server such as nginx, apache, etc.



BlindBox
id: ID!           // to+timestamp
to: Bytes!     // 盲盒拥有者地址
subgraph字段也更新了，你可以获得
staked:  锁仓vICA个数
value: 价值$
createdAt: 创建时间
endAt:  到期时间


0: created -> stake之后就进入这个状态，开始倒计时
1: claimed -> box到期之后可以调用 claim(boxId)，进入2状态
2: opened -> 2状态时可以调用 open(boxId)，开出NFT
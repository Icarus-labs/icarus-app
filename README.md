# dd.finance dApp

## 快速使用

1. 下载代码
`git clone git@github.com:y2labs-0sh/mining-dd-finance.git`

2. 安装依赖
`yarn install`

3. 开发环境
`yarn start`

4. 打包代码
`yarn build`

5. 部署代码
使用第4步生成的`build`文件夹，放到 nginx, apache 等服务器


## 分支管理

- v3: 当前活跃分支，主要在此分支开发和部署
- pro-cluster: 针对 cluster.dd.finance 的分支

## 技术架构
项目使用 `create-react-app` 进行基础代码框架搭建，使用 hooks 的方式编写 react 代码。
- `axios`, 发送请求
- `react-router-dom`，路由管理
- `antd`, UI框架
- `sass`, 样式预编译处理
- `use-wallet`, 钱包管理

## 包含功能
1. `/create-project/:type`，创建项目
2. `/projects/`，查看矿业项目
3. `/community-projects`，查看社区项目
4. `/blog`，查看博客
5. `/buy-dhm`，购买 DHM
6. `/farming-detail`，进行 DHM 的 stake

## 配置功能
项目支持 ETH, BSC, HECO 三种环境，针对不同环境要修改不同变量，要修改 `/src/config/index.js` 文件。字段的详细含义已在注释中解释。该配置文件总共有 `test`, `ethereum`, `binance`, `heco` 四个键值，对应着四个不同的环境，其中 `test` 是本地开发测试环境，其余为生产环境，在切换到不同环境时，会采用不同的配置。

- `defaultNetwork`, 默认要连接的环境，测试环境改为 `test`，同时也会去除掉切换环境的支持（只有生产环境可以切换网络）。生产环境改为`ethereum`, `binance`, `heco` 中的一种，在用户没有选择过网络环境的情况下，默认会使用这三个设置中的一种。

## 推荐开发和部署环境

推荐使用 Node.js v12 及以上版本进行开发。服务器使用 nginx 进行静态文件处理，以下是最基础的nginx参考配置

```
server{
    server_name ${域名};
    root ${项目打包后的目录};
    try_files $uri $uri/ /index.html;
    index index.html;
}
```


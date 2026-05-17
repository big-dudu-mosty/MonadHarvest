# MonadHarvest

**Monad 链上农场 + OKX Onchain OS** — 在 Monad 测试网上种植、收获、竞争，同时通过 OKX 查看以太坊持仓、DEX 兑换与链上热门行情。

[![GitHub](https://img.shields.io/github/big-dudu-mosty/MonadHarvest?style=flat&logo=github)](https://github.com/big-dudu-mosty/MonadHarvest)
[![Monad](https://img.shields.io/badge/Chain-Monad%20Testnet-22c55e)](https://monad.xyz)
[![OKX](https://img.shields.io/badge/Powered%20by-OKX%20Onchain%20OS-000)](https://web3.okx.com/onchain-os/dev-portal)

## 项目简介

MonadHarvest 将完全链上的农场游戏与 OKX Web3 能力组合为同一款产品：

- **Monad 侧**：100 块土地、NFT 种子、种植 / 收获 / 偷菜、互助与双排行榜，核心逻辑由 Solidity 合约驱动。
- **OKX 侧**：个人页展示以太坊主网资产组合；商店提供 ETH → USDC 聚合兑换；排行榜旁展示链上热门代币（开发环境通过 Vite 代理调用 OKX API）。

> 农场玩法在 **Monad**；OKX 功能当前基于 **以太坊主网** API（Monad 暂不在 OKX DEX 全链路支持范围内）。

## 核心特性

### 农场游戏（Monad）

| 功能 | 说明 |
|------|------|
| 种植系统 | NFT 种子，100 块独立土地 |
| 互助机制 | 帮助他人获得 KIND 代币（每日上限 15 次） |
| 双排行榜 | 收获数 / 善良值排名 |
| 道具与天气 | 浇水、施肥；每块地独立天气 |
| 偷菜 | 成熟作物可被其他玩家偷取 |

### OKX 集成（Ethereum）

| 页面 | 能力 |
|------|------|
| `/profile` | 多代币持仓与 USD 估值 |
| `/shop` | OKX DEX 聚合报价与 ETH → USDC 兑换 |
| `/leaderboard` | 以太坊热门 / 趋势代币侧栏 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18、TypeScript、Vite、TailwindCSS、Wagmi、Viem、TanStack Query |
| 合约 | Solidity ^0.8.24、Foundry、OpenZeppelin |
| 链 | Monad Testnet（游戏）、Ethereum Mainnet（OKX Swap 演示） |
| Web3 扩展 | [OKX Onchain OS](https://web3.okx.com/onchain-os/dev-portal) |

## 项目结构

```
MonadHarvest/
├── farm-frontend/              # React 前端
│   ├── src/
│   │   ├── components/okx/     # OKX 面板（持仓 / Swap / 热门）
│   │   ├── hooks/okx/          # OKX API Hooks
│   │   ├── services/okx/       # OKX 客户端
│   │   ├── pages/              # 农场 / 商店 / 排行榜等
│   │   └── contracts/          # ABI 与链配置
│   └── scripts/
│       └── okx-proxy-plugin.ts # 开发环境 OKX 签名代理
├── farm3.0/                    # Foundry 智能合约
│   ├── src/                    # FarmGame、SeedNFT、LandNFT 等
│   ├── test/
│   └── script/
└── README.md
```

## 快速开始

### 环境要求

- Node.js 18+
- MetaMask 或其他 Web3 钱包
- Foundry（仅合约开发时需要）

### 1. 克隆仓库

```bash
git clone https://github.com/big-dudu-mosty/MonadHarvest.git
cd MonadHarvest
```

### 2. 安装依赖

```bash
cd farm-frontend && npm install
cd ../farm3.0 && npm install   # 可选：合约开发
```

### 3. 配置环境变量

在 `farm-frontend` 目录复制并编辑环境文件：

```bash
cp .env.example .env
```

**前端（`farm-frontend/.env`）**

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_APP_NAME="MonadHarvest"
```

**OKX API（仅本地 `npm run dev` 代理使用，勿加 `VITE_` 前缀，勿提交到 Git）**

```env
OKX_API_KEY=your_okx_api_key
OKX_SECRET_KEY=your_okx_secret_key
OKX_API_PASSPHRASE=your_okx_passphrase
```

在 [OKX Onchain OS 开发者门户](https://web3.okx.com/onchain-os/dev-portal) 申请密钥。

### 4. 启动前端

```bash
cd farm-frontend
npm run dev
```

浏览器打开 `http://localhost:3000`，连接钱包并切换到 **Monad Testnet**。

### 5. 合约测试（可选）

```bash
cd farm3.0
forge test
```

## Monad 测试网

| 项 | 值 |
|----|-----|
| Chain ID | `10143` |
| RPC | `https://testnet-rpc.monad.xyz` |
| 浏览器 | [testnet-explorer.monad.xyz](https://testnet-explorer.monad.xyz) |

### 合约地址（Monad Testnet）

```text
FarmGame:       0xF2865b5E17A2F8D777E25Bc3ab6F4fEd06651966
SeedNFT:        0x40f21aF2a179395240E420294E1fC7d5cd82D2c5
LandNFT:        0x7CD168C9D36690f355281Ed7fe42c6a86d5D3af8
KindnessToken:  0x7310445E157bAf6588C373E067518af671DD00f3
Shop:           0xAfd9617bfa6Ed797314200B98B606F5b22E24f07
```

## OKX 使用说明

1. 配置上述 `OKX_*` 环境变量后重启 `npm run dev`。
2. **个人中心**：查看连接地址在以太坊上的 OKX 资产摘要。
3. **商店**：查看 ETH → USDC 报价；执行兑换前请将钱包切换到 **以太坊主网**。
4. **排行榜**：浏览 OKX 热门代币列表。

> 生产部署（如 Vercel）不会自动包含开发代理，需自行实现 Serverless 签名代理后再暴露 OKX 功能。

## XAgent / 黑客松（可选）

```bash
npx @xagt/agent-plugin@latest setup --target all
```

安装 Cursor / Claude 等环境的 OKX Skill，便于 AI 辅助继续扩展 DeFi 能力。完成后可执行 `xagt-plugin submit` 提交参赛 PR。

## 开发命令

```bash
# 前端
cd farm-frontend
npm run dev
npm run build
npm run lint

# 合约
cd farm3.0
forge test
forge build
```

## 部署

**前端**：将 `farm-frontend` 根目录部署到 Vercel / Netlify，`npm run build` 输出为 `dist/`。

**合约**：使用 `farm3.0/script/` 下脚本部署至 Monad 测试网。

历史演示站点：[farm-monad.vercel.app](https://farm-monad.vercel.app/)（Farm 3.0 时期部署，可能与当前仓库命名不一致）。

## 相关链接

- [GitHub 仓库](https://github.com/big-dudu-mosty/MonadHarvest)
- [Monad](https://monad.xyz)
- [Monad 测试网浏览器](https://testnet-explorer.monad.xyz)
- [OKX Onchain OS 文档](https://web3.okx.com/onchain-os/dev-docs)

## 许可证

MIT License

---

**Built on Monad · Powered by OKX Onchain OS**

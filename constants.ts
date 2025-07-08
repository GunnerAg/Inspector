import React from 'react';
import { Wallet, Link } from 'lucide-react';
import type { Address, Chain } from './types';

// IMPORTANT: Create a .env.local file in the root of your project and add your Alchemy API Key.
// NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
// You can get a free key from https://www.alchemy.com/
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'docs-demo'; // Using a public demo key
export const COVALENT_API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY || 'cqt_rQGycVGpwMdrqGbgJCTT7tQcmG6W'; // Using a public demo key

// --- ICONS ---
export const EthIcon = ({ className }: { className?: string }): React.ReactElement => (
    React.createElement('svg', { className, viewBox: "0 0 32 32", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement('path', { d: "M16 3L15.91 11.01L22.31 14.19L16 3Z", fill: "#343434" }),
        React.createElement('path', { d: "M16 3L9.69 14.19L15.91 11.01L16 3Z", fill: "#8C8C8C" }),
        React.createElement('path', { d: "M16 22.48L15.91 29L22.31 15.68L16 22.48Z", fill: "#3C3C3B" }),
        React.createElement('path', { d: "M16 29L16 22.48L9.69 15.68L16 29Z", fill: "#8C8C8C" }),
        React.createElement('path', { d: "M15.91 11.01L22.31 14.19L16 22.48L15.91 11.01Z", fill: "#141414" }),
        React.createElement('path', { d: "M9.69 14.19L15.91 11.01L16 22.48L9.69 14.19Z", fill: "#393939" })
    )
);

export const UsdcIcon = ({ className }: { className?: string }): React.ReactElement => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" },
        React.createElement('path', { fill: "#2775CA", d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.22 15.15c-1.63 0-2.95-1.32-2.95-2.95s1.32-2.95 2.95-2.95c.58 0 1.12.18 1.57.47l.45.24v-2.22c0-.6.49-1.09 1.09-1.09h.01c.6 0 1.09.49 1.09 1.09v4.29c0 .44-.27.83-.67.99l-.49.2c-.63.26-1.32.41-2.05.41zm1.22-3.8c0-.91-.74-1.65-1.65-1.65s-1.65.74-1.65 1.65.74 1.65 1.65 1.65c.34 0 .66-.1.91-.28v-1.37z" })
    )
);

export const UsdtIcon = ({ className }: { className?: string }): React.ReactElement => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" },
        React.createElement('circle', { cx: "12", cy: "12", r: "10", fill: "#26A17B" }),
        React.createElement('path', { d: "M11.14 15.54h1.72v-2.43h2.15v-1.5H12.86V9.57h2.17V8.06H8.97v1.51h2.17v2.04H8.97v1.5h2.17v2.43z", fill: "white" })
    )
);

export const BtcIcon = ({ className }: { className?: string }): React.ReactElement => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" },
        React.createElement('path', { 
            fill: "#F7931A", 
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.84 14.61c-.93.62-2.3.98-3.6.98-1.52 0-2.5-.48-2.5-1.34 0-.74.7-1.14 1.83-1.5l1.43-.48c1.3-.43 1.99-1.03 1.99-2.23 0-1.12-.83-1.99-2.2-1.99-1.03 0-1.77.3-2.33.64l-.48.27v-1.7c.6-.27 1.48-.54 2.53-.54 1.57 0 2.58.5 2.58 1.45 0 .72-.63 1.18-1.73 1.54l-1.5.48c-1.2.4-1.8.98-1.8 2.12 0 1.2.9 2.04 2.38 2.04 1.15 0 1.93-.33 2.48-.69l.44-.28v1.71c-.54.3-1.55.6-2.68.6z"
        })
    )
);

// --- ABIs ---
export const CHAINLINK_FEED_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;


// --- CHAIN CONFIGURATIONS ---
export const CHAIN_CONFIG: { [chainId: number|string]: Chain } = {
  1: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    nativeAsset: { name: 'Ether', symbol: 'ETH', decimals: 18, priceFeedAddress: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', priceFeedDecimals: 8, icon: EthIcon },
    knownTokens: {
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': { usdPrice: 0, icon: EthIcon, priceFeedAddress: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', priceFeedDecimals: 8 },
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': { usdPrice: 0, icon: UsdcIcon, priceFeedAddress: '0x8fFfFfd4AfB6115b954FeB255E57fb92426d543e', priceFeedDecimals: 8 },
      '0x514910771AF9Ca656af840dff83E8264EcF986CA': { usdPrice: 0, icon: Link, priceFeedAddress: '0x2c1d072e956AFFC0D435Cb7AC08f265e8d83c217', priceFeedDecimals: 8 },
    }
  },
  137: {
    id: 137,
    name: 'Polygon',
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    nativeAsset: { name: 'Matic', symbol: 'MATIC', decimals: 18, priceFeedAddress: '0xAB594600376Ec9fD91F8e885dADFCE03795DEb23', priceFeedDecimals: 8, icon: Wallet },
    knownTokens: {
      // WMATIC
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270': { usdPrice: 0, icon: Wallet, priceFeedAddress: '0xAB594600376Ec9fD91F8e885dADFCE03795DEb23', priceFeedDecimals: 8 },
      // USDT (Tether)
      '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': { usdPrice: 0, icon: UsdtIcon, priceFeedAddress: '0x0A6513e40db6EB1b165753AD52E80663aeA50545', priceFeedDecimals: 8 },
      // USDC (Bridged)
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': { usdPrice: 0, icon: UsdcIcon, priceFeedAddress: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7', priceFeedDecimals: 8 },
      // USDC (Native)
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359': { usdPrice: 0, icon: UsdcIcon, priceFeedAddress: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7', priceFeedDecimals: 8 },
    }
  },
  'btc': {
    id: 'btc',
    name: 'Bitcoin',
    rpcUrl: '', // Not applicable for Covalent
    nativeAsset: { name: 'Bitcoin', symbol: 'BTC', decimals: 8, icon: BtcIcon },
    knownTokens: {}
  },
  42161: {
    id: 42161,
    name: 'Arbitrum',
    rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    nativeAsset: { name: 'Ether', symbol: 'ETH', decimals: 18, priceFeedAddress: '0x639Fe6ab55C921f7487B2017Aed6Ab6Ca32Fe540', priceFeedDecimals: 8, icon: EthIcon },
    knownTokens: {
      '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': { usdPrice: 0, icon: EthIcon, priceFeedAddress: '0x639Fe6ab55C921f7487B2017Aed6Ab6Ca32Fe540', priceFeedDecimals: 8 },
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': { usdPrice: 0, icon: UsdcIcon, priceFeedAddress: '0x50834F3163758fcC1Df9973b6e91f0b0F0434AD3', priceFeedDecimals: 8 },
    }
  }
};

export const SUPPORTED_CHAINS = Object.values(CHAIN_CONFIG);

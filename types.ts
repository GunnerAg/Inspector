export type Address = `0x${string}`;

export interface Asset {
  contractAddress: Address | null; // null for native asset
  name: string;
  symbol: string;
  decimals: number;
  logo: string | null;
  balance: bigint;
  icon: React.ComponentType<{ className?: string }>;
  usdPrice?: number;
  usdValue?: number;
  priceFeedAddress?: Address;
  priceFeedDecimals?: number;
}

export interface Chain {
    id: number | string;
    name: string;
    rpcUrl: string;
    nativeAsset: Omit<Asset, 'balance' | 'usdValue' | 'contractAddress' | 'logo'>;
    knownTokens: { [key: Address]: Omit<Asset, 'balance' | 'usdValue' | 'contractAddress' | 'logo' | 'name' | 'symbol' | 'decimals'> };
}

export interface Token {
  name: string;
  symbol: string;
  address: Address;
  decimals: number;
  priceFeedAddress: Address;
  priceFeedDecimals: number;
  icon: React.ComponentType<{ className?: string }>;
}

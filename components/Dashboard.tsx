import React from 'react';
import { BarChart, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { formatUnits, formatCurrency } from '@/utils/format';
import type { Asset, Chain } from '@/types';

const AssetRow = ({ asset }: { asset: Asset }) => {
  const Icon = asset.icon;
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-150">
      <td className="p-4 flex items-center gap-4">
        {asset.logo ? <img src={asset.logo} alt={`${asset.name} logo`} className="h-8 w-8 rounded-full bg-gray-700" /> : <Icon className="h-8 w-8" />}
        <div>
          <div className="font-semibold">{asset.name}</div>
          <div className="text-sm text-gray-400">{asset.symbol}</div>
        </div>
      </td>
      <td className="p-4 text-right font-mono">{formatUnits(asset.balance, asset.decimals, 4)}</td>
      <td className="p-4 text-right font-mono">{typeof asset.usdPrice === 'number' ? formatCurrency(asset.usdPrice) : <span className="text-gray-500">N/A</span>}</td>
      <td className="p-4 text-right font-mono font-semibold text-lg">{typeof asset.usdValue === 'number' ? formatCurrency(asset.usdValue) : <span className="text-gray-500">N/A</span>}</td>
    </tr>
  );
};

const AssetListSkeleton = () => (
    <>
        {[...Array(4)].map((_, i) => (
          <tr key={i} className="border-b border-gray-700">
            <td className="p-4 flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
                <div>
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-12 bg-gray-700 rounded animate-pulse"></div>
                </div>
            </td>
            <td className="p-4 text-right"><div className="h-5 w-32 bg-gray-700 rounded animate-pulse ml-auto"></div></td>
            <td className="p-4 text-right"><div className="h-5 w-24 bg-gray-700 rounded animate-pulse ml-auto"></div></td>
            <td className="p-4 text-right"><div className="h-6 w-28 bg-gray-700 rounded animate-pulse ml-auto"></div></td>
          </tr>
        ))}
    </>
);


interface DashboardProps {
    isLoading: boolean;
    assets: Asset[];
    totalValue: number;
    chain: Chain;
    inspectedAddress: string;
}

export function Dashboard({ isLoading, assets, totalValue, chain, inspectedAddress }: DashboardProps) {
    if (!inspectedAddress) {
        return (
            <div className="text-center py-16">
                 <BarChart className="mx-auto h-16 w-16 text-gray-600"/>
                 <h2 className="mt-4 text-xl font-semibold">Ready to Inspect</h2>
                 <p className="mt-2 text-gray-400">Enter a wallet address above to see its assets.</p>
            </div>
        );
    }
    
    const hasAssets = assets.length > 0;
  
    return (
    <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Asset Overview</h1>
                <p className="text-gray-400">
                    Portfolio for <span className="font-mono text-indigo-400">{`${inspectedAddress.slice(0,6)}...${inspectedAddress.slice(-4)}`}</span> on {chain.name}
                </p>
            </div>
            <div className="text-right">
                <div className="text-sm text-gray-400">Total Value</div>
                <div className="text-3xl font-bold text-green-400">{formatCurrency(totalValue)}</div>
            </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="p-4 font-semibold">Asset</th>
                            <th className="p-4 font-semibold text-right">Balance</th>
                            <th className="p-4 font-semibold text-right">Price (USD)</th>
                            <th className="p-4 font-semibold text-right">Value (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <AssetListSkeleton /> : (
                            hasAssets ? (
                                assets.map(asset => <AssetRow key={`${asset.contractAddress}-${asset.symbol}`} asset={asset} />)
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8">
                                        <BarChart className="mx-auto h-12 w-12 text-gray-500"/>
                                        <p className="mt-4 text-gray-400">No ERC-20 tokens found for this address on {chain.name}.</p>
                                        <p className="text-sm text-gray-500">They may still have a native balance or NFTs.</p>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        <footer className="text-center mt-8 text-sm text-gray-500">
            Asset data from <a href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Alchemy</a>.
            Price data from <a href="https://chain.link/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Chainlink</a>.
        </footer>
    </div>
  );
}
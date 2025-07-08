'use client';

import React, { useState, useCallback } from 'react';
import { Search, Wallet, AlertTriangle } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { CHAIN_CONFIG, SUPPORTED_CHAINS , COVALENT_API_KEY, BtcIcon} from '@/constants';
import type { Address, Asset } from '@/types';
import { formatUnits } from '@/utils/format';

const isValidEVMAddress = (address: string): address is Address => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const isValidBitcoinAddress = (address: string): address is Address => {
    // This regex handles P2PKH, P2SH, Bech32, and Bech32m addresses.
    return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/.test(address);
}

// Helper to safely parse JSON and provide better error messages
const safeParseJson = async (response: Response) => {
    const text = await response.text();
    if (!response.ok) {
        // Log the full error text from the API if not successful
        console.error("API Error Response:", text);
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON:", text);
        // Throw a more informative error
        throw new Error(`Received invalid JSON from API. Response starts with: "${text.slice(0, 100)}..."`);
    }
};

export default function HomePage() {
    const [inputValue, setInputValue] = useState<string>('');
    const [chainId, setChainId] = useState<number | string>(SUPPORTED_CHAINS[0].id);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [inspectedAddress, setInspectedAddress] = useState<string>('');

    const handleInspect = useCallback(async () => {
        let addressToInspect = inputValue.trim();
        if (!addressToInspect) return;

        setIsLoading(true);
        setError(null);
        setAssets([]);
        setTotalValue(0);
        setInspectedAddress('');

        try {
            // Handle Bitcoin separately by its string ID
            if (chainId === 'btc') {
                if (addressToInspect.endsWith('.eth')) {
                    throw new Error('ENS names are not supported for Bitcoin. Please enter a valid Bitcoin address.');
                }
                if (!isValidBitcoinAddress(addressToInspect)) {
                    throw new Error('Please enter a valid Bitcoin address.');
                }
                setInspectedAddress(addressToInspect);

                const covalentUrl = `https://api.covalenthq.com/v1/btc-mainnet/address/${addressToInspect}/balances_v2/?key=${COVALENT_API_KEY}`;
                const data = await safeParseJson(await fetch(covalentUrl));
                const btcData = data.data.items.find((item: any) => item.contract_ticker_symbol === 'BTC');

                let finalAssets: Asset[] = [];
                if (btcData) {
                    finalAssets.push({
                        contractAddress: null,
                        name: 'Bitcoin',
                        symbol: 'BTC',
                        decimals: 8,
                        logo: btcData.logo_url,
                        balance: BigInt(btcData.balance),
                        icon: BtcIcon,
                        usdPrice: btcData.quote_rate,
                        usdValue: btcData.quote
                    });
                }

                setAssets(finalAssets);
                setTotalValue(btcData?.quote || 0);

            } else { // Handle EVM chains
                // 1. Resolve ENS if needed
                if (addressToInspect.endsWith('.eth')) {
                    try {
                        const mainnetRpcUrl = CHAIN_CONFIG[1].rpcUrl;
                        const res = await fetch(mainnetRpcUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'alchemy_resolveName', params: [addressToInspect] })
                        });
                        const data = await safeParseJson(res);
                        if (data.result && isValidEVMAddress(data.result)) {
                            addressToInspect = data.result;
                        } else {
                            throw new Error(`Could not resolve ENS name: ${inputValue.trim()}`);
                        }
                    } catch (e) {
                        setError(e instanceof Error ? e.message : 'Failed to resolve ENS name.');
                        setIsLoading(false);
                        return;
                    }
                }

                // 2. Validate address
                if (!isValidEVMAddress(addressToInspect)) {
                    setError('Please enter a valid Ethereum address or .eth name.');
                    setIsLoading(false);
                    return;
                }
                setInspectedAddress(addressToInspect);

                // For EVM chains, find the config safely
                const chain = SUPPORTED_CHAINS.find(c => c.id.toString() === chainId.toString());
                if (!chain) throw new Error('Unsupported chain selected');

                // Existing EVM logic
                const nativeBalanceRes = await fetch(chain.rpcUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [addressToInspect, 'latest'] })
                });
                const nativeBalanceData = await safeParseJson(nativeBalanceRes);
                const nativeBalance = BigInt(nativeBalanceData.result || '0');

                // 4. Get all token balances from Covalent
                const covalentUrl = `https://api.covalenthq.com/v1/${chain.id}/address/${addressToInspect}/balances_v2/?key=${COVALENT_API_KEY}`;
                const tokenBalancesRes = await fetch(covalentUrl);
                const tokenBalancesData = await safeParseJson(tokenBalancesRes);
                const tokenBalances = tokenBalancesData.data.items || [];

                // 5. Assemble final asset list
                let finalAssets: Asset[] = [];
                let currentTotalValue = 0;

                // Add native asset
                const nativeUsdPrice = tokenBalances.find((t: any) => t.native_token)?.quote_rate;
                const nativeUsdValue = nativeUsdPrice ? parseFloat(formatUnits(nativeBalance, chain.nativeAsset.decimals)) * nativeUsdPrice : undefined;
                if (nativeBalance > BigInt(0)) {
                    finalAssets.push({
                        ...chain.nativeAsset,
                        contractAddress: null,
                        logo: null,
                        balance: nativeBalance,
                        usdPrice: nativeUsdPrice,
                        usdValue: nativeUsdValue
                    });
                    if (nativeUsdValue) currentTotalValue += nativeUsdValue;
                }

                // Add other tokens
                for (const token of tokenBalances) {
                    if (token.native_token) continue; // Already handled
                    const balance = BigInt(token.balance || '0');
                    if (balance === BigInt(0)) continue;

                    finalAssets.push({
                        contractAddress: token.contract_address,
                        name: token.contract_name,
                        symbol: token.contract_ticker_symbol,
                        decimals: token.contract_decimals,
                        logo: token.logo_url,
                        balance,
                        icon: Wallet, // We can use a default icon for now
                        usdPrice: token.quote_rate,
                        usdValue: token.quote,
                    });
                    if (token.quote) currentTotalValue += token.quote;
                }

                setAssets(finalAssets.sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0)));
                setTotalValue(currentTotalValue);
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, chainId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900/30 text-white font-sans">
            <header className="p-4 flex justify-between items-center border-b border-white/10 shadow-md flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                        <Wallet size={24}/>
                    </div>
                    <h1 className="text-xl font-bold">Crypto Address Inspector</h1>
                </div>
            </header>
            <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <div className="bg-gray-800/50 rounded-lg shadow-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
                    <h2 className="text-2xl font-bold mb-4">Inspect an Address</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <div className="flex-grow w-full">
                            <label htmlFor="address-input" className="block text-sm font-medium text-gray-300 mb-1">
                                Wallet Address or ENS Name
                            </label>
                            <input
                                id="address-input"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="0x... or vitalik.eth"
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                            />
                        </div>
                        <div className="w-full sm:w-auto">
                           <label htmlFor="chain-select" className="block text-sm font-medium text-gray-300 mb-1">
                                Network
                            </label>
                            <select
                                id="chain-select"
                                value={chainId}
                                onChange={(e) => setChainId(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                {SUPPORTED_CHAINS.map(chain => (
                                    <option key={chain.id} value={chain.id}>{chain.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleInspect}
                            disabled={isLoading || !inputValue}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isLoading ? 'Inspecting...' : <><Search size={18} /><span>Inspect</span></>}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 flex items-center gap-3">
                            <AlertTriangle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <Dashboard
                    isLoading={isLoading}
                    assets={assets}
                    totalValue={totalValue}
                    chain={CHAIN_CONFIG[chainId]}
                    inspectedAddress={inspectedAddress}
                />
            </main>
        </div>
    );
}

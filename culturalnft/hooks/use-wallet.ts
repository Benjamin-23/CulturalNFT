"use client";

import { useState, useEffect, useCallback } from "react";
import { hederaClient } from "@/lib/hedera-client";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isLoading: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    isLoading: false,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await hederaClient.connectWallet();

      setState({
        isConnected: true,
        address: result.address,
        balance: result.balance,
        chainId: result.chainId,
        isLoading: false,
        error: null,
      });

      return result;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to connect wallet",
      }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    hederaClient.disconnect();
    setState({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!state.address) return;

    try {
      const balance = await hederaClient.getBalance(state.address);
      setState((prev) => ({ ...prev, balance }));
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  }, [state.address]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (hederaClient.isConnected()) {
        try {
          const address = await hederaClient.getConnectedAddress();
          const balance = await hederaClient.getBalance();

          if (address && balance) {
            setState({
              isConnected: true,
              address,
              balance,
              chainId: 296, // Hedera testnet
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    ...state,
    connectWallet,
    disconnect,
    refreshBalance,
  };
}

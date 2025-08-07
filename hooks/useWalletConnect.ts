// UI/hooks/useWalletConnect.ts
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit-ethers-react-native';

export function useWalletConnect() {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAppKitAccount();

  return {
    connect: open,
    disconnect,
    account: address,
    isConnected,
  };
}
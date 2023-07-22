import type { AppProps } from 'next/app'
import './globals.css'


import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


// import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { publicProvider } from 'wagmi/providers/public';
const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'fa5582baced37e7c9cb4fa0686ec80fe',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}
        theme={darkTheme({
          accentColor: '#602FE8',
          accentColorForeground: "white",
          borderRadius: "medium"
        })}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
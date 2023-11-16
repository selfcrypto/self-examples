import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect, useState } from "react";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  connectors: [new InjectedConnector()],
});

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={config}>
      {mounted && <Component {...pageProps} />}
    </WagmiConfig>
  );
}

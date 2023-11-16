import IframeRenderer from "@/components/IFrameRenderer";
import { Address, useAccount, useConnect } from "wagmi";

export default function Home() {
  const { connect, connectors } = useConnect();
  const { isConnected, isDisconnected, address, connector } = useAccount();
  return (
    <div
      style={{
        width: "full",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <button
        style={{
          backgroundColor: "black",
          color: "white",
          padding: 10,
        }}
        onClick={() => {
          isDisconnected && connectors && connect({ connector: connectors[0] });
        }}
      >
        {isConnected ? address : "Connect"}
      </button>

      <IframeRenderer
        address={address as Address}
        isInjectedWallet={
          connector?.id === "injected" || connector?.id === "eip6963"
        }
      />
    </div>
  );
}

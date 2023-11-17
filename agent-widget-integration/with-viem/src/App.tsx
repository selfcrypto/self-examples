import "./App.css";
import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { bsc } from "viem/chains";
import IframeRenderer from "./components/IframeRenderer";

declare let window: any;

// create wallet client to interact with the wallet
const walletClient = createWalletClient({
  chain: bsc,
  transport: custom(window.ethereum),
});

function App() {
  const [address, setAddress] = useState("");

  // connect to the wallet
  const connectWallet = async () => {
    // check if the wallet is already connected
    if (address) return;

    if (window.ethereum) {
      try {
        // request account access if needed
        await walletClient.requestAddresses();
        // get address of the currently connected account
        const [address] = await walletClient.getAddresses();
        setAddress(address);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // listen to account changes
  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;
    // event fired when the currently connected account changes from wallet
    ethereum.on("accountsChanged", () => connectWallet());

    // remove listener when the component is unmounted
    return () => ethereum.off("accountsChanged", () => connectWallet());
  }, []);

  const disconnectWallet = () => {
    setAddress("");
  };

  // connect wallet when the app is loaded for the first time
  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
      <nav className="navbar">
        {address && <button onClick={disconnectWallet}>Disconnect</button>}

        <button onClick={connectWallet} disabled={!!address}>
          {!address
            ? "Connect Wallet"
            : `${address.slice(0, 7)}...${address.slice(-5)}`}
        </button>
      </nav>
      <div className="container">
        <h1 className="title">$Self integration example using Viem</h1>

        {/* just pass connected address in IframeRenderer and you are good to go */}
        {/* since we created walletClient using window.ethereum, isInjectedWallet will be true  */}
        {/* you may place your own checks if you are using viem in combination with another wallet connection solution.
            For wagmi + viem example, check out our other example */}

        <IframeRenderer address={address} isInjectedWallet={true} />
      </div>
    </div>
  );
}

export default App;

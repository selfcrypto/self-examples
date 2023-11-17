import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import IframeRenderer from "./components/IframeRenderer";

declare let window: any;

function App() {
  const [address, setAddress] = useState("");
  const [, setProvider] = useState<ethers.BrowserProvider>();
  const [, setSigner] = useState<ethers.JsonRpcSigner>();

  // connect to the wallet
  const connectWallet = useCallback(async () => {
    // check if the wallet is already connected
    if (address) return;

    if (window.ethereum) {
      try {
        // request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // get address of the currently connected account

        const provider = new ethers.BrowserProvider(window.ethereum);
        // for ethers js v5, use the following line instead
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const accAddress = await signer.getAddress();
        setAddress(accAddress);
        setProvider(provider);
        setSigner(signer);
      } catch (err) {
        console.error(err);
      }
    }
  }, [address]);

  // listen to account changes
  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;
    // event fired when the currently connected account changes from wallet
    ethereum.on("accountsChanged", () => connectWallet());

    // remove listener when the component is unmounted
    return () => ethereum.off("accountsChanged", () => connectWallet());
  }, [connectWallet]);

  const disconnectWallet = () => {
    setAddress("");
    setProvider(undefined);
    setSigner(undefined);
  };

  // connect wallet when the app is loaded for the first time
  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

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
        <h1 className="title">$Self integration example using ethers.js</h1>

        {/* ethers js only implements injected wallet */}
        {/* just pass connected address in IframeRenderer and you are good to go */}
        <IframeRenderer address={address} isInjectedWallet={true} />
      </div>
    </div>
  );
}

export default App;

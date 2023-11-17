import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import IframeRenderer from "./comonents/IframeRenderer";

declare let window: any;

function App() {
  const [address, setAddress] = useState("");

  // connect to the wallet
  const connectWallet = async () => {
    // check if the wallet is already connected
    if (address) return;

    if (window.ethereum) {
      try {
        // request account access if needed
        await window.ethereum.enable();
        // get address of the currently connected account
        const web3 = new Web3(window.ethereum || window.web3.currentProvider);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
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
    ethereum.on("accountsChanged", () => address && connectWallet());

    // remove listener when the component is unmounted
    return () => ethereum.off("accountsChanged", () => connectWallet());
  }, [address]);

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
        <h1 className="title">$Self integration example using ethers.js</h1>

        {/* ethers js only implements injected wallet */}
        {/* just pass connected address in IframeRenderer and you are good to go */}
        <IframeRenderer address={address} isInjectedWallet={true} />
      </div>
    </div>
  );
}

export default App;

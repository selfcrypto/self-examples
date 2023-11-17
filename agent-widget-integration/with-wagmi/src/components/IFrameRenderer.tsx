import { useEffect } from "react";
import { Address } from "viem";

// Constants for widget URL and agent address
const WIDGET_URL = "https://self-agent-widget.vercel.app/";
const AGENT_ADDRESS = "0x7ffffd377d0030d3a7c558f67407f0ec2c426537";

// TypeScript interface for the component's props
interface IframeRendererProps {
  isInjectedWallet: boolean;
  address: Address;
}

// The IframeRenderer component
const IframeRenderer: React.FC<IframeRendererProps> = ({
  isInjectedWallet,
  address,
}) => {
  useEffect(() => {
    // If wallet is not connected, don't send the message
    // If there is no injected wallet, do nothing
    if (!address || !isInjectedWallet) return;

    // wait 2 seconds for the wallet to be connected and iframe to be ready
    // send a message to the iframe
    const timer = setTimeout(() => {
      // message contains address of the currently connected account whenever it changes
      // This is to sync the account in parent with the account in the widget
      document
        .querySelector("iframe")
        ?.contentWindow?.postMessage(
          { type: "updateAccount", account: address },
          "*"
        );
    }, 2000);

    // Clear the timeout when the component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [address, isInjectedWallet]);

  // Render the iframe element
  return (
    <iframe
      height={700}
      width={400}
      src={`${WIDGET_URL}?agent=${AGENT_ADDRESS}`}
      // TODO: Replace the src attribute with the URL of the iframe if needed
    />
  );
};

export default IframeRenderer;

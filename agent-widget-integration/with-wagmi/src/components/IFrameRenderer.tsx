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
    // If there is no injected wallet, do nothing
    if (!isInjectedWallet) return;
    if (!address) return;

    // Set a timeout to send a message to the iframe
    const timer = setTimeout(() => {
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

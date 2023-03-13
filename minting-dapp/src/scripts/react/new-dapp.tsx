import React, { useEffect } from "react";

import CollectionStatus from "./CollectionStatus";
import Whitelist from "../lib/Whitelist";
import { useDappWeb3 } from "../../contexts/dapp-web3.context";
import Button from "../../components/styled/button";

export const NewDapp: React.FC<{}> = ({}) => {
  const {
    state,
    setState,
    provider,
    isNotMainnet,
    isContractReady,
    setError,
    isWalletConnected,
    connectWallet,
    generateContractUrl,
  } = useDappWeb3();

  const [merkleProofManualAddressInput, setMerkleProofManualAddressInput] =
    React.useState<HTMLInputElement | null>(null);

  const copyMerkleProofToClipboard = () => {
    const proof = Whitelist.getProofForAddress(
      state.userAddress ?? state.merkleProofManualAddress
    );

    if (proof.length < 1) {
      setState((prev) => {
        return {
          ...prev,
          merkleProofManualAddressFeedbackMessage:
            "The given address is not in the whitelist, please double-check.",
        };
      });

      return;
    }

    navigator.clipboard.writeText(JSON.stringify(proof));

    setState((prev) => {
      return {
        ...prev,
        merkleProofManualAddressFeedbackMessage: (
          <>
            <strong>Congratulations!</strong> <span className="emoji">🎉</span>
            <br />
            Your Merkle Proof <strong>has been copied to the clipboard</strong>.
            You can paste it into{" "}
            <a href={generateContractUrl()} target="_blank">
              {prev.networkConfig.blockExplorer.name}
            </a>{" "}
            to claim your tokens.
          </>
        ),
      };
    });
  };

  return (
    <>
      {state.errorMessage && (
        <div className="error">
          <p>{state.errorMessage}</p>
          <button onClick={() => setError()}>Close</button>
        </div>
      )}

      {isWalletConnected() && (
        <>
          {isContractReady() ? (
            <CollectionStatus
              userAddress={state.userAddress}
              maxSupply={state.maxSupply}
              totalSupply={state.totalSupply}
              isPaused={state.isPaused}
              isWhitelistMintEnabled={state.isWhitelistMintEnabled}
              isUserInWhitelist={state.isUserInWhitelist}
            />
          ) : (
            <div className="collection-not-ready">
              <svg
                className="spinner"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading collection data...
            </div>
          )}
        </>
      )}

      {!isWalletConnected() || !isNotMainnet() ? (
        <div className="no-wallet">
          <div className="use-block-explorer">
            Hey, looking for a <strong>super-safe experience</strong>?{" "}
            <span className="emoji">😃</span>
            <br />
            You can interact with the smart-contract <strong>
              directly
            </strong>{" "}
            through{" "}
            <a href={generateContractUrl()} target="_blank">
              {state.networkConfig.blockExplorer.name}
            </a>
            , without even connecting your wallet to this DAPP!{" "}
            <span className="emoji">🚀</span>
            <br />
            <br />
            Keep safe! <span className="emoji">❤️</span>
          </div>
          {!isWalletConnected() && (
            <Button
              className="primary"
              disabled={provider === undefined}
              onClick={() => connectWallet()}
            >
              Connect Wallet
            </Button>
          )}

          {/* {!isWalletConnected() || state.isWhitelistMintEnabled ? (
            <div className="merkle-proof-manual-address">
              <h2>Whitelist Proof</h2>
              <p>
                Anyone can generate the proof using any public address in the
                list, but <strong>only the owner of that address</strong> will
                be able to make a successful transaction by using it.
              </p>
              {state.merkleProofManualAddressFeedbackMessage ? (
                <div className="feedback-message">
                  {state.merkleProofManualAddressFeedbackMessage}
                </div>
              ) : null}
              <label htmlFor="merkle-proof-manual-address">
                Public address:
              </label>
              <input
                id="merkle-proof-manual-address"
                type="text"
                placeholder="0x000..."
                disabled={state.userAddress !== null}
                value={state.userAddress ?? state.merkleProofManualAddress}
                ref={(input) => setMerkleProofManualAddressInput(input!)}
                onChange={() => {
                  setState((prev) => {
                    if (!merkleProofManualAddressInput) return prev;

                    return {
                      ...prev,
                      merkleProofManualAddress:
                        merkleProofManualAddressInput.value,
                    };
                  });
                }}
              />{" "}
              <button onClick={() => copyMerkleProofToClipboard()}>
                Generate and copy to clipboard
              </button>
            </div>
          ) : null} */}
        </div>
      ) : null}
    </>
  );
};

import { utils, BigNumber } from "ethers";
import React from "react";
import previewImg from "../../assets/images/preview.png";
import { ButtonDark } from "../../components/styled/button";
import styled from "styled-components";

interface Props {
  maxSupply: number;
  totalSupply: number;
  tokenPrice: BigNumber;
  maxMintAmountPerTx: number;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  mintTokens(mintAmount: number): Promise<void>;
  whitelistMintTokens(mintAmount: number): Promise<void>;
}

interface State {
  mintAmount: number;
}

const defaultState: State = {
  mintAmount: 1,
};

const Img = styled.img`
  width: 100%;
  max-height: 320px;
  max-width: 480px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 320px) {
    width: 100%;
    max-height: 100%;
  }
`;
const IDButton = styled.button`
  background-color: ${(props) => props.theme.text};
  border-width: 0;
  color: ${(props) => props.theme.body};
  text-decoration: none;
  padding: 0.5rem 2rem;
  font-size: 1rem;
  max-width: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;

  .mint-amount {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => props.theme.text};
  }

  .controls-amount {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
  }
`;

const Preview = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private incrementMintAmount(): void {
    this.setState({
      mintAmount: Math.min(
        this.props.maxMintAmountPerTx,
        this.state.mintAmount + 1
      ),
    });
  }

  private decrementMintAmount(): void {
    this.setState({
      mintAmount: Math.max(1, this.state.mintAmount - 1),
    });
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(this.state.mintAmount);

      return;
    }

    await this.props.whitelistMintTokens(this.state.mintAmount);
  }

  render() {
    return (
      <>
        {this.canMint() ? (
          <div className="mint-widget">
            <Preview className="preview">
              <Img src={previewImg} alt="Collection preview" />
            </Preview>

            <div className="price">
              <strong>Total price:</strong>{" "}
              {utils.formatEther(
                this.props.tokenPrice.mul(this.state.mintAmount)
              )}{" "}
              ETH
            </div>

            <Controls className="controls">
              <div className="controls-amount">
                <IDButton
                  className="decrease"
                  onClick={() => this.decrementMintAmount()}
                >
                  -
                </IDButton>

                <span className="mint-amount">{this.state.mintAmount}</span>

                <IDButton
                  className="increase"
                  onClick={() => this.incrementMintAmount()}
                >
                  +
                </IDButton>
              </div>
              <ButtonDark className="primary" onClick={() => this.mint()}>
                Mint
              </ButtonDark>
            </Controls>
          </div>
        ) : (
          <div className="cannot-mint">
            <span className="emoji">⏳</span>
            {this.props.isWhitelistMintEnabled ? (
              <>
                You are not included in the <strong>whitelist</strong>.
              </>
            ) : (
              <>
                The contract is <strong>paused</strong>.
              </>
            )}
            <br />
            Please come back during the next sale!
          </div>
        )}
      </>
    );
  }
}

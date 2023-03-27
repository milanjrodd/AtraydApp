import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Me from "../assets/images/profile-img.png";
import Dapp from "../scripts/react/Dapp";
import { darkTheme, lightTheme, mediaQueries } from "../styles/Themes";
import { NewDapp } from "../scripts/react/new-dapp";
import { useDappWeb3 } from "../contexts/dapp-web3.context";
import MintWidget from "../scripts/react/MintWidget";
import CollectionConfig from "../../../smart-contract/config/CollectionConfig";

const Box = styled(motion.div)`
  width: 55vw;
  max-width: 1200px;
  display: flex;
  background: linear-gradient(
        to right,
        ${(props) => props.theme.body} 50%,
        ${(props) => props.theme.text} 50%
      )
      bottom,
    linear-gradient(
        to right,
        ${(props) => props.theme.body} 50%,
        ${(props) => props.theme.text} 50%
      )
      top;
  background-repeat: no-repeat;
  background-size: 100% 2px;

  border-left: 2px solid ${(props) => props.theme.body};
  border-right: 2px solid ${(props) => props.theme.text};

  z-index: 1;

  position: absolute;
  left: 50%;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
  overflow: hidden;

  ${mediaQueries(1200)`
    width: 65vw;
  `};

  ${mediaQueries(60)`
    width: 70vw;
  `};

  ${mediaQueries(50)`
    width: 50vw;
    background-size: 100% 2px;

    flex-direction:column;
    justify-content:space-between;
  
  `};

  ${mediaQueries(40)`
    width: 60vw;
  `};

  ${mediaQueries(30)`
    width: 70vw;
  `};
  ${mediaQueries(20)`
    width: 60vw;
  `};

  @media only screen and (max-width: 50em) {
    background: none;
    border: none;
    border-top: 2px solid ${(props) => props.theme.body};
    border-bottom: 2px solid ${(props) => props.theme.text};
    background-image: linear-gradient(
        ${(props) => props.theme.body} 50%,
        ${(props) => props.theme.text} 50%
      ),
      linear-gradient(
        ${(props) => props.theme.body} 50%,
        ${(props) => props.theme.text} 50%
      );
    background-size: 2px 100%;
    background-position: 0 0, 100% 0;
    background-repeat: no-repeat;
  }

  //height:55vh;
`;
const SubBox = styled(motion.div)`
  width: 50%;
  position: relative;
  display: flex;

  .pic {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
    height: auto;
  }
  ${mediaQueries(50)`
      width: 100%;
      .pic {
        width: 70%;  
      }

  `};

  ${mediaQueries(40)`
      .pic {
        width: 80%;
      }
  `};

  ${mediaQueries(30)`
      .pic {
        width: 90%;
      }
  `};
  ${mediaQueries(20)`
     .pic {
      width: 80%;
    }
 `};
`;

const Text = styled(motion.div)`
  font-size: 1rem;
  color: ${(props) => props.theme.body};
  padding: 2rem;
  word-wrap: anywhere;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;

  & > *:last-child {
    color: ${(props) => `rgba(${props.theme.bodyRgba},0.6)`};

    font-size: calc(1.5rem);
    font-weight: 300;

    ${mediaQueries(40)`
      font-size: calc(1.5rem);
    `};
  }

  ${mediaQueries(40)`
    font-size: calc(0.5rem - 0.2vw);
  `};

  ${mediaQueries(20)`
    padding: 0.1rem;
  `};
`;
const DarkText = styled(motion.div)`
  font-size: calc(1rem + 1.5vw);
  color: ${(props) => props.theme.text};
  padding: 2rem;
  padding-top: 0;
  word-wrap: anywhere;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  word-wrap: anywhere;
  width: 100%;

  & > *:last-child {
    font-size: calc(1.5rem);
    font-weight: 300;

    ${mediaQueries(40)`
      font-size: calc(0.5rem + 1vw);
    `};
  }

  ${mediaQueries(40)`
    font-size: calc(1rem + 1.5vw);
  `};

  ${mediaQueries(20)`
    padding: 1rem;
  `};
`;

const Intro: React.FC<{ click: boolean }> = () => {
  const [height, setHeight] = useState("55vh");
  const dappWeb3 = useDappWeb3();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 50em)").matches) {
      setHeight("70vh");
    }
    if (window.matchMedia("(max-width: 20em)").matches) {
      setHeight("60vh");
    }

    if (window.matchMedia("(min-width: 800px)").matches) {
      setIsMobile(true);
    }
  }, []);
  return (
    <Box
      initial={{ height: 0 }}
      animate={{ height: height }}
      transition={{ type: "spring", duration: 2, delay: 1 }}
    >
      <SubBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <Text>
          <NewDapp />
        </Text>
      </SubBox>
      <SubBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <DarkText>
          {dappWeb3.state.totalSupply < dappWeb3.state.maxSupply ? (
            <MintWidget
              maxSupply={dappWeb3.state.maxSupply}
              totalSupply={dappWeb3.state.totalSupply}
              tokenPrice={dappWeb3.state.tokenPrice}
              maxMintAmountPerTx={dappWeb3.state.maxMintAmountPerTx}
              isPaused={dappWeb3.state.isPaused}
              isWhitelistMintEnabled={dappWeb3.state.isWhitelistMintEnabled}
              isUserInWhitelist={dappWeb3.state.isUserInWhitelist}
              mintTokens={(mintAmount) => dappWeb3.mintTokens(mintAmount)}
              whitelistMintTokens={(mintAmount) =>
                dappWeb3.whitelistMintTokens(mintAmount)
              }
            />
          ) : (
            <div className="collection-sold-out">
              <h2>
                Tokens have been <strong>sold out</strong>!{" "}
                <span className="emoji">🥳</span>
              </h2>
              You can buy from our beloved holders on{" "}
              <a href={dappWeb3.generateMarketplaceUrl()} target="_blank">
                {CollectionConfig.marketplaceConfig.name}
              </a>
              .
            </div>
          )}
        </DarkText>
      </SubBox>
    </Box>
  );
};

export default Intro;

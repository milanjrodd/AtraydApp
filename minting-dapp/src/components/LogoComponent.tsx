import React from "react";
import styled from "styled-components";
import { darkTheme, mediaQueries } from "../styles/Themes";

const Logo = styled.h1`
  display: inline-block;
  color: ${(props) =>
    props.color === "dark" ? darkTheme.text : darkTheme.body};
  font-family: "Pacifico", cursive;

  position: fixed;
  left: 2rem;
  top: 2rem;
  z-index: 3;

  ${mediaQueries(40)`
    font-size:1.5em;
    left:1rem;
    top:2rem;
  `};
`;

interface ILogoProps {
  theme?: string;
}

const LogoComponent: React.FC<ILogoProps> = (props) => {
  return <Logo color={props.theme}>CB</Logo>;
};

export default LogoComponent;

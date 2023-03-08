import React from "react";
import styled from "styled-components";
import { darkTheme } from "../styles/Themes";

const Logo = styled.h1`
  display: inline-block;
  color: ${(props) =>
    props.color === "dark" ? darkTheme.text : darkTheme.body};
  font-family: "Pacifico", cursive;

  position: fixed;
  left: 2rem;
  top: 2rem;
  z-index: 3;
`;

interface ILogoProps {
  theme?: string;
}

const LogoComponent: React.FC<ILogoProps> = (props) => {
  return <Logo color={props.theme}>CB</Logo>;
};

export default LogoComponent;

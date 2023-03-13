import styled from "styled-components";

export const Button = styled.button`
  background-color: ${(props) => props.theme.body};
  border-width: 0;
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 0.5rem calc(2rem + 2vw);
  font-size: calc(1em + 0.5vw);
  width: 100%;
  cursor: pointer;
`;

export const ButtonDark = styled.button`
  background-color: ${(props) => props.theme.text};
  border-width: 0;
  color: ${(props) => props.theme.body};
  text-decoration: none;
  padding: 0.5rem calc(2rem + 2vw);
  font-size: calc(1em + 0.5vw);
  width: 100%;
  cursor: pointer;
`;

export default Button;

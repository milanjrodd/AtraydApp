import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { Github } from "./AllSvgs";
import { mediaQueries } from "../styles/Themes";

const Box = styled(motion.li)`
  width: 16rem;
  height: 40vh;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  padding: 1.5rem 2rem;
  margin-right: 8rem;
  border-radius: 0 50px 0 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${(props) => props.theme.body};

  transition: all 0.2s ease;
  &:hover {
    background-color: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    border: 1px solid ${(props) => props.theme.text};
  }

  ${mediaQueries(50)`
    width:16rem;
    margin-right:6rem;
    height:35vh;    
  `};
  ${mediaQueries(40)`
    width:14rem;
    margin-right:4rem;
    height:35vh;
  `};
  ${mediaQueries(25)`
    width:12rem;
    margin-right:4rem;
    height:35vh;
    padding:1.5rem 1.5rem;
  `};
  ${mediaQueries(20)`
    width:10rem;
    margin-right:4rem;
    height:40vh;
  `};
`;
const Title = styled.h2`
  font-size: calc(1em + 0.5vw);
`;

const Description = styled.h2`
  font-size: calc(0.8em + 0.3vw);

  font-family: "Karla", sans-serif;
  font-weight: 500;
  ${mediaQueries(25)`
    font-size:calc(0.7em + 0.3vw);
`};
  ${mediaQueries(20)`
    font-size:calc(0.6em + 0.3vw);
`};
`;
const Tags = styled.div`
  border-top: 2px solid ${(props) => props.theme.body};
  padding-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  ${Box}:hover & {
    border-top: 2px solid ${(props) => props.theme.text};
  }
`;
const Tag = styled.span`
  margin-right: 1rem;
  font-size: calc(0.8em + 0.3vw);

  ${mediaQueries(25)`
    font-size:calc(0.7em);
  `};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
`;

const Link = styled.a`
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 0.5rem calc(2rem + 2vw);
  border-radius: 0 0 0 50px;
  font-size: calc(1em + 0.5vw);

  ${Box}:hover & {
    background-color: ${(props) => props.theme.text};
    color: ${(props) => props.theme.body};
  }
`;

const Git = styled.a`
  color: inherit;
  text-decoration: none;

  ${Box}:hover & {
    & > * {
      fill: ${(props) => props.theme.text};
    }
  }
`;

// Framer motion configuration
const Item = {
  hidden: {
    scale: 0,
  },
  show: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
    },
  },
};

interface ICardProps {
  data: {
    id: number;
    name: string;
    description: string;
    tags: string[];
    demo: string;
    github: string;
  };
}

const Card: React.FC<ICardProps> = ({ data }) => {
  const { id, name, description, tags, demo, github } = data;

  return (
    <Box key={id} variants={Item}>
      <Title>{name}</Title>
      <Description>{description}</Description>
      <Tags>
        {tags.map((t, id) => {
          return <Tag key={id}>#{t}</Tag>;
        })}
      </Tags>
      <Footer>
        <Link href={demo} rel="noreferrer" target="_blank">
          Visit
        </Link>
        <Git href={github} rel="noreferrer" target="_blank">
          <Github width={30} height={30} />
        </Git>
      </Footer>
    </Box>
  );
};

export default Card;

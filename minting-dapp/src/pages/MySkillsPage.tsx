import React, { Suspense, lazy } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, mediaQueries } from "../styles/Themes";
import { Design, Develope } from "../components/AllSvgs";
import ParticleComponent from "../components/ParticleComponent";
import { motion } from "framer-motion";
import Loading from "../components/Loading";

const SocialIcons = lazy(() => import("../components/SocialIcons"));
const PowerButton = lazy(() => import("../components/PowerButton"));
const LogoComponent = lazy(() => import("../components/LogoComponent"));
const BigTitle = lazy(() => import("../components/BigTitlte"));

const Box = styled(motion.div)`
  background-color: ${(props) => props.theme.body};
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  ${mediaQueries(50)`
    flex-direction:column;  
    padding:8rem 0;
    height:auto;
    &>*:nth-child(5){
      margin-bottom:5rem;
    }
           
  `};
  ${mediaQueries(30)`
    &>*:nth-child(5){
      margin-bottom:4rem;
    }
  `};
`;

const Main = styled(motion.div)`
  border: 2px solid ${(props) => props.theme.text};
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.body};
  padding: 2rem;
  width: 30vw;
  height: 60vh;
  z-index: 3;
  line-height: 1.5;

  ${mediaQueries(60)`
    height: 55vh;
  `};

  ${mediaQueries(50)`
    width: 50vw;
    height: max-content;
  `};

  font-family: "Ubuntu Mono", monospace;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    color: ${(props) => props.theme.body};
    background-color: ${(props) => props.theme.text};
  }
`;

const Title = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc(1em + 1vw);

  ${mediaQueries(60)`
    font-size:calc(0.8em + 1vw);
  `};

  ${mediaQueries(50)`
    font-size:calc(1em + 2vw);
    margin-bottom:1rem;
  `};

  ${mediaQueries(30)`
    font-size:calc(1em + 1vw);
  `};
  ${mediaQueries(25)`
    font-size:calc(0.8em + 1vw);
    svg{
      width:30px;
      height:30px;
    }
  `};

  ${Main}:hover & {
    & > * {
      fill: ${(props) => props.theme.body};
    }
  }

  & > *:first-child {
    margin-right: 1rem;
  }
`;

const Description = styled.div`
  color: ${(props) => props.theme.text};
  font-size: calc(0.6em + 1vw);
  padding: 0.5rem 0;
  ${Main}:hover & {
    color: ${(props) => props.theme.body};
  }

  ${mediaQueries(50)`
    font-size: calc(0.8em + 1vw);

  `};

  ${mediaQueries(30)`
    font-size:calc(0.7em + 1vw);
  `};

  ${mediaQueries(25)`
    font-size:calc(0.5em + 1vw);
  `};

  strong {
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  ul,
  p {
    margin-left: 2rem;
  }
`;

const MySkillsPage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Suspense fallback={<Loading />}>
        <Box
          key="skills"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <LogoComponent theme="light" />
          <SocialIcons theme="light" />
          <PowerButton />
          <ParticleComponent theme="light" />
          <Main>
            <Title>
              <Design width={40} height={40} /> Designer
            </Title>
            <Description>
              I love to create design which speaks, Keep it clean, minimal and
              simple.
            </Description>
            <Description>
              <strong>I like to Design</strong>
              <ul>
                <li>Web Design</li>
                <li>Mobile Apps</li>
              </ul>
            </Description>
            <Description>
              <strong>Tools</strong>
              <ul>
                <li>Figma</li>
              </ul>
            </Description>
          </Main>
          <Main>
            <Title>
              <Develope width={40} height={40} /> Frontend Developer
            </Title>
            <Description>
              I value business or brand for which i'm creating, thus i enjoy
              bringing new ideas to life.
            </Description>
            <Description>
              <strong>Skills</strong>
              <p>
                Html, Css, Js, React, Redux, Sass, Bootstrap, Tailwind, Firebase
                etc.
              </p>
            </Description>
            <Description>
              <strong>Tools</strong>
              <p>VScode, Github, Codepen etc.</p>
            </Description>
          </Main>

          <BigTitle text="SKILLS" top="80%" right="30%" />
        </Box>
      </Suspense>
    </ThemeProvider>
  );
};

export default MySkillsPage;

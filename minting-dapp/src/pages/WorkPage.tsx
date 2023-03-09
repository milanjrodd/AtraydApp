import React, { Suspense, lazy, useEffect, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, mediaQueries } from "../styles/Themes";
import { motion } from "framer-motion";

import Card from "../components/Card";
import { YinYang } from "../components/AllSvgs";
import { Works } from "../data/WorkData";
import Loading from "../components/Loading";

const SocialIcons = lazy(() => import("../components/SocialIcons"));
const PowerButton = lazy(() => import("../components/PowerButton"));
const LogoComponent = lazy(() => import("../components/LogoComponent"));
const BigTitlte = lazy(() => import("../components/BigTitlte"));

const Box = styled(motion.div)`
  background-color: ${(props) => props.theme.body};

  height: 400vh;
  position: relative;
  display: flex;
  align-items: center;
`;

const Main = styled(motion.ul)`
  position: fixed;
  top: 12rem;
  left: calc(10rem + 15vw);

  height: 40vh;
  /* height:200vh; */
  //border:1px solid white;

  display: flex;

  ${mediaQueries(50)`
    left:calc(8rem + 15vw);
  `};

  ${mediaQueries(40)`
    top: 30%;
    left:calc(6rem + 15vw);
  `};

  ${mediaQueries(40)`  
    left:calc(2rem + 15vw);
  `};
  ${mediaQueries(25)`     
    left:calc(1rem + 15vw);
  `};
`;
const Rotate = styled.span`
  display: block;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: 80px;
  height: 80px;

  z-index: 1;
  ${mediaQueries(40)`
     width:60px;
         height:60px;   
       svg{
         width:60px;
         height:60px;
       }

  `};
  ${mediaQueries(25)`
        width:50px;
         height:50px;
        svg{
         width:50px;
         height:50px;
       }

  `};
`;

// Framer-motion Configuration
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.5,
      duration: 0.5,
    },
  },
};

const WorkPage = () => {
  const ref = useRef<HTMLUListElement>(null);
  const yinyang = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let element = ref.current;

    const rotate = () => {
      if (!yinyang.current) return;
      element.style.transform = `translateX(${-window.pageYOffset}px)`;

      return (yinyang.current.style.transform =
        "rotate(" + -window.pageYOffset + "deg)");
    };

    window.addEventListener("scroll", rotate);
    return () => {
      window.removeEventListener("scroll", rotate);
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        key="work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <LogoComponent theme="dark" />
        <PowerButton />
        <SocialIcons theme="dark" />
        <Suspense fallback={<Loading />}>
          <Main ref={ref} variants={container} initial="hidden" animate="show">
            {Works.map((work) => (
              <Card key={work.id} data={work} />
            ))}
          </Main>
        </Suspense>

        <BigTitlte text="WORK" top="10%" right="20%" />

        <Rotate ref={yinyang}>
          <YinYang width={80} height={80} fill={darkTheme.text} />
        </Rotate>
      </Box>
    </ThemeProvider>
  );
};

export default WorkPage;

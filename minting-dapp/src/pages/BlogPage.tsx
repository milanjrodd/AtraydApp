import React, { Suspense, lazy, useEffect, useState } from "react";
import styled from "styled-components";
import img from "../assets/images/patrick-tomasso-Oaqk7qqNh_c-unsplash.jpg";

import { Blogs } from "../data/BlogData";
import BlogComponent from "../components/BlogComponent";
import { motion } from "framer-motion";
import { mediaQueries } from "../styles/Themes";
import Loading from "../components/Loading";

const AnchorComponent = lazy(() => import("../components/Anchor"));
const SocialIcons = lazy(() => import("../components/SocialIcons"));
const PowerButton = lazy(() => import("../components/PowerButton"));
const LogoComponent = lazy(() => import("../components/LogoComponent"));
const BigTitle = lazy(() => import("../components/BigTitlte"));

const MainContainer = styled(motion.div)`
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
`;
const Container = styled.div`
  background-color: ${(props) => `rgba(${props.theme.bodyRgba},0.8)`};
  width: 100%;
  height: auto;

  position: relative;
  padding-bottom: 5rem;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10rem;

  ${mediaQueries(30)`
    padding-top: 7rem;
  `};
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(10rem + 15vw), 1fr));

  grid-gap: calc(1rem + 2vw);

  ${mediaQueries(50)`
    grid-template-columns: 100%;
  `};
`;

// Framer-motion config
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

const BlogPage = () => {
  const [numbers, setNumbers] = useState(0);

  useEffect(() => {
    let num = (window.innerHeight - 70) / 30;
    setNumbers(Math.floor(num));
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <MainContainer
        variants={container}
        initial="hidden"
        animate="show"
        exit={{
          opacity: 0,
          transition: { duration: 0.5 },
        }}
      >
        <Container>
          <LogoComponent />
          <PowerButton />
          <SocialIcons />
          <AnchorComponent number={numbers} />
          <Center>
            <Grid variants={container} initial="hidden" animate="show">
              {Blogs.map((blog) => {
                return <BlogComponent key={blog.id} blog={blog} />;
              })}
            </Grid>
          </Center>
          <BigTitle text="BLOG" top="5rem" left="5rem" />
        </Container>
      </MainContainer>
    </Suspense>
  );
};

export default BlogPage;

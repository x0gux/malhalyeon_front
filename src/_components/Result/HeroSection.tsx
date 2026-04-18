'use client'
import styled from "@emotion/styled";
import font from "@/_packages/design-system/src/font";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Title>검사결과를 확인해주세요</Title>
    </Container>
  );
};

export default HeroSection;

const Container = styled(motion.section)`
  z-index : 0;
  width: 100%;
  height: 50vh;
  padding : 15% 5%;
  background: 
    radial-gradient(circle, #e5e5e57d 2px, transparent 2px),
    linear-gradient(180deg, #FFFFFF 0%, #ff0000 30%);
  background-size: 24px 24px, 100% 100%;
`;

const Title = styled.h1`
  ${font.D2};
  color: #FFFFFF;
  text-align: left;
`;

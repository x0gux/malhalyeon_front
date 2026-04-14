'use client'
import styled from "@emotion/styled";
import font from "@/packages/design-system/src/font";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Title>그동안 연애서비스,<br/>너무 긍정적으로만 바라봤죠?</Title>
      <Subtitle>
        기대감에 따른 실망, 끝나지않는 짝사랑 망할연에서 모두 해결해요!<br/>
        그사람에 대한 영수증을 만들어서 사용자님께 드려요
      </Subtitle>
    </Container>
  );
};

export default HeroSection;

const Container = styled(motion.section)`
  position : relative;
  z-index : 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  text-align: center;
  gap: 16px;
  height: 40vh;
  padding : 10% 5%;
  background: 
    radial-gradient(circle, #e5e5e57d 2px, transparent 2px),
    linear-gradient(180deg, #FFFFFF 0%, #ff0000 80%);
  background-size: 24px 24px, 100% 100%;
`;

const Title = styled.h1`
  ${font.D2};
  color: #FFFFFF;
  text-align: left;
`;

const Subtitle = styled.p`
  ${font.P5};
  color: #FFFFFF;
  line-height: 2.5;
  text-align: left;
`;

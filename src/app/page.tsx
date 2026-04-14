'use client'
import { Footer } from "@/_components/Layout";
import { HeroSection, ReceiptSection } from "@/_components/Main";
import styled from "@emotion/styled";

const Home = () => {
  return (
    <MainContainer>
      <HeroSection />
      <ReceiptSection />
      <Footer />
    </MainContainer>
  );
}

export default Home;

const MainContainer = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;



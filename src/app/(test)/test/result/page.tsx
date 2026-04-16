'use client'
import { Footer } from "@/_components/Layout";
import { HeroSection, ReceiptSection } from "@/_components/Result";
import styled from "@emotion/styled";
import { useTestStore } from "@/_store/testStore";


const TestResultPage = () => {
  const { resultData } = useTestStore();
  
  if (!resultData) return null;
  
  return (
    <MainContainer>
      <HeroSection />
      <ReceiptSection data={resultData} />
      <Footer />
    </MainContainer>
  );
}

export default TestResultPage;

const MainContainer = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;



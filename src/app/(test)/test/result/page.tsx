'use client'
import { Footer } from "@/_components/Layout";
import { HeroSection, ReceiptSection, AnalysisDashboard } from "@/_components/Result";
import styled from "@emotion/styled";
import { useTestStore } from "@/_store/testStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const TestResultPage = () => {
  const { resultData } = useTestStore();
  const router = useRouter();

  useEffect(() => {
    if (!resultData) {
      router.push("/test/upload");
    }
  }, [resultData, router]);
  
  if (!resultData) return null;
  
  return (
    <MainContainer>
      <HeroSection />
      <ScrollArea>
        <TopSpacer />
        <SheetContent>
          <ReceiptSection data={resultData} />
          <AnalysisDashboard items={resultData.analysis_items} />
          <Footer />
        </SheetContent>
      </ScrollArea>
    </MainContainer>
  );
}

export default TestResultPage;

const MainContainer = styled.main`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
  background-color: #ffffff;
`;

const ScrollArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  z-index: 10;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TopSpacer = styled.div`
  height: 20vh; /* 배경 타이틀이 보일 공간 */
  width: 100%;
`;

const SheetContent = styled.div`
  width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
`;



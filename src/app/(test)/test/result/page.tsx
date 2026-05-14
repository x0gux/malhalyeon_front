'use client'
import { Footer } from "@/_components/Layout";
import { HeroSection, ReceiptSection, AnalysisDashboard } from "@/_components/Result";
import styled from "@emotion/styled";
import { useTestStore } from "@/_store/testStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { auth } from "@/_lib/firebase";
import { sanitizeResponse } from "@/_utils/sanitizeResponse";

const TestResultPage = () => {
  const { resultData } = useTestStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !resultData) {
      router.push("/test/upload");
    }
  }, [isHydrated, resultData, router]);
  const safeData = useMemo(() => {
    if (!resultData) return null;

    const targetName = resultData.receipt_info?.target_name ?? null;
    const userName = auth.currentUser?.displayName ?? auth.currentUser?.email ?? null;

    const rawJson = JSON.stringify(resultData);
    const cleanJson = sanitizeResponse(rawJson, targetName, userName);

    try {
      return JSON.parse(cleanJson);
    } catch (e) {

      console.error("[sanitize] JSON parse failed, falling back to raw data", e);
      return resultData;
    }
  }, [resultData]);

  if (!isHydrated || !safeData) return null;

  return (
    <MainContainer>
      <HeroSection />
      <ScrollArea>
        <TopSpacer />
        <SheetContent>
          <ReceiptSection data={safeData} />
          <AnalysisDashboard items={safeData.analysis_items} />
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

  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TopSpacer = styled.div`
  height: 20vh;
  width: 100%;
`;

const SheetContent = styled.div`
  width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
`;
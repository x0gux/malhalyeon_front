'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import { getRankingList, RankingItem } from '@/_lib/database';
import { Footer } from '@/_components/Layout';
import { ReceiptSection } from '@/_components/Result';
import { useRouter } from 'next/navigation';

const RankingPage = () => {
  const router = useRouter();
  const [list, setList] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RankingItem | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRankingList();
        setList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const anonymizeText = (text: string, userName: string, targetName: string) => {
    if (!text) return text;
    let result = text;

    if (userName && userName !== "익명") {
      result = result.split(userName).join("사용자");

      if (userName.includes('@')) {
        const emailPrefix = userName.split('@')[0];
        result = result.split(emailPrefix).join("사용자");
      }
      

      if (userName.length === 3) {
        const firstName = userName.substring(1);
        result = result.split(firstName).join("사용자");
      }
    }

    if (targetName && targetName !== "익명의 사용자") {

      result = result.split(targetName).join("상대방");
      

      if (targetName.length === 3) {
        const firstName = targetName.substring(1);
        result = result.split(firstName).join("상대방");
      }
    }

    result = result.split("본인").join("사용자");
    
    return result;
  };

  const getAnonymizedItem = (item: RankingItem): RankingItem => {
    return {
      ...item,
      analysisItems: item.analysisItems.map(ai => ({
        ...ai,
        behavior: anonymizeText(ai.behavior, item.userName, item.targetName),
        description: anonymizeText(ai.description, item.userName, item.targetName),
        evidence: anonymizeText(ai.evidence, item.userName, item.targetName),
      })),
      compatibilityIssues: item.compatibilityIssues.map(ci => ({
        ...ci,
        issue: anonymizeText(ci.issue, item.userName, item.targetName),
        detail: anonymizeText(ci.detail, item.userName, item.targetName),
      })),
      finalVerdict: {
        ...item.finalVerdict,
        comment: anonymizeText(item.finalVerdict.comment, item.userName, item.targetName),
      }
    };
  };

  if (selectedItem) {
    const anonymizedItem = getAnonymizedItem(selectedItem);
    return (
      <PageLayout>
        <DetailHeader>
          <BackButton onClick={() => setSelectedItem(null)}>← 목록으로</BackButton>
          <DetailTitle>익명의 사용자님의 영수증</DetailTitle>
        </DetailHeader>

        <DetailContent>
        <ReceiptSection 
          data={{
            analysis_items: anonymizedItem.analysisItems,
            compatibility_issues: anonymizedItem.compatibilityIssues,
            final_verdict: anonymizedItem.finalVerdict,
            receipt_info: {
              service_name: "망할연",
              target_name: "익명의 사용자"
            },
            user_type: anonymizedItem.userType
          }} 
          showShare={false}
        />
        </DetailContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ContentArea>
        <HeaderArea>
          <Title>명예의 전당</Title>
          <SubTitle>가장 최악의 연애를 한 사람들의 기록입니다.</SubTitle>
        </HeaderArea>

        {loading ? (
          <LoadingText>데이터를 불러오는 중...</LoadingText>
        ) : (
          <RankingList>
            {list.map((item, index) => (
              <RankingCard key={item.id} onClick={() => setSelectedItem(item)}>
                <RankNumber isTop3={index < 3}>{index + 1}</RankNumber>
                <CardInfo>
                  <TargetName>익명의사용자와의 대화</TargetName>
                  <UserName>작성자: 익명</UserName>
                </CardInfo>
                <ScoreBadge>{item.totalScore}점</ScoreBadge>
              </RankingCard>
            ))}
          </RankingList>
        )}
      </ContentArea>
      <FooterContainer>
         <HomeButton onClick={() => router.push('/')}>홈으로 돌아가기</HomeButton>
         <Footer />
      </FooterContainer>
    </PageLayout>
  );
};

export default RankingPage;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background-color: #ffffff;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 60px 24px 0 30px;
  overflow-y: auto;
`;

const HeaderArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  ${font.D3};
  color: #000000;
`;

const SubTitle = styled.p`
  ${font.P2};
  color: #666666;
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 100px;
`;

const RankingCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  &:active {
    transform: scale(0.98);
  }
`;

const DetailContent = styled.div`
  height : 100vh;
  overflow : scroll;
  z-index : 0;
  padding-top : 20vh;
`

const RankNumber = styled.span<{ isTop3: boolean }>`
  ${font.H1};
  color: ${props => props.isTop3 ? "#FF4D4D" : "#ddd"};
  width: 30px;
`;

const CardInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TargetName = styled.span`
  ${font.H3};
  color: #333;
`;

const UserName = styled.span`
  ${font.P3};
  color: #999;
`;

const ScoreBadge = styled.span`
  ${font.H2};
  color: #FF4D4D;
`;

const LoadingText = styled.p`
  ${font.P1};
  color: #999;
  text-align: center;
  margin-top: 50px;
`;

const DetailHeader = styled.div`
  max-width : 500px;
  width : 100%;
  padding: 60px 24px 20px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  position: fixed;
  top:0;
  z-index: 1;
`;

const BackButton = styled.button`
  ${font.P2};
  color: #666;
  border: none;
  background: none;
  cursor: pointer;
`;

const DetailTitle = styled.h2`
  ${font.H2};
  color: #000;
`;

const FooterContainer = styled.div`
  margin-top : -20px

`;

const HomeButton = styled.button`
  width: calc(100% - 60px);
  margin: 0 30px 20px;
  padding: 16px;
  background: #FF4D4D;
  color: #fff;
  border: none;
  border-radius: 12px;
  ${font.Btn1};
  cursor: pointer;
`;

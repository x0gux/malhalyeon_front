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

  if (selectedItem) {
    // 상세 보기 모드 (영수증 재사용)
    return (
      <PageLayout>
        <DetailHeader>
          <BackButton onClick={() => setSelectedItem(null)}>← 목록으로</BackButton>
          <DetailTitle>{selectedItem.userName}님의 영수증</DetailTitle>
        </DetailHeader>
        <ReceiptSection data={{
          analysis_items: selectedItem.analysisItems,
          compatibility_issues: selectedItem.compatibilityIssues,
          final_verdict: selectedItem.finalVerdict,
          receipt_info: {
            service_name: "망할연",
            target_name: selectedItem.targetName
          },
          user_type: selectedItem.userType
        }} />
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
                  <TargetName>{item.targetName}와의 대화</TargetName>
                  <UserName>작성자: {item.userName}</UserName>
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
  padding: 60px 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  z-index: 10;
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
  margin-top: auto;
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

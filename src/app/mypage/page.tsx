'use client'
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAuthStore } from '@/_store/authStore';
import { getUserHistory, getUserProfile } from '@/_lib/database';
import { Footer } from '@/_components/Layout';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MyPage = () => {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [patternReport, setPatternReport] = useState<any>(null);
  const [isPatternLoading, setIsPatternLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/signup');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, isAuthLoading]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [historyData, profileData] = await Promise.all([
        getUserHistory(user.uid),
        getUserProfile(user.uid)
      ]);
      setHistory(historyData);
      setProfile(profileData);

      if (historyData.length >= 2) {
        analyzePattern(historyData);
      }
    } catch (error) {
      console.error("Error fetching mypage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePattern = async (historyData: any[]) => {
    setIsPatternLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mypage/pattern`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: historyData })
      });
      const data = await response.json();
      if (!data.error) {
        setPatternReport(data);
      }
    } catch (error) {
      console.error("Error analyzing pattern:", error);
    } finally {
      setIsPatternLoading(false);
    }
  };

  if (isLoading || isAuthLoading) return <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>;

  return (
    <Container>
      <Content>
        <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Title>내 연애 유형</Title>
          <BadgeCard>
            <BadgeIcon>
              {profile?.userType?.type_name === '열정형' ? '🔥' : 
               profile?.userType?.type_name === '균형형' ? '⚖️' : 
               profile?.userType?.type_name === '신중형' ? '🛡️' : '❓'}
            </BadgeIcon>
            <BadgeInfo>
              <BadgeName>{profile?.userType?.type_name || '미검사'}</BadgeName>
              <BadgeLabel>{profile?.userType?.label || '아직 연애 유형 검사를 하지 않았습니다.'}</BadgeLabel>
            </BadgeInfo>
          </BadgeCard>
        </Section>

        <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Title>분석 히스토리 <Count>{history.length}</Count></Title>
          <HistoryList>
            {history.length > 0 ? (
              history.map((item, index) => (
                <HistoryItem key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <HistoryDate>{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</HistoryDate>
                  <HistoryTarget>{item.targetName}님</HistoryTarget>
                  <HistoryScore isBad={item.totalScore < -50}>{item.totalScore}점</HistoryScore>
                </HistoryItem>
              ))
            ) : (
              <EmptyState>아직 분석 기록이 없습니다.</EmptyState>
            )}
          </HistoryList>
        </Section>

        <Section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Title>나의 연애 패턴 리포트</Title>
          <ReportCard>
            {history.length < 2 ? (
              <Placeholder>
                <PlaceholderIcon>🔍</PlaceholderIcon>
                <PlaceholderText>분석 히스토리가 최소 2개 이상 쌓여야 패턴을 분석할 수 있습니다.<br/><strong>분석을 더 해보세요!</strong></PlaceholderText>
                <AnalyzeButton onClick={() => router.push('/test/upload')}>분석하러 가기</AnalyzeButton>
              </Placeholder>
            ) : isPatternLoading ? (
              <Placeholder>AI가 당신의 패턴을 분석 중입니다...</Placeholder>
            ) : patternReport ? (
              <ReportContent>
                <ReportItem>
                  <ReportLabel>자주 만난 유형 (TOP 3 행동)</ReportLabel>
                  <TagGroup>
                    {patternReport.top_behaviors.map((b: string) => <Tag key={b}>{b}</Tag>)}
                  </TagGroup>
                </ReportItem>
                <ReportItem>
                  <ReportLabel>평균 망함 점수</ReportLabel>
                  <AverageScore>{patternReport.average_score}점</AverageScore>
                </ReportItem>
                <Divider />
                <ReportItem>
                  <ReportLabel>AI 한줄 진단</ReportLabel>
                  <Diagnosis>"{patternReport.pattern_comment}"</Diagnosis>
                </ReportItem>
              </ReportContent>
            ) : (
              <Placeholder>패턴 분석 데이터를 가져올 수 없습니다.</Placeholder>
            )}
          </ReportCard>
        </Section>
      </Content>
      <Footer />
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  background-color: #ffffff;
`;
const Content = styled.div`
  padding: 40px 20px 120px 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
`;

const Section = styled(motion.section)`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Count = styled.span`
  font-size: 14px;
  color: #ff4d4f;
  background: #fff1f0;
  padding: 2px 8px;
  border-radius: 12px;
`;

const BadgeCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
`;

const BadgeIcon = styled.div`
  font-size: 40px;
  width: 70px;
  height: 70px;
  background: #f1f3f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BadgeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BadgeName = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
`;

const BadgeLabel = styled.div`
  font-size: 14px;
  color: #868e96;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryItem = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  cursor: pointer;
`;

const HistoryDate = styled.span`
  font-size: 12px;
  color: #adb5bd;
  width: 80px;
`;

const HistoryTarget = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #495057;
  flex: 1;
`;

const HistoryScore = styled.span<{ isBad: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.isBad ? '#ff4d4f' : '#2f9e44'};
`;

const ReportCard = styled.div`
  background: #1a1a1a;
  border-radius: 24px;
  padding: 28px;
  color: #ffffff;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
`;

const ReportContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ReportItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReportLabel = styled.div`
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 14px;
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AverageScore = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #ff4d4f;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
`;

const Diagnosis = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
  word-break: keep-all;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #adb5bd;
  font-size: 14px;
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
`;

const PlaceholderIcon = styled.div`
  font-size: 32px;
`;

const PlaceholderText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #94a3b8;
  strong {
    color: #fff;
  }
`;

const AnalyzeButton = styled.button`
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #868e96;
`;

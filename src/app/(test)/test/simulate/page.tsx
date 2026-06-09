'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import font from '@/_packages/design-system/src/font';
import { useTestStore } from '@/_store/testStore';
import {
  startSimulation,
  replySimulation,
  getResultSimulation,
  Choice,
  Feedback,
  SimulationResultResponse
} from '@/_lib/simulate';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  feedback?: Feedback | null;
}

const MAX_TURNS = 5;

const SimulationPage = () => {
  const { resultData } = useTestStore();
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [turn, setTurn] = useState(1);

  // Result state
  const [isAnalyzingResult, setIsAnalyzingResult] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResultResponse | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect if no resultData from the previous step
  useEffect(() => {
    if (isHydrated && !resultData) {
      router.push('/test/upload');
    }
  }, [isHydrated, resultData, router]);

  const analysisItems = resultData?.analysis_items || [];
  const dangerLevel = resultData?.danger_level || '주의';
  const targetName = '상대방';

  // Initialize simulation
  useEffect(() => {
    if (!isHydrated || !resultData) return;

    const initSimulation = async () => {
      try {
        setIsStarting(true);
        const res = await startSimulation(analysisItems, dangerLevel);
        setConversation([
          {
            role: 'assistant',
            content: res.message
          }
        ]);

        // Generate choices for the first message
        const firstHistory = [{ role: 'assistant', content: res.message }];
        const replyRes = await replySimulation(analysisItems, dangerLevel, firstHistory, '시뮬레이션 시작');
        setChoices(replyRes.choices);
        setTurn(1);
      } catch (err) {
        console.error('Failed to start simulation:', err);
        alert('시뮬레이션을 시작하지 못했습니다. 다시 시도해주세요.');
        router.back();
      } finally {
        setIsStarting(false);
      }
    };

    initSimulation();
  }, [isHydrated, resultData]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  if (!isHydrated || !resultData) return null;

  const handleSelectChoice = async (choice: Choice) => {
    if (isLoading) return;

    // 1. Add user message locally
    const updatedConv = [
      ...conversation,
      { role: 'user' as const, content: choice.text }
    ];
    setConversation(updatedConv);
    setIsLoading(true);

    try {
      // Create history payload (excluding the feedback objects for the backend api)
      const historyPayload = conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // 2. Fetch reply
      const res = await replySimulation(
        analysisItems,
        dangerLevel,
        historyPayload,
        choice.text
      );

      // Save user feedback
      if (res.feedback) {
        setScoreHistory(prev => [...prev, res.feedback!.score]);
        // Update user message in list to contain feedback
        updatedConv[updatedConv.length - 1].feedback = res.feedback;
      }

      // 3. Add assistant response
      setConversation(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], feedback: res.feedback }, // keep feedback
        { role: 'assistant' as const, content: res.opponent_message }
      ]);

      setChoices(res.choices);
      setTurn(res.turn);
    } catch (err) {
      console.error('Error replying to simulation:', err);
      alert('답변 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishSimulation = async () => {
    if (isAnalyzingResult) return;

    try {
      setIsAnalyzingResult(true);
      // Format final conversation history for the backend
      const historyPayload = conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await getResultSimulation(analysisItems, historyPayload, scoreHistory);
      setSimulationResult(res);
      setShowResult(true);
    } catch (err) {
      console.error('Error getting simulation results:', err);
      alert('결과 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzingResult(false);
    }
  };

  return (
    <MainContainer>
      {/* Header */}
      <Header>
        <BackButton onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BackButton>
        <TitleContainer>
          <RoomName>상대방과의 대응 훈련</RoomName>
          <DangerBadge danger={dangerLevel}>{dangerLevel} 등급</DangerBadge>
        </TitleContainer>
        <ProgressText>
          {turn} / {MAX_TURNS} 턴
        </ProgressText>
      </Header>

      {/* Starting screen */}
      <AnimatePresence>
        {isStarting && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingPulse />
            <LoadingText>
              {targetName}님의 대화 패턴 분석 후<br />
              가상 대화방을 생성하고 있습니다...
            </LoadingText>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <ChatArea>
        <NoticeBanner>
          💡 4가지 대응 전략 중 가장 현명한 대답을 선택하세요.<br />
          대화 흐름 속에서 위험 신호를 감지하고 건강한 경계를 설정하세요.
        </NoticeBanner>

        {conversation.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <MessageGroup key={index} isUser={isUser}>
              {!isUser && <Avatar>💔</Avatar>}
              <MessageContent isUser={isUser}>
                {!isUser && <SenderName>{targetName}</SenderName>}
                <BubbleContainer isUser={isUser}>
                  <Bubble isUser={isUser}>{msg.content}</Bubble>
                </BubbleContainer>

                {/* Inline Feedback for User Choices */}
                {isUser && msg.feedback && (
                  <FeedbackCard
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FeedbackHeader>
                      <FeedbackScore score={msg.feedback.score}>
                        {msg.feedback.score}점
                      </FeedbackScore>
                      <FeedbackLabel score={msg.feedback.score}>
                        {msg.feedback.label}
                      </FeedbackLabel>
                    </FeedbackHeader>
                    <FeedbackText>{msg.feedback.feedback}</FeedbackText>
                    {msg.feedback.tip && <FeedbackTip>💡 {msg.feedback.tip}</FeedbackTip>}
                  </FeedbackCard>
                )}
              </MessageContent>
            </MessageGroup>
          );
        })}

        {/* AI Typing Indicator */}
        {isLoading && (
          <MessageGroup isUser={false}>
            <Avatar>💔</Avatar>
            <MessageContent isUser={false}>
              <SenderName>{targetName}</SenderName>
              <Bubble isUser={false}>
                <TypingDots>
                  <span></span>
                  <span></span>
                  <span></span>
                </TypingDots>
              </Bubble>
            </MessageContent>
          </MessageGroup>
        )}
        <div ref={chatEndRef} />
      </ChatArea>

      {/* Actions and Choices Panel */}
      <ActionPanel>
        {turn <= MAX_TURNS && !isLoading && choices.length > 0 ? (
          <ChoicesContainer>
            <ChoicesTitle>대응을 선택해 주세요</ChoicesTitle>
            <ChoicesGrid>
              {choices.map((choice) => (
                <ChoiceButton
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChoiceStrategy>{choice.strategy}</ChoiceStrategy>
                  <ChoiceText>{choice.text}</ChoiceText>
                </ChoiceButton>
              ))}
            </ChoicesGrid>
          </ChoicesContainer>
        ) : (
          (turn > MAX_TURNS || choices.length === 0) && !isLoading && (
            <FinishContainer>
              <FinishTitle>대응 훈련이 종료되었습니다!</FinishTitle>
              <FinishDesc>
                총 {MAX_TURNS}번의 가상 대화에 대처했습니다.<br />
                나의 대처 방식과 최종 피드백 리포트를 확인해 보세요.
              </FinishDesc>
              <SubmitButton
                onClick={handleFinishSimulation}
                disabled={isAnalyzingResult}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAnalyzingResult ? '분석 중...' : '최종 훈련 결과 리포트 보기'}
              </SubmitButton>
            </FinishContainer>
          )
        )}
      </ActionPanel>

      {/* Final Result Modal */}
      <AnimatePresence>
        {showResult && simulationResult && (
          <ResultModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultCard
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <ResultHeader>
                <ResultCloseBtn onClick={() => setShowResult(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ResultCloseBtn>
                <ResultHeaderTitle>훈련 결과 리포트</ResultHeaderTitle>
              </ResultHeader>

              <ResultBody>
                {/* Grade Circle */}
                <GradeSection>
                  <GradeCircle grade={simulationResult.grade}>
                    <GradeText>{simulationResult.grade}</GradeText>
                  </GradeCircle>
                  <ResultTitle>{simulationResult.title}</ResultTitle>
                  <AverageScoreText>평균 대처 점수: {simulationResult.total_score}점</AverageScoreText>
                </GradeSection>

                {/* Report Content */}
                <ReportCard>
                  <ReportTitle>총평</ReportTitle>
                  <ReportText>{simulationResult.summary}</ReportText>
                </ReportCard>

                <HighlightGrid>
                  <HighlightCard type="best">
                    <HighlightTitle type="best">👍 가장 좋았던 대처</HighlightTitle>
                    <HighlightContent>{simulationResult.best_response || '훌륭하게 경계를 설정했습니다.'}</HighlightContent>
                  </HighlightCard>

                  <HighlightCard type="worst">
                    <HighlightTitle type="worst">👎 가장 아쉬웠던 대처</HighlightTitle>
                    <HighlightContent>{simulationResult.worst_response || '패턴에 휘둘리거나 정서적 방어가 아쉬웠습니다.'}</HighlightContent>
                  </HighlightCard>
                </HighlightGrid>

                <ReportCard>
                  <ReportTitle>대인관계 조언</ReportTitle>
                  <ReportText>{simulationResult.advice}</ReportText>
                </ReportCard>
              </ResultBody>

              <ResultFooter>
                <FooterButton onClick={() => router.replace('/test/result')}>
                  결과 영수증으로 돌아가기
                </FooterButton>
              </ResultFooter>
            </ResultCard>
          </ResultModalOverlay>
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default SimulationPage;

// Styled Components
const MainContainer = styled.main`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #f3f5f7;
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e1e4e6;
  z-index: 20;
`;

const BackButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const RoomName = styled.h2`
  ${font.H2};
  color: #1a1a1a;
  font-weight: 700;
  margin: 0;
`;

const DangerBadge = styled.span<{ danger: string }>`
  ${font.P4};
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  background-color: ${({ danger }) =>
    danger === '위험' ? '#ffebeb' : danger === '경고' ? '#fff4eb' : '#eff8ff'};
  color: ${({ danger }) =>
    danger === '위험' ? '#ff3b30' : danger === '경고' ? '#ff9500' : '#007aff'};
`;

const ProgressText = styled.span`
  ${font.H4};
  color: #666;
`;

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const LoadingPulse = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ff4d4d;
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-in-out;

  @keyframes pulse {
    0% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
  }
`;

const LoadingText = styled.p`
  ${font.P1};
  color: #333;
  text-align: center;
  line-height: 1.6;
  font-weight: 600;
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(180deg, #b2c7da 0%, #a1b7cc 100%);

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const NoticeBanner = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 12px;
  ${font.P3};
  color: #2c3e50;
  line-height: 1.5;
  text-align: center;
  backdrop-filter: blur(5px);
`;

const MessageGroup = styled.div<{ isUser: boolean }>`
  display: flex;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  gap: 8px;
  max-width: 85%;
  flex-direction: ${({ isUser }) => (isUser ? 'row-reverse' : 'row')};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
`;

const MessageContent = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  gap: 4px;
`;

const SenderName = styled.span`
  ${font.P4};
  color: #3e3f42;
  font-weight: 500;
`;

const BubbleContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  flex-direction: ${({ isUser }) => (isUser ? 'row-reverse' : 'row')};
`;

const Bubble = styled.div<{ isUser: boolean }>`
  background-color: ${({ isUser }) => (isUser ? '#ffea2c' : '#ffffff')};
  color: #1e1e1e;
  padding: 10px 14px;
  border-radius: ${({ isUser }) => (isUser ? '16px 2px 16px 16px' : '2px 16px 16px 16px')};
  ${font.P2};
  line-height: 1.45;
  word-break: break-all;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`;

const FeedbackCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  width: 260px;
  margin-top: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #ff4d4d;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FeedbackScore = styled.span<{ score: number }>`
  ${font.H4};
  font-weight: 700;
  color: ${({ score }) => (score >= 80 ? '#34c759' : score >= 50 ? '#ff9500' : '#ff3b30')};
`;

const FeedbackLabel = styled.span<{ score: number }>`
  ${font.P4};
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background-color: ${({ score }) =>
    score >= 80 ? '#e6f9ed' : score >= 50 ? '#fff4e6' : '#ffebeb'};
  color: ${({ score }) => (score >= 80 ? '#34c759' : score >= 50 ? '#ff9500' : '#ff3b30')};
`;

const FeedbackText = styled.p`
  ${font.P3};
  color: #333;
  margin: 0;
  line-height: 1.4;
`;

const FeedbackTip = styled.p`
  ${font.P3};
  color: #666;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
  border-top: 1px dashed #eee;
  padding-top: 4px;
`;

const TypingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
  padding: 0 4px;

  span {
    width: 6px;
    height: 6px;
    background-color: #aaa;
    border-radius: 50%;
    animation: typing 1s infinite alternate;

    &:nth-of-type(2) {
      animation-delay: 0.3s;
    }
    &:nth-of-type(3) {
      animation-delay: 0.6s;
    }
  }

  @keyframes typing {
    from {
      opacity: 0.3;
      transform: translateY(0);
    }
    to {
      opacity: 1;
      transform: translateY(-4px);
    }
  }
`;

const ActionPanel = styled.div`
  background-color: #ffffff;
  border-top: 1px solid #e1e4e6;
  padding: 16px;
  min-height: 120px;
  z-index: 10;
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChoicesTitle = styled.h3`
  ${font.H3};
  color: #666;
  font-weight: 600;
  margin: 0;
`;

const ChoicesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChoiceButton = styled(motion.button)`
  width: 100%;
  padding: 12px 16px;
  background-color: #f7f9fa;
  border: 1px solid #eef1f2;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  outline: none;

  &:hover {
    background-color: #f0f3f5;
  }
`;

const ChoiceStrategy = styled.span`
  ${font.P4};
  color: #ff4d4d;
  font-weight: 700;
  text-transform: uppercase;
`;

const ChoiceText = styled.p`
  ${font.P2};
  color: #222;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
`;

const FinishContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  padding: 10px 0;
`;

const FinishTitle = styled.h3`
  ${font.H2};
  color: #111;
  font-weight: 700;
  margin: 0;
`;

const FinishDesc = styled.p`
  ${font.P2};
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const SubmitButton = styled(motion.button)`
  ${font.Btn1};
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ff4d4d 0%, #ff1a1a 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.2);
`;

// Result Modal
const ResultModalOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 50;
  display: flex;
  align-items: flex-end;
`;

const ResultCard = styled(motion.div)`
  width: 100%;
  max-height: 85%;
  background-color: #ffffff;
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
`;

const ResultCloseBtn = styled.button`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

const ResultHeaderTitle = styled.h3`
  ${font.H2};
  color: #222;
  font-weight: 700;
  margin: 0;
`;

const ResultBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const GradeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const GradeCircle = styled.div<{ grade: string }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ grade }) =>
    grade === 'A'
      ? 'linear-gradient(135deg, #34c759 0%, #28a745 100%)'
      : grade === 'B'
        ? 'linear-gradient(135deg, #007aff 0%, #0056b3 100%)'
        : grade === 'C'
          ? 'linear-gradient(135deg, #ff9500 0%, #cc7a00 100%)'
          : 'linear-gradient(135deg, #ff3b30 0%, #c62828 100%)'};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const GradeText = styled.span`
  font-size: 40px;
  font-weight: 900;
  color: #ffffff;
`;

const ResultTitle = styled.h4`
  ${font.D3};
  color: #111;
  font-weight: 700;
  margin: 0;
`;

const AverageScoreText = styled.p`
  ${font.H4};
  color: #666;
  margin: 0;
  background: #f4f6f8;
  padding: 4px 12px;
  border-radius: 20px;
`;

const ReportCard = styled.div`
  background: #f8fafe;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #eef2fa;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReportTitle = styled.h5`
  ${font.H4};
  color: #1a73e8;
  font-weight: 700;
  margin: 0;
`;

const ReportText = styled.p`
  ${font.P2};
  color: #333;
  line-height: 1.55;
  margin: 0;
`;

const HighlightGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HighlightCard = styled.div<{ type: 'best' | 'worst' }>`
  border-radius: 16px;
  padding: 16px;
  background-color: ${({ type }) => (type === 'best' ? '#f5fbf7' : '#fff5f5')};
  border: 1px solid ${({ type }) => (type === 'best' ? '#e1f5e8' : '#ffe4e4')};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HighlightTitle = styled.span<{ type: 'best' | 'worst' }>`
  ${font.H4};
  font-weight: 700;
  color: ${({ type }) => (type === 'best' ? '#2e7d32' : '#c62828')};
`;

const HighlightContent = styled.p`
  ${font.P2};
  color: #444;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
`;

const ResultFooter = styled.div`
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #f0f0f0;
  background: #ffffff;
`;

const FooterButton = styled.button`
  ${font.Btn1};
  width: 100%;
  padding: 14px;
  background-color: #333;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s;

  &:hover {
    background-color: #222;
  }
`;

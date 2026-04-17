'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import { useTestStore } from '@/_store/testStore';
import { Button } from '@/_components/common';
import { Footer } from '@/_components/Layout';
import axios from 'axios';
import { use } from 'react';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizItem {
  id: number;
  question: string;
  options: QuizOption[];
}

const TOTAL = 8;

const CheckPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = use(params);
  const id = Number(rawId);
  const router = useRouter();
  const { addAnswer } = useTestStore();

  const [quiz, setQuiz] = useState<QuizItem | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setSelected(null);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz/${id}`);
        setQuiz(res.data);
      } catch {
        alert('문항을 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleNext = () => {
    if (!selected) return;

    addAnswer({ id, choice: selected });

    if (id >= TOTAL) {
      router.push('/test/targetname');
    } else {
      router.push(`/check/${id + 1}`);
    }
  };

  if (loading || !quiz) return <LoadingText>로딩 중...</LoadingText>;

  return (
    <PageLayout>
      <ContentArea>
        <Question>{quiz.question}</Question>

        <OptionList>
          {quiz.options.map((opt) => (
            <OptionButton
              key={opt.id}
              isSelected={selected === opt.id}
              onClick={() => setSelected(opt.id)}
            >
              {opt.text}
            </OptionButton>
          ))}
        </OptionList>

        <BottomArea>
          <Button
            type='secondary'
            text={id >= TOTAL ? '완료하기' : '다음으로'}
            onClick={handleNext}
          />
          <ProgressBar>
            <ProgressFill width={(id / TOTAL) * 100} />
          </ProgressBar>
        </BottomArea>
      </ContentArea>
      <Footer />
    </PageLayout>
  );
};

export default CheckPage;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background-color: #ffffff;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 87px 30px 0 30px;
`;

const Question = styled.h1`
  ${font.D2};
  color: #000000;
  white-space: pre-line;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 40px;
`;

const OptionButton = styled.button<{ isSelected: boolean }>`
  ${font.P1};
  width: 100%;
  padding: 18px 20px;
  border: 1px solid ${({ isSelected }) => (isSelected ? '#FF4D4D' : '#e0e0e0')};
  border-radius: 12px;
  color: ${({ isSelected }) => (isSelected ? '#FF4D4D' : '#333')};
  background: ${({ isSelected }) => (isSelected ? '#fff5f5' : '#ffffff')};
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.5;
`;

const BottomArea = styled.div`
  margin-top: auto;
  margin-bottom: 30%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: #FF4D4D;
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const LoadingText = styled.div`
  ${font.P2};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  color: #999;
`;
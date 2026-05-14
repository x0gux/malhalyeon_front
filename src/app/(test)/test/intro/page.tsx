'use client';

import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import {Footer} from '@/_components/Layout';
import { useAuthStore } from '@/_store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/_components/common';

const TestPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSkip = () => {
    router.push('/test/targetname');
  };

  const handleStartTest = () => {
    if (!user) {
      alert('연애 유형 분석은 로그인이 필요한 기능이에요.\n로그인 페이지로 이동할게요!');
      router.push('/login');
      return;
    }
    router.push('/check/1');
  };

  return (
    <PageLayout>
      <ContentArea>
        <HeaderArea>
          <Title>
            먼저 사용자님의<br />
            연애유형을 알아보고싶어요
          </Title>
          <SubTitle>
            연애 유형 분석은 로그인이 필요한 기능이에요.<br />
            건너뛰고 바로 분석할 수도 있어요!
          </SubTitle>
        </HeaderArea>

        <ButtonArea>
          <Button type='secondary' text='건너뛸게요' onClick={handleSkip} />
          <Button type='primary' text='검사할게요' onClick={handleStartTest} />
        </ButtonArea>
      </ContentArea>
      <Footer />
    </PageLayout>
  );
};

export default TestPage;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  background-color: #ffffff;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 87px 30px 0 30px;
`;

const HeaderArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  ${font.D2};
  color: #000000;
  white-space: pre-line;
`;

const SubTitle = styled.p`
  ${font.P2};
  color: #666666;
`;

const ButtonArea = styled.div`
  margin-top: auto;
  margin-bottom: 30%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
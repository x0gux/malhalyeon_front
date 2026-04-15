'use client';

import styled from '@emotion/styled';
import font from '@/packages/design-system/src/font';
import Footer from '@/_components/Layout/Footer';
import { useRouter } from 'next/navigation';

const TestPage = () => {
  const router = useRouter();

  const handleSkip = () => {
    router.push('/');
  };

  const handleStartTest = () => {
    // Navigate to actual test process or show a message
    alert('검사를 시작합니다!');
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
            더욱 자세한 정보를 드리기 위해 진행하지만 건너뛸수있어요
          </SubTitle>
        </HeaderArea>

        <ButtonArea>
          <PrimaryButton onClick={handleSkip}>건너뛸게요</PrimaryButton>
           <SecondaryButton onClick={handleStartTest}>검사할게요</SecondaryButton>
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
  margin-bottom: 30%; /* Adjust based on footer height */
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PrimaryButton = styled.button`
  ${font.Btn1};
  width: 100%;
  padding : 3%;
  background-color: #FF4D4D;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
`;

const SecondaryButton = styled.button`
  ${font.Btn1};
  width: 100%;
  padding : 3%;
  background-color: #ffffff;
  color: #FF4D4D;
  border: 1px solid #FF4D4D;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: #fff0f0;
  }
`;
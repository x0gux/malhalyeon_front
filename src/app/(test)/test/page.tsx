'use client';

import styled from '@emotion/styled';
import font from '@/packages/design-system/src/font';
import {Footer} from '@/_components/Layout';
import { useRouter } from 'next/navigation';
import {Button} from '@/_components/common';

const TestPage = () => {
  const router = useRouter();

  const handleSkip = () => {
    router.push('/');
  };

  const handleStartTest = () => {
    router.push('/testing');
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
  margin-bottom: 30%; /* Adjust based on footer height */
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
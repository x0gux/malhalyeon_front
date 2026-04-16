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
            사용자님의 대화상대 이름을<br/>
            입력해주세요
          </Title>
          <SubTitle>
            카카오톡 이름과 같은 이름을 입력해주세요
          </SubTitle>

          <TestInput type="text" placeholder='이름을 입력해주세요' />

        </HeaderArea>

        <ButtonArea>
           <Button type='secondary' text='다음으로' onClick={handleStartTest} />
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

const TestInput = styled.input`
  ${font.H2};
  border : none;
  border-bottom : 1px solid #FF4D4D;
  outline : none;
  margin-top : 10%;
  padding : 1%;
  background-color : #ffffff;
  color : #FF4D4D;

  ::placeholder {
    color : #FF4D4D;
    ${font.H2};

  `
  
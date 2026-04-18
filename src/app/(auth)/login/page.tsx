'use client';

import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/_components/common';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/_lib/firebase';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/test/upload'); // 로그인 성공 시 돌아갈 페이지
    } catch (err: any) {
      console.error(err);
      setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <ContentArea>
        <HeaderArea>
          <Title>로그인</Title>
          <SubTitle>다시 오셨군요! 분석을 이어나가볼까요?</SubTitle>
        </HeaderArea>

        <FormArea>
          <Input 
            type="email" 
            placeholder="이메일" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="비밀번호" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
        </FormArea>

        <ButtonArea>
          <Button 
            type="secondary" 
            text={loading ? '로그인 중...' : '로그인하기'} 
            onClick={handleLogin} 
          />
          <SignupLink href="/signup">아직 계정이 없으신가요? 회원가입</SignupLink>
        </ButtonArea>
      </ContentArea>
    </PageLayout>
  );
};

export default LoginPage;

// Styled Components
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
  margin-bottom: 40px;
`;

const Title = styled.h1`
  ${font.D2};
  color: #000000;
`;

const SubTitle = styled.p`
  ${font.P2};
  color: #666666;
`;

const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #eeeeee;
  border-radius: 12px;
  ${font.P1};
  color : #000000;
  background-color : #ffffff;
  outline: none;
  &:focus {
    border-color: #FF4D4D;
  }
`;

const ErrorText = styled.p`
  ${font.P2};
  color: #FF4D4D;
  margin: 0;
`;

const ButtonArea = styled.div`
  margin-top: auto;
  margin-bottom: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const SignupLink = styled(Link)`
  ${font.P2};
  color: #666666;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #FF4D4D;
  }
`;

'use client';

import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/_components/common';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/_lib/firebase';
import Link from 'next/link';

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setErrorMsg('모든 필드를 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      alert('회원가입 성공!');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <ContentArea>
        <HeaderArea>
          <Title>새로운 구원자님, 환영합니다</Title>
          <SubTitle>망할연의 모든 기능을 이용해 보세요.</SubTitle>
        </HeaderArea>

        <FormArea>
          <Input 
            type="text" 
            placeholder="이름 (닉네임)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Input 
            type="email" 
            placeholder="이메일" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="비밀번호 (6자리 이상)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
        </FormArea>

        <ButtonArea>
          <Button 
            type="primary" 
            text={loading ? '가입 중...' : '회원가입'} 
            onClick={handleSignup} 
          />
          <LoginLink href="/login">이미 계정이 있으신가요? 로그인</LoginLink>
        </ButtonArea>
      </ContentArea>
    </PageLayout>
  );
};

export default SignupPage;

// Styled Components (Resembles test page layout)
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
  white-space: pre-line;
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

const LoginLink = styled(Link)`
  ${font.P2};
  color: #666666;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #FF4D4D;
  }
`;

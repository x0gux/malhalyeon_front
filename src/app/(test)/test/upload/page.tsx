'use client';

import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import { Footer } from '@/_components/Layout';
import { useRouter } from 'next/navigation';
import { Button } from '@/_components/common';
import { useState } from 'react';
import { useTestStore } from '@/_store/testStore';
import { uploadCsv } from '@/_lib/upload';
import TestModal from '@/_components/Test/Testmodal';
import { useAuthStore } from '@/_store/authStore';
import { updateUserData } from '@/_lib/database';

const TestPage = () => {
  const [loading , setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCsvfile , targetName , setResultData, answers } = useTestStore();
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setCsvfile(e.target.files[0]);
    }
  };

const handleStartTest = async () => {
    if (!file) {
      alert('파일을 먼저 업로드해주세요.');
      return;
    }

    try {
      setLoading(true);
      const result = await uploadCsv(file, targetName, answers);
      setResultData(result);
      
      // 유저 타입이 결과에 포함되어 있고 로그인 상태라면 프로필 업데이트
      if (user && result.user_type && result.user_type !== "미검사") {
        // 결과 JSON에서 user_type_name을 기반으로 데이터를 찾거나, 
        // 간단하게 타입명만 저장할 수도 있지만 여기서는 텍스트로 저장
        // 실제로는 quiz/submit에서 받은 데이터를 저장하는 게 좋음
        // 여기서는 분석 결과에 포함된 type_name을 저장
        try {
          // 백엔드 routes/analyze.py에서 user_type_name을 result.user_type에 넣음
          // 우리는 mypage에서 profile.userType.type_name을 쓰기로 했으므로 형식을 맞춤
          await updateUserData(user.uid, { 
            userType: { type_name: result.user_type } 
          });
        } catch (dbErr) {
          console.error("Failed to update user type in profile:", dbErr);
        }
      }

      console.log(result);
      router.push('/test/result');
    } catch (err) {
      console.error(err);
      alert('분석 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
};

  return (
    <PageLayout>
      <ContentArea>
        <HeaderArea>
          <Title>
            사용자님의 대화상대와 나눈<br />
            대화내용을 업로드해주세요
          </Title>
          <SubTitle>csv와 txt만 업로드가능해요 - <HowtoButton onClick={() => setIsModalOpen(true)}>How to?</HowtoButton></SubTitle>

          <FileInput
            id="file-upload"
            type="file"
            accept='.csv, .txt, .html, .htm'
            onChange={handleFileChange}
          />
          <FileLabel htmlFor="file-upload" isUploaded={!!file}>
            {file ? `${file.name}` : '파일 업로드'}
          </FileLabel>
        </HeaderArea>

        <ButtonArea>
          {loading ? <Button type='secondary' text='로딩중...' onClick={handleStartTest} /> : <Button type='secondary' text='검사하기' onClick={handleStartTest} />}
        </ButtonArea>
      </ContentArea>
      <Footer />

      <TestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label<{ isUploaded: boolean }>`
  ${font.H2};
  width: 100%;
  padding: 30%;
  border: 1px solid ${({ isUploaded }) => (isUploaded ? '#43a047' : '#FF4D4D')};
  border-radius: 12px;
  color: ${({ isUploaded }) => (isUploaded ? '#43a0489d' : '#ff4d4d8a')};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
`;

const HowtoButton = styled.button`
  ${font.P2};
  color: #FF4D4D;
  text-decoration: underline;
  background-color : #ffffff;
  border : none;
  cursor : pointer;

  transition: all 0.3s ease-in-out;

  &:hover {
    ${font.P1};
  }

`

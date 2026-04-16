'use client';

import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import { Footer } from '@/_components/Layout';
import { useRouter } from 'next/navigation';
import { Button } from '@/_components/common';
import { useState } from 'react';
import { useTestStore } from '@/_store/testStore';
import { uploadCsv } from '@/_lib/upload';

const TestPage = () => {
  const [loading , setLoading] = useState(false);
  const { setCsvfile , targetName , setResultData } = useTestStore();
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
      const result = await uploadCsv(file, targetName);
      setResultData(result);  
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
          <SubTitle>csv파일만 업로드가능해요</SubTitle>

          <FileInput
            id="file-upload"
            type="file"
            accept=".csv"
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
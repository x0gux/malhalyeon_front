'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import font from '@/_packages/design-system/src/font';
import { useAuthStore } from '@/_store/authStore';
import { useTestStore } from '@/_store/testStore';
import {
  createPost,
  AnalyzeRequiredError,
  AuthRequiredError,
} from '@/_lib/community';

const WritePage = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { resultData } = useTestStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [analyzeRequired, setAnalyzeRequired] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login?redirect=/community/write');
    }
  }, [user, isAuthLoading, router]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMsg('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('내용을 입력해주세요.');
      return;
    }
    if (title.length > 100) {
      setErrorMsg('제목은 100자 이내로 작성해주세요.');
      return;
    }
    if (content.length > 5000) {
      setErrorMsg('내용은 5000자 이내로 작성해주세요.');
      return;
    }

    setErrorMsg('');
    setAnalyzeRequired(false);

    try {
      setSubmitting(true);
      const post = await createPost({
        title: title.trim(),
        content: content.trim(),
        analyze_id: resultData?.analyze_id ?? null,
        danger_level: resultData?.danger_level ?? null,
        is_anonymous: isAnonymous,
      });
      router.replace(`/community/${post.id}`);
    } catch (err: any) {
      if (err instanceof AnalyzeRequiredError) {
        setAnalyzeRequired(true);
      } else if (err instanceof AuthRequiredError) {
        router.push('/login?redirect=/community/write');
      } else {
        setErrorMsg('게시글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthLoading) return null;
  if (!user) return null;

  return (
    <PageLayout>
      <TopBar>
        <CancelButton onClick={() => router.back()}>취소</CancelButton>
        <PageTitle>글 작성</PageTitle>
        <SubmitButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? '등록 중...' : '등록하기'}
        </SubmitButton>
      </TopBar>

      <FormArea>
        {analyzeRequired ? (
          <AnalyzeRequiredCard>
            <AlertIcon>🔒</AlertIcon>
            <AlertTitle>분석 이력이 필요해요</AlertTitle>
            <AlertDesc>
              커뮤니티에 글을 쓰려면{'\n'}
              먼저 <strong>망할연 분석</strong>을 1회 이상{'\n'}
              이용해야 합니다.
            </AlertDesc>
            <GoAnalyzeButton onClick={() => router.push('/test/targetname')}>
              분석하러 가기 →
            </GoAnalyzeButton>
          </AnalyzeRequiredCard>
        ) : (
          <>
            {resultData?.danger_level && (
              <LinkedAnalysis>
                <LinkedLabel>최근 분석 결과 연결됨</LinkedLabel>
                <LinkedBadge level={resultData.danger_level}>
                  {resultData.danger_level}
                </LinkedBadge>
              </LinkedAnalysis>
            )}

            <TitleInput
              placeholder="제목 (최대 100자)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />

            <ContentInput
              placeholder="내용을 입력하세요 (최대 5000자)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
            />

            <CharCount>{content.length} / 5000</CharCount>

            <AnonymousRow onClick={() => setIsAnonymous((v) => !v)}>
              <AnonymousLabel>익명으로 작성</AnonymousLabel>
              <Toggle active={isAnonymous}>
                <ToggleThumb active={isAnonymous} />
              </Toggle>
            </AnonymousRow>

            {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

            <GuideText>
              💡 분석 기능을 1회 이상 이용한 회원만 글을 작성할 수 있습니다.
            </GuideText>
          </>
        )}
      </FormArea>
    </PageLayout>
  );
};

export default WritePage;

const DANGER_COLORS: Record<string, string> = {
  '위험': '#FF4D4D',
  '경고': '#FF8C00',
  '주의': '#FFD600',
  '안전': '#4CAF50',
};

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 54px 20px 16px;
  border-bottom: 1px solid #f5f5f5;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
`;

const CancelButton = styled.button`
  ${font.P2};
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const PageTitle = styled.h1`
  ${font.H2};
  color: #1a1a1a;
`;

const SubmitButton = styled.button`
  ${font.Btn3};
  background: #FF4D4D;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:active:not(:disabled) { opacity: 0.8; }
`;

const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 20px;
`;

const LinkedAnalysis = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafafa;
  border-radius: 10px;
  padding: 10px 14px;
`;

const LinkedLabel = styled.span`
  ${font.P3};
  color: #999;
`;

const LinkedBadge = styled.span<{ level: string }>`
  ${font.P3};
  font-weight: 700;
  color: ${({ level }) => DANGER_COLORS[level] ?? '#888'};
`;

const TitleInput = styled.input`
  ${font.H3};
  color: #1a1a1a;
  border: none;
  border-bottom: 2px solid #f0f0f0;
  padding: 12px 0;
  outline: none;
  background: transparent;
  &::placeholder { color: #ccc; }
  &:focus { border-bottom-color: #FF4D4D; }
`;

const ContentInput = styled.textarea`
  ${font.P1};
  color: #333;
  border: none;
  border-bottom: 2px solid #f0f0f0;
  padding: 12px 0;
  outline: none;
  resize: none;
  background: transparent;
  min-height: 200px;
  line-height: 1.7;
  &::placeholder { color: #ccc; }
  &:focus { border-bottom-color: #FF4D4D; }
`;

const CharCount = styled.p`
  ${font.P3};
  color: #bbb;
  text-align: right;
  margin-top: -8px;
`;

const AnonymousRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
`;

const AnonymousLabel = styled.span`
  ${font.P2};
  color: #555;
`;

const Toggle = styled.div<{ active: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 100px;
  background: ${({ active }) => (active ? '#FF4D4D' : '#e0e0e0')};
  position: relative;
  transition: background 0.2s;
`;

const ToggleThumb = styled.div<{ active: boolean }>`
  position: absolute;
  top: 3px;
  left: ${({ active }) => (active ? '23px' : '3px')};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: left 0.2s;
`;

const ErrorText = styled.p`
  ${font.P3};
  color: #FF4D4D;
`;

const GuideText = styled.p`
  ${font.P3};
  color: #bbb;
  line-height: 1.5;
`;

const AnalyzeRequiredCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 48px 20px;
`;

const AlertIcon = styled.div`
  font-size: 48px;
`;

const AlertTitle = styled.h2`
  ${font.D3};
  color: #1a1a1a;
`;

const AlertDesc = styled.p`
  ${font.P1};
  color: #666;
  line-height: 1.7;
  white-space: pre-wrap;
  strong { color: #FF4D4D; }
`;

const GoAnalyzeButton = styled.button`
  ${font.Btn1};
  background: #FF4D4D;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 14px 32px;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
  &:active { opacity: 0.8; }
`;

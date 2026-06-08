'use client';

import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import font from '@/_packages/design-system/src/font';
import { Footer } from '@/_components/Layout';
import { useAuthStore } from '@/_store/authStore';
import {
  getPosts,
  Post,
  DANGER_COLORS,
  DANGER_BG_COLORS,
  formatDate,
} from '@/_lib/community';

const CommunityPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);

  const fetchPosts = useCallback(async (cursor?: string) => {
    try {
      const data = await getPosts(20, cursor);
      if (cursor) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setHasMore(data.has_more);
      setLastId(data.last_id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPosts().finally(() => setLoading(false));
  }, [fetchPosts]);

  const handleLoadMore = async () => {
    if (!lastId || loadingMore) return;
    setLoadingMore(true);
    await fetchPosts(lastId);
    setLoadingMore(false);
  };

  const handleWriteClick = () => {
    if (!user) {
      router.push('/login?redirect=/community/write');
      return;
    }
    router.push('/community/write');
  };

  return (
    <PageLayout>
      <TopBar>
        <TopBarLeft>
          <PageTitle>커뮤니티</PageTitle>
          <PageSub>분석 결과를 공유해보세요</PageSub>
        </TopBarLeft>
        <WriteButton onClick={handleWriteClick}>✏️ 글쓰기</WriteButton>
      </TopBar>

      <ContentArea>
        {loading ? (
          <StatusText>불러오는 중...</StatusText>
        ) : posts.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>아직 게시글이 없어요</EmptyTitle>
            <EmptyDesc>첫 번째 분석 결과를 공유해보세요!</EmptyDesc>
            <EmptyButton onClick={handleWriteClick}>글 작성하기</EmptyButton>
          </EmptyState>
        ) : (
          <>
            <PostList>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  dangerColor={DANGER_COLORS[post.danger_level ?? ''] ?? '#eeeeee'}
                  onClick={() => router.push(`/community/${post.id}`)}
                >
                  {post.danger_level && (
                    <DangerBadge
                      color={DANGER_COLORS[post.danger_level]}
                      bg={DANGER_BG_COLORS[post.danger_level]}
                    >
                      {post.danger_level}
                    </DangerBadge>
                  )}
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    <MetaName>{post.is_anonymous ? '익명' : post.display_name}</MetaName>
                    <MetaDot>·</MetaDot>
                    <MetaDate>{formatDate(post.created_at)}</MetaDate>
                    <MetaDot>·</MetaDot>
                    <MetaComment>💬 {post.comment_count}</MetaComment>
                  </PostMeta>
                </PostCard>
              ))}
            </PostList>

            {hasMore && (
              <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? '불러오는 중...' : '더 보기'}
              </LoadMoreButton>
            )}
          </>
        )}
      </ContentArea>

      <Footer />
    </PageLayout>
  );
};

export default CommunityPage;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 60px 24px 20px;
`;

const TopBarLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  ${font.D3};
  color: #000;
`;

const PageSub = styled.p`
  ${font.P2};
  color: #999;
`;

const WriteButton = styled.button`
  ${font.Btn3};
  background: #FF4D4D;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
  margin-top: 4px;
  transition: opacity 0.2s;
  &:active { opacity: 0.8; }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 0 20px 100px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PostCard = styled.div<{ dangerColor: string }>`
  background: #fafafa;
  border-radius: 16px;
  padding: 16px 20px;
  cursor: pointer;
  border-left: 4px solid ${({ dangerColor }) => dangerColor};
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform 0.15s;
  &:active { transform: scale(0.98); }
`;

const DangerBadge = styled.span<{ color: string; bg: string }>`
  ${font.P3};
  color: ${({ color }) => color};
  background: ${({ bg }) => bg};
  border-radius: 100px;
  padding: 2px 8px;
  width: fit-content;
  font-weight: 600;
`;

const PostTitle = styled.p`
  ${font.H3};
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaName = styled.span`
  ${font.P3};
  color: #999;
`;

const MetaDot = styled.span`
  ${font.P3};
  color: #ccc;
`;

const MetaDate = styled.span`
  ${font.P3};
  color: #bbb;
`;

const MetaComment = styled.span`
  ${font.P3};
  color: #bbb;
`;

const LoadMoreButton = styled.button`
  ${font.P2};
  width: 100%;
  padding: 14px;
  margin-top: 16px;
  background: none;
  border: 1px solid #eee;
  border-radius: 12px;
  color: #999;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatusText = styled.p`
  ${font.P1};
  color: #bbb;
  text-align: center;
  margin-top: 60px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
`;

const EmptyTitle = styled.p`
  ${font.H2};
  color: #333;
`;

const EmptyDesc = styled.p`
  ${font.P2};
  color: #999;
`;

const EmptyButton = styled.button`
  ${font.Btn2};
  background: #FF4D4D;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
  &:active { opacity: 0.8; }
`;

'use client';

import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useParams, useRouter } from 'next/navigation';
import font from '@/_packages/design-system/src/font';
import { useAuthStore } from '@/_store/authStore';
import { auth } from '@/_lib/firebase';
import {
  getPost,
  getComments,
  createComment,
  deletePost,
  deleteComment,
  Post,
  Comment,
  AuthRequiredError,
  DANGER_COLORS,
  DANGER_BG_COLORS,
  formatDate,
} from '@/_lib/community';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [postLoading, setPostLoading] = useState(true);
  const [commentSending, setCommentSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getPost(id).catch(() => null),
      getComments(id).catch(() => []),
    ]).then(([postData, commentsData]) => {
      setPost(postData);
      setComments(commentsData);
    }).finally(() => setPostLoading(false));
  }, [id]);

  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    if (!user) {
      router.push(`/login?redirect=/community/${id}`);
      return;
    }
    try {
      setCommentSending(true);
      setError('');
      const newComment = await createComment(id, commentInput.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentInput('');
      setPost((prev) => prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) {
      if (err instanceof AuthRequiredError) {
        router.push(`/login?redirect=/community/${id}`);
      } else {
        setError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setCommentSending(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('게시글을 삭제할까요?')) return;
    try {
      await deletePost(id);
      router.push('/community');
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제할까요?')) return;
    try {
      await deleteComment(id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setPost((prev) => prev ? { ...prev, comment_count: Math.max(0, prev.comment_count - 1) } : prev);
    } catch {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const currentUid = auth.currentUser?.uid;

  if (postLoading) {
    return (
      <PageLayout>
        <TopBar>
          <BackButton onClick={() => router.push('/community')}>← 목록으로</BackButton>
        </TopBar>
        <LoadingText>불러오는 중...</LoadingText>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <TopBar>
          <BackButton onClick={() => router.push('/community')}>← 목록으로</BackButton>
        </TopBar>
        <LoadingText>게시글을 찾을 수 없습니다.</LoadingText>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopBar>
        <BackButton onClick={() => router.push('/community')}>← 목록으로</BackButton>
        {currentUid === post.uid && (
          <DeletePostButton onClick={handleDeletePost}>삭제</DeletePostButton>
        )}
      </TopBar>

      <ScrollArea>
        <PostSection>
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
            <MetaAuthor>{post.is_anonymous ? '익명' : post.display_name}</MetaAuthor>
            <MetaDot>·</MetaDot>
            <MetaDate>{formatDate(post.created_at)}</MetaDate>
          </PostMeta>
          <Divider />
          <PostContent>{post.content}</PostContent>
        </PostSection>

        <CommentSection>
          <CommentHeader>댓글 {comments.length}개</CommentHeader>
          {comments.length === 0 ? (
            <NoComment>첫 번째 댓글을 남겨보세요!</NoComment>
          ) : (
            <CommentList>
              {comments.map((c) => (
                <CommentItem key={c.id}>
                  <CommentTop>
                    <CommentAuthor>{c.display_name}</CommentAuthor>
                    <CommentRight>
                      <CommentDate>{formatDate(c.created_at)}</CommentDate>
                      {currentUid === c.uid && (
                        <CommentDeleteBtn onClick={() => handleDeleteComment(c.id)}>
                          삭제
                        </CommentDeleteBtn>
                      )}
                    </CommentRight>
                  </CommentTop>
                  <CommentContent>{c.content}</CommentContent>
                </CommentItem>
              ))}
            </CommentList>
          )}
          <div ref={bottomRef} />
        </CommentSection>
      </ScrollArea>

      <CommentBar>
        {error && <ErrorText>{error}</ErrorText>}
        <CommentInputRow>
          <CommentInput
            placeholder={user ? '댓글을 입력하세요...' : '댓글을 쓰려면 로그인하세요'}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
            maxLength={1000}
            readOnly={!user}
          />
          <SendButton
            onClick={handleSendComment}
            disabled={commentSending || !commentInput.trim()}
          >
            {commentSending ? '...' : '전송'}
          </SendButton>
        </CommentInputRow>
      </CommentBar>
    </PageLayout>
  );
};

export default PostDetailPage;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 54px 24px 16px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
  z-index: 10;
`;

const BackButton = styled.button`
  ${font.P2};
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const DeletePostButton = styled.button`
  ${font.P3};
  color: #FF4D4D;
  background: none;
  border: none;
  cursor: pointer;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 100px 24px 120px;
`;

const PostSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 24px;
`;

const DangerBadge = styled.span<{ color: string; bg: string }>`
  ${font.P3};
  color: ${({ color }) => color};
  background: ${({ bg }) => bg};
  border-radius: 100px;
  padding: 3px 10px;
  width: fit-content;
  font-weight: 700;
`;

const PostTitle = styled.h1`
  ${font.D3};
  color: #1a1a1a;
  word-break: keep-all;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MetaAuthor = styled.span`
  ${font.P3};
  color: #888;
  font-weight: 600;
`;

const MetaDot = styled.span`
  ${font.P3};
  color: #ccc;
`;

const MetaDate = styled.span`
  ${font.P3};
  color: #bbb;
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
`;

const PostContent = styled.p`
  ${font.P1};
  color: #333;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentSection = styled.div`
  padding-top: 16px;
`;

const CommentHeader = styled.h3`
  ${font.H4};
  color: #333;
  margin-bottom: 16px;
`;

const NoComment = styled.p`
  ${font.P2};
  color: #bbb;
  text-align: center;
  padding: 24px 0;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
`;

const CommentTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommentRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CommentAuthor = styled.span`
  ${font.P3};
  color: #555;
  font-weight: 600;
`;

const CommentDate = styled.span`
  ${font.P3};
  color: #bbb;
`;

const CommentDeleteBtn = styled.button`
  ${font.P3};
  color: #FF4D4D;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const CommentContent = styled.p`
  ${font.P2};
  color: #444;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentBar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ErrorText = styled.p`
  ${font.P3};
  color: #FF4D4D;
`;

const CommentInputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const CommentInput = styled.textarea`
  flex: 1;
  ${font.P2};
  color: #333;
  background: #f7f7f7;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  resize: none;
  outline: none;
  height: 42px;
  line-height: 1.5;
  &::placeholder { color: #bbb; }
  &:read-only { cursor: pointer; }
`;

const SendButton = styled.button`
  ${font.Btn3};
  background: #FF4D4D;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:active:not(:disabled) { opacity: 0.8; }
`;

const LoadingText = styled.p`
  ${font.P1};
  color: #bbb;
  text-align: center;
  margin-top: 100px;
`;

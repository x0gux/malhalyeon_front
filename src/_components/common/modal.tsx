import React, { useEffect, useCallback, useId } from 'react';
import styled from '@emotion/styled';
import { css, keyframes as emotionKeyframes } from '@emotion/react';
import font from '@/_packages/design-system/src/font';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  nextButtonLabel?: string;
  onNext?: () => void;
}


const overlayFadeIn = emotionKeyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const overlayFadeOut = emotionKeyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const sheetSlideIn = emotionKeyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const sheetSlideOut = emotionKeyframes`
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(100%); opacity: 0; }
`;


const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  nextButtonLabel = '다음 튜토리얼로 넘어가기',
  onNext,
}: ModalProps) => {
  const titleId = useId();

  // ESC 닫기 + body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Overlay 클릭 닫기
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const handleNext = useCallback(() => {
    onNext?.();
  }, [onNext]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick} isOpen={isOpen}>
      <ModalWrapper
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        isOpen={isOpen}
      >
        {/* ── Header ── */}
        <ModalHeader>
          {title && <ModalTitle id={titleId}>{title}</ModalTitle>}
          {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
        </ModalHeader>

        {/* ── Body ── */}
        <ModalBody>{children}</ModalBody>

        {/* ── Footer ── */}
        <ModalFooter>
          <NextButton onClick={handleNext} type="button">
            {nextButtonLabel}
          </NextButton>
        </ModalFooter>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: flex-end; /* bottom-sheet: 하단 정렬 */
  justify-content: center;

  background-color: rgba(180, 180, 180, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  animation: ${({ isOpen }) =>
    isOpen
      ? css`${overlayFadeIn} 0.25s ease forwards`
      : css`${overlayFadeOut} 0.2s ease forwards`};
`;

const ModalWrapper = styled.div<{ isOpen: boolean }>`
  width: 100%;
  max-width: 480px; /* 태블릿/데스크탑 대응 */
  background-color: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px -4px 20px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  overflow: hidden;

  animation: ${({ isOpen }) =>
    isOpen
      ? css`${sheetSlideIn} 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards`
      : css`${sheetSlideOut} 0.25s ease forwards`};
`;

const ModalHeader = styled.div`
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ModalTitle = styled.h2`
  ${font.H2};
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0;
`;


const ModalSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #999999;
`;

const ModalBody = styled.div`
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;


const ModalFooter = styled.div`
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
`;

const NextButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  background-color: #e84040;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;

  &:hover {
    background-color: #d63030;
  }

  &:active {
    background-color: #c42828;
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #e84040;
    outline-offset: 2px;
  }
`;
import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const kakaoSteps = [
  { img: '/images/kakaotalk_1.svg', text: '채팅방에 들어갑니다.' },
  { img: '/images/kakaotalk_2.svg', text: '우측 상단 메뉴(≡)를 누릅니다.' },
  { img: '/images/kakotalk_3.svg', text: '대화 내용 내보내기를 선택합니다.' },
];

const instaSteps = [
  { img: '/images/insta_1.svg', text: '설정에서 내보내기를 검색합니다.' },
  { img: '/images/insta_2.svg', text: '내 정보 다운로드에서 내보내기만들기를 선택합니다.' },
  { img: '/images/insta_3.svg', text: '기기로 내보내기를 선택합니다.' },
  { img: '/images/insta_4.svg', text: '내보내기 확인에서 형식을 html로 선택후 정보 맞춤 설정에 들어갑니다.' },
  { img: '/images/insta_5.svg', text: '메세지만 선택후 나머지를 전부 선택취소합니다.' },
  { img: '/images/insta_6.svg', text: '전체 기간을 선택합니다.' },
  { img: '/images/insta_7.svg', text: '다운로드 요청을 완료한 후 몇분후에 알림이 옵니다.' },
  { img: '/images/insta_8.svg', text: '사진의 내용대로 진행합니다'},
];

const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const overlayFadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const modalSlideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const modalSlideOut = keyframes`
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(20px); opacity: 0; }
`;

const TestModal = ({ isOpen, onClose }: TestModalProps) => {
  const [platform, setPlatform] = useState<'kakao' | 'insta'>('kakao');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStepIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const steps = platform === 'kakao' ? kakaoSteps : instaSteps;
  const currentStep = steps[stepIndex];

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose} isOpen={isOpen}>
      <ModalWrapper onClick={(e) => e.stopPropagation()} isOpen={isOpen}>
        <PlatformTabs>
          <Tab active={platform === 'kakao'} onClick={() => { setPlatform('kakao'); setStepIndex(0); }}>카카오톡</Tab>
          <Tab active={platform === 'insta'} onClick={() => { setPlatform('insta'); setStepIndex(0); }}>인스타그램</Tab>
        </PlatformTabs>
        
        <CardContainer>
          <ImageWrapper>
            <img src={currentStep.img} alt={`Step ${stepIndex + 1}`} />
          </ImageWrapper>
          
          <CardFooter>
            {stepIndex > 0 && (
              <LeftArrowIcon onClick={handlePrev}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7.5" stroke="#999999" strokeWidth="1"/>
                  <path d="M9.5 5L6.5 8L9.5 11" stroke="#999999" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </LeftArrowIcon>
            )}
            <FooterText>{currentStep.text}</FooterText>
            <RightArrowIcon onClick={handleNext}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7.5" stroke="#999999" strokeWidth="1"/>
                <path d="M6.5 5L9.5 8L6.5 11" stroke="#999999" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </RightArrowIcon>
          </CardFooter>
        </CardContainer>
        
        <Indicators>
          {steps.map((_, idx) => (
            <Dot key={idx} active={idx === stepIndex} />
          ))}
        </Indicators>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default TestModal;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  animation: ${({ isOpen }) =>
    isOpen
      ? css`${overlayFadeIn} 0.25s ease forwards`
      : css`${overlayFadeOut} 0.2s ease forwards`};
`;

const ModalWrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  animation: ${({ isOpen }) =>
    isOpen
      ? css`${modalSlideIn} 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards`
      : css`${modalSlideOut} 0.25s ease forwards`};
`;

const PlatformTabs = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 4px;
  gap: 4px;
  backdrop-filter: blur(10px);
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  background-color: ${({ active }) => (active ? '#ffffff' : 'transparent')};
  color: ${({ active }) => (active ? '#1a1a1a' : '#ffffff')};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? '700' : '500')};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CardContainer = styled.div`
  width: 335px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding-top: 16px;
`;

const ImageWrapper = styled.div`
  width: 303px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 24px;
  position: relative;
`;

const FooterText = styled.p`
  font-family: 'Pretendard', sans-serif;
  font-weight: 300; /* Thin */
  font-size: 13px;
  color: #000000;
  margin: 0;
  line-height: 1.5;
`;

const LeftArrowIcon = styled.div`
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const RightArrowIcon = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Indicators = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? '#ffffff' : 'rgba(255, 255, 255, 0.4)')};
  transition: background-color 0.2s ease;
`;

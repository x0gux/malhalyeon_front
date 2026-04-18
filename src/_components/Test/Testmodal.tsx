import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import Modal from '@/_components/common/modal';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestModal = ({ isOpen, onClose }: TestModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="대화 내보내기 방법"
      subtitle="카카오톡 기준으로 안내해드려요"
      nextButtonLabel="확인했어요"
      onNext={onClose}
    >
      <StepList>
        <StepItem>
          <StepNumber>1</StepNumber>
          <StepText>카카오톡에서 대화방을 엽니다</StepText>
        </StepItem>
        <StepItem>
          <StepNumber>2</StepNumber>
          <StepText>우측 상단 메뉴(≡) → <b>대화 내용 내보내기</b> 선택</StepText>
        </StepItem>
        <StepItem>
          <StepNumber>3</StepNumber>
          <StepText>저장된 <b>.txt, .csv</b> 파일을 업로드해주세요</StepText>
        </StepItem>
      </StepList>
    </Modal>
  );
};

export default TestModal;

const StepList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const StepNumber = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FF4D4D;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepText = styled.p`
  ${font.P2};
  color: #333333;
  line-height: 1.5;
  margin: 0;
  padding-top: 2px;
`;

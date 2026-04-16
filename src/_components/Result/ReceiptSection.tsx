'use client'
import styled from "@emotion/styled";
import font from "@/_packages/design-system/src/font";
import { motion } from "framer-motion";

interface AnalysisItem {
  behavior: string;
  count: number;
  description: string;
  evidence: string;
  likability_score: number;
}

interface ReceiptData {
  analysis_items: AnalysisItem[];
  final_verdict: {
    comment: string;
    status: string;
  };
  receipt_info: {
    service_name: string;
    target_name: string;
  };
}

interface ReceiptSectionProps {
  data: ReceiptData;
}

const ReceiptSection = ({ data }: ReceiptSectionProps) => {
  const total = data.analysis_items.reduce((sum, item) => sum + item.likability_score, 0);

  return (
    <Container
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <ReceiptCard>
        <Header>
          <ReceiptTitle>영수증</ReceiptTitle>
          <DashedLine />
        </Header>

        <Table>
          <thead>
            <tr>
              <Th align="left">행동</Th>
              <Th align="center">횟수</Th>
              <Th align="right">호감도</Th>
            </tr>
          </thead>
          <tbody>
            {data.analysis_items.map((item, index) => (
              <tr key={index}>
                <Td align="left">{item.behavior}</Td>
                <Td align="center">{item.count}</Td>
                <Td align="right" isNegative={item.likability_score < 0}>
                  {item.likability_score}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Footer>
          <DashedLine />
          <TotalRow>
            <span>합계</span>
            <TotalScore>{total}</TotalScore>
          </TotalRow>
          <Verdict>{data.final_verdict.comment}</Verdict>
        </Footer>
      </ReceiptCard>
    </Container>
  );
};

export default ReceiptSection;

const Container = styled(motion.section)`
  max-width: 500px;
  width: 100%;
  height: calc(90vh - 8vh);
  max-height: calc(90vh - 8vh);
  overflow-y: auto;
  position: absolute;
  bottom : 0%;
`;

const ReceiptCard = styled.div`
  background: #ffffff;
  padding: 10%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  width: 100%;
  border-radius: 36px 36px 0 0;
`;

const Verdict = styled.p`
  ${font.P2};
  color: #FF4D4D;
  text-align: center;
  line-height: 1.5;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ReceiptTitle = styled.h2`
  ${font.D3};
  color: #333;
`;

const DashedLine = styled.div`
  width: 100%;
  height: 1px;
  border-top: 2px dashed #eee;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ align: string }>`
  ${font.H4};
  color: #999;
  text-align: ${props => props.align};
  padding-bottom: 12px;
`;

const Td = styled.td<{ align: string; isNegative?: boolean }>`
  ${font.H2};
  color: ${props => props.isNegative ? "#FF4D4D" : "#333"};
  text-align: ${props => props.align};
  padding: 12px 0;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom : 10vh;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${font.H1};
`;

const TotalScore = styled.span`
  ${font.D2};
  color: #FF4D4D;
`;

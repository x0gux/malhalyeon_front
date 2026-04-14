'use client'
import styled from "@emotion/styled";
import font from "@/packages/design-system/src/font";
import { motion } from "framer-motion";

const RECEIPT_DATA = [
  { action: "가스라이팅", count: 3, score: -30 },
  { action: "잠수", count: 5, score: -40 },
  { action: "어장", count: 2, score: -50 },
  { action: "만날듯안만날듯", count: 3, score: -20 },
];

const ReceiptSection = () => {
  const totalScore = RECEIPT_DATA.reduce((acc, curr) => acc + curr.score, 0);

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
            {RECEIPT_DATA.map((item, index) => (
              <tr key={index}>
                <Td align="left">{item.action}</Td>
                <Td align="center">{item.count}</Td>
                <Td align="right" isNegative>{item.score}</Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Footer>
          <DashedLine />
          <TotalRow>
            <span>합계</span>
            <TotalScore>{totalScore}</TotalScore>
          </TotalRow>
        </Footer>
      </ReceiptCard>
    </Container>
  );
};

export default ReceiptSection;

const Container = styled(motion.section)`
  max-width : 500px;
  width : 100%;
  overflow : hidden;
  height : 100vh;
  position : fixed;
  top: 0px;
`;

const ReceiptCard = styled.div`
  z-index : 1000;
  background: #ffffff;
  padding : 10%;
  border-radius: 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height : 70vh;
  position : absolute;
  width: 100%;
  bottom : 0px;
  box-shadow: 0px -2vh 20px rgba(0, 0, 0, 0.5);
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

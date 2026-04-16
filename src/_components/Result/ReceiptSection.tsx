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

interface CompatibilityIssue {
  issue: string;
  severity: "높음" | "중간" | "낮음";
  detail: string;
}

interface ReceiptData {
  analysis_items: AnalysisItem[];
  compatibility_issues?: CompatibilityIssue[];
  final_verdict: {
    comment: string;
    status: string;
  };
  receipt_info: {
    service_name: string;
    target_name: string;
  };
  user_type?: string;
}

interface ReceiptSectionProps {
  data: ReceiptData;
}

const SEVERITY_COLOR: Record<string, string> = {
  "높음": "#FF4D4D",
  "중간": "#FF9800",
  "낮음": "#9E9E9E",
};

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
          {data.user_type && data.user_type !== "미검사" && (
            <UserTypeBadge>내 유형: {data.user_type}</UserTypeBadge>
          )}
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

        <DashedLine />

        <TotalRow>
          <span>합계</span>
          <TotalScore>{total}</TotalScore>
        </TotalRow>

        {data.compatibility_issues && data.compatibility_issues.length > 0 && (
          <>
            <SectionTitle>만나면 안되는 이유</SectionTitle>
            <IssueList>
              {data.compatibility_issues.map((issue, index) => (
                <IssueCard key={index}>
                  <IssueHeader>
                    <IssueTitle>{issue.issue}</IssueTitle>
                    <SeverityBadge severity={issue.severity}>{issue.severity}</SeverityBadge>
                  </IssueHeader>
                  <IssueDetail>{issue.detail}</IssueDetail>
                </IssueCard>
              ))}
            </IssueList>
          </>
        )}

        <DashedLine />

  
        <VerdictBox>
          <VerdictStatus>{data.final_verdict.status}</VerdictStatus>
          <Verdict>{data.final_verdict.comment}</Verdict>
        </VerdictBox>

      </ReceiptCard>
    </Container>
  );
};

export default ReceiptSection;

const Container = styled(motion.section)`
  max-width: 500px;
  width: 100%;
  height: calc(90dvh - 8vh);
  max-height: calc(90dvh - 8vh);
  overflow-y: auto;
  position: absolute;
  bottom: 0;
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
  padding-bottom: 15vh;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ReceiptTitle = styled.h2`
  ${font.D3};
  color: #333;
`;

const UserTypeBadge = styled.span`
  ${font.P2};
  background: #fff5f5;
  color: #FF4D4D;
  border: 1px solid #FF4D4D;
  border-radius: 20px;
  padding: 4px 14px;
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

const SectionTitle = styled.h3`
  ${font.H2};
  color: #333;
`;

const IssueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IssueCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const IssueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IssueTitle = styled.span`
  ${font.H3};
  color: #333;
`;

const SeverityBadge = styled.span<{ severity: string }>`
  ${font.P3};
  color: ${({ severity }) => SEVERITY_COLOR[severity] ?? "#ccc"};
  font-weight: 600;
`;

const IssueDetail = styled.p`
  ${font.P2};
  color: #666;
  line-height: 1.5;
`;

const VerdictBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const VerdictStatus = styled.span`
  ${font.H1};
  color: #FF4D4D;
  font-weight: 700;
`;

const Verdict = styled.p`
  ${font.P2};
  color: #FF4D4D;
  text-align: center;
  line-height: 1.5;
`;
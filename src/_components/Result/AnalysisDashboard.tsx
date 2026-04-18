'use client';

import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import font from '@/_packages/design-system/src/font';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface AnalysisItem {
  behavior: string;
  count: number;
  likability_score: number;
}

interface DashboardProps {
  items: AnalysisItem[];
}

const AnalysisDashboard = ({ items }: DashboardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 데이터 변환: Radar Chart용 (절대값으로 치명도 표시)
  const radarData = items.map(item => ({
    subject: item.behavior,
    A: Math.abs(item.likability_score),
    fullMark: 100,
  }));

  // 데이터 변환: Bar Chart용
  const barData = items.slice().sort((a, b) => b.count - a.count);

  const COLORS = ['#FF4D4D', '#FF8A8A', '#FFC1C1', '#FFE4E4', '#FFEFEF'];

  return (
    <DashboardContainer ref={containerRef}>
      <SectionTitle>심층 분석 리포트</SectionTitle>
      
      <ChartSection>
        <ChartTitle>유해 행동 치명도 분포</ChartTitle>
        <ChartDesc>어떤 행동이 관계에 가장 치명적인지 나타냅니다.</ChartDesc>
        <ChartWrapper height={350}>
          {chartWidth > 0 && (
            <RadarChart 
              width={chartWidth - 60} 
              height={350}
              cx="50%" 
              cy="50%" 
              outerRadius="65%" 
              data={radarData}
            >
              <PolarGrid stroke="#eee" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#666', fontSize: 11 }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
              <Radar
                name="치명도"
                dataKey="A"
                stroke="#FF4D4D"
                fill="#FF4D4D"
                fillOpacity={0.6}
              />
            </RadarChart>
          )}
        </ChartWrapper>
      </ChartSection>

      <ChartSection>
        <ChartTitle>행동 빈도수 통계</ChartTitle>
        <ChartDesc>대화 중 반복적으로 나타난 행동 패턴입니다.</ChartDesc>
        <ChartWrapper height={300}>
          {chartWidth > 0 && (
            <BarChart 
              width={chartWidth - 60}
              height={300}
              data={barData} 
              layout="vertical" 
              margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="behavior" 
                tick={{ fill: '#333', fontSize: 11 }} 
                width={120}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ChartWrapper>
      </ChartSection>

      <SummaryBox>
        <SummaryText>
          💡 <strong>분석 총평</strong><br />
          {items.length > 0 ? (
            `가장 빈번한 '${barData[0].behavior}' 행동과 가장 치명적인 '${items.reduce((max, i) => Math.abs(i.likability_score) > Math.abs(max.likability_score) ? i : max).behavior}' 행동이 복합적으로 나타나고 있습니다.`
          ) : "분석된 행동 데이터가 부족합니다."}
        </SummaryText>
      </SummaryBox>
    </DashboardContainer>
  );
};

export default AnalysisDashboard;

const DashboardContainer = styled.div`
  padding: 30px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 40px;
  border-top: 1px solid #eee;
  padding-bottom: 100px;
`;

const SectionTitle = styled.h2`
  ${font.D3};
  color: #000;
  text-align: center;
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChartTitle = styled.h3`
  ${font.H2};
  color: #333;
`;

const ChartDesc = styled.p`
  ${font.P3};
  color: #999;
`;

const SummaryBox = styled.div`
  background: #fff5f5;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #ffe4e4;
`;

const SummaryText = styled.p`
  ${font.P2};
  color: #FF4D4D;
  line-height: 1.6;
`;

const ChartWrapper = styled.div<{ height: number }>`
  width: 100%;
  height: ${({ height }) => height}px;
  min-width: 0;
  position: relative;
`;


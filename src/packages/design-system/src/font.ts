import { css } from "@emotion/react";

const fontGenerator = (weight: number, size: number) => css`
  font-family: "Pretendard";
  font-weight: ${weight};
  font-size: ${size}px;
  line-height: auto;
`;

const font = {
  D1: fontGenerator(400, 34),
  D2: fontGenerator(700, 28),
  D3: fontGenerator(600, 22),

  H1: fontGenerator(600, 20),
  H2: fontGenerator(500, 18),
  H3: fontGenerator(500, 16),
  H4: fontGenerator(600, 14),

  P1: fontGenerator(400, 16),
  P2: fontGenerator(400, 14),
  P3: fontGenerator(400, 12),
  P4: fontGenerator(400, 10),

  Btn1: fontGenerator(700, 16),
  Btn2: fontGenerator(700, 14),
  Btn3: fontGenerator(700, 12),
};

export default font;
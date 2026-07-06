import styled from '@emotion/styled';
import { colors } from '@/styles/colors';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px 12px;
`;

export const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${colors.black[300]};
  word-break: keep-all;
`;

export const Description = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.black[100]};
  word-break: keep-all;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  button {
    flex: 1;
  }
`;

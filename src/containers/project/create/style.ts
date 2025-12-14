import styled from '@emotion/styled';
import { primary, black } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const PageWrapper = styled.div`
  margin-left: 17.5rem;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 5rem 2.25rem;
`;

export const PageTitle = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 3rem;
  color: ${black[300]};
  margin: 0 0 1.5rem 0;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 39.5rem;
`;

export const NoticeText = styled.p`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.light};
  font-size: 1rem;
  line-height: 1.125rem;
  letter-spacing: -0.15px;
  color: ${black[75]};
  margin: 1.5rem 0 0 0;
  white-space: pre-line;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: flex-end;
  margin-top: 3rem;
`;

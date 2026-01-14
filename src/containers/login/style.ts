import styled from '@emotion/styled';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffffff;
`;

export const LoginContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  margin: 0 auto;
`;

export const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LogoImage = styled.div`
  position: relative;
  width: 10rem;
  aspect-ratio: 209 / 193;
`;

export const LogoText = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.bold};
  font-size: 4.2rem;
  color: #000000;
  text-transform: capitalize;
  margin: 0;
  text-align: center;
`;

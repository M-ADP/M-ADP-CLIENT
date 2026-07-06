import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const DocsLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  height: 100vh;
  width: 100%;
  background-color: #f8f9fc;
  box-sizing: border-box;

  @media (max-width: 1180px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;


export const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const Article = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 40px 120px;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 640px) {
    padding: 40px 20px 96px;
  }
`;

export const Eyebrow = styled.span`
  display: inline-block;
  margin-bottom: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.primary[10]};
  background: rgba(17, 116, 247, 0.08);
`;

export const PageTitle = styled.h1`
  margin: 0 0 12px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${colors.black[300]};
  word-break: keep-all;
`;

export const Lead = styled.p`
  margin: 0 0 8px;
  font-size: 17px;
  line-height: 1.6;
  color: ${colors.black[100]};
  word-break: keep-all;
`;

export const Section = styled.section`
  scroll-margin-top: 24px;
  padding-top: 48px;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${colors.black[300]};
  word-break: keep-all;
`;

export const SubTitle = styled.h3`
  margin: 28px 0 10px;
  font-size: 17px;
  font-weight: 600;
  color: ${colors.black[200]};
  word-break: keep-all;
`;

export const Paragraph = styled.p`
  margin: 0 0 14px;
  font-size: 15px;
  line-height: 1.7;
  color: ${colors.black[200]};
  word-break: keep-all;
`;

export const InlineCode = styled.code`
  padding: 2px 6px;
  border-radius: 6px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
  color: ${colors.primary.default};
  background: rgba(3, 9, 130, 0.06);
`;

export const List = styled.ul`
  margin: 0 0 14px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  li {
    font-size: 15px;
    line-height: 1.6;
    color: ${colors.black[200]};
    word-break: keep-all;
  }

  li::marker {
    color: ${colors.primary[10]};
  }
`;

export const CodeBlock = styled.pre`
  margin: 0 0 18px;
  padding: 16px 18px;
  border-radius: 12px;
  background: ${colors.background.primary};
  color: #e6ebff;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.06);

  .cmt {
    color: #6f7aa8;
  }
`;

export const Callout = styled.div<{ $variant?: 'info' | 'warning' }>`
  margin: 0 0 18px;
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.black[200]};
  word-break: keep-all;
  background: ${({ $variant }) =>
    $variant === 'warning' ? '#fff8ed' : 'rgba(17, 116, 247, 0.06)'};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'warning' ? '#fed7aa' : 'rgba(17, 116, 247, 0.18)'};

  strong {
    color: ${colors.black[300]};
  }
`;

export const CalloutIcon = styled.span`
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1.5;
`;

export const Table = styled.table`
  width: 100%;
  margin: 0 0 18px;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid ${colors.black[50]};
    word-break: keep-all;
  }

  th {
    font-weight: 600;
    color: ${colors.black[300]};
    background: #f8f9fc;
  }

  td {
    color: ${colors.black[200]};
  }
`;


export const Toc = styled.aside`
  height: 100%;
  overflow-y: auto;
  padding: 56px 20px 48px;

  @media (max-width: 1180px) {
    display: none;
  }
`;

export const TocTitle = styled.div`
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${colors.black[75]};
`;

export const TocList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 1px solid ${colors.black[50]};
`;

export const TocLink = styled.a<{ $active: boolean }>`
  display: block;
  margin-left: -1px;
  padding: 5px 12px;
  border-left: 2px solid
    ${({ $active }) => ($active ? colors.primary[10] : 'transparent')};
  font-size: 13px;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
  word-break: keep-all;
  transition: color 0.15s ease, border-color 0.15s ease;

  color: ${({ $active }) =>
    $active ? colors.primary.default : colors.black[75]};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};

  &:hover {
    color: ${colors.black[300]};
  }
`;

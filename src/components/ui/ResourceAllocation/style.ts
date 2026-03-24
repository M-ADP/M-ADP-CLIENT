import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export const AllocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  box-sizing: border-box;
`;

export const AllocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProjectCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 20px;
  background: #FFF;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(60px);
`;

export const ProjectName = styled.h3`
  font-family: ${typography.text16Bold.fontFamily};
  font-size: ${typography.text16Bold.fontSize};
  font-weight: ${typography.text16Bold.fontWeight};
  line-height: ${typography.text16Bold.lineHeight};
  color: ${colors.black[300]};
  margin: 0;
`;

export const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

export const ResourceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ResourceHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ResourceLabel = styled.span`
  font-family: ${typography.text12Medium.fontFamily};
  font-size: ${typography.text12Medium.fontSize};
  font-weight: ${typography.text12Medium.fontWeight};
  line-height: ${typography.text12Medium.lineHeight};
  color: ${colors.black[100]};
  text-transform: uppercase;
`;

export const ResourceValue = styled.span`
  font-family: ${typography.text16Bold.fontFamily};
  font-size: ${typography.text16Bold.fontSize};
  font-weight: ${typography.text16Bold.fontWeight};
  line-height: ${typography.text16Bold.lineHeight};
  color: ${colors.black[300]};
`;

export const ProgressBarWrapper = styled.div`
  width: 100%;
`;

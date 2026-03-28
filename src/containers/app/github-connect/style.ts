import styled from '@emotion/styled';
import { black } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
`;

export const GithubLogoContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: 700;
  font-size: 32px;
  color: ${black[300] || '#000000'};
  margin-top: 0;
  margin-bottom: 3rem;
  letter-spacing: -0.5px;
`;

export const SelectsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 4rem;
  width: 100%;
  max-width: 600px;
  justify-content: center;
`;

export const SelectWrapper = styled.div<{ width?: string }>`
  position: relative;
  width: ${({ width }) => width || '100%'};
`;

export const SelectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background-color: #1c2128;
  border-radius: 6px;
  cursor: pointer;
  color: #ffffff;
  font-size: 15px;
  font-family: ${FONT_FAMILY};
  font-weight: 500;
  user-select: none;
`;

export const SelectValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 6px;
  background-color: #1c2128;
  border-radius: 6px;
  list-style: none;
  padding: 8px 0;
  margin-bottom: 0;
  max-height: 240px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  
  /* Scrollbar for webkit */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
`;

export const DropdownItem = styled.li`
  padding: 10px 16px;
  color: #ffffff;
  font-size: 14px;
  font-family: ${FONT_FAMILY};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
`;

export const ProfileImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ffffff;
  object-fit: cover;
  flex-shrink: 0;
`;

export const DefaultIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.2);
  flex-shrink: 0;
`;

export const ChevronWrapper = styled.div<{ isOpen: boolean }>`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(-90deg)' : 'rotate(90deg)')};
  
  img {
    filter: invert(0.6);
  }
`;

export const SubmitButton = styled.button`
  background-color: #1c2128;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 15px;
  font-family: ${FONT_FAMILY};
  font-weight: 500;
  cursor: pointer;
  min-width: 160px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2d333b;
  }
`;

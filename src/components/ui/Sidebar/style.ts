import styled from '@emotion/styled';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export const Container = styled.aside<{ $collapsed?: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '80px' : '280px')};
  height: 100vh;
  background: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 100;
`;

export const Header = styled.header`
  padding: 24px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Brand = styled.span`
  font-family: ${typography.text28Semibold.fontFamily};
  font-size: ${typography.text28Semibold.fontSize};
  font-weight: ${typography.text28Semibold.fontWeight};
  line-height: ${typography.text28Semibold.lineHeight};
  color: ${colors.black[300]};
  white-space: nowrap;
`;

export const ExpandButton = styled.button<{ $collapsed?: boolean }>`
  position: fixed;
  left: ${({ $collapsed }) => ($collapsed ? '68px' : '268px')};
  top: 30px;
  width: 24px;
  height: 24px;
  border: 1px solid ${colors.black[50]};
  background: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  transition: left 0.3s ease;
  padding: 0;

  img {
    transform: ${({ $collapsed }) => ($collapsed ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.3s;
  }

  &:hover {
    background: ${colors.black[50]};
  }
`;

export const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

export const Section = styled.nav`
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const NavItem = styled.button<{ $active?: boolean; $collapsed?: boolean }>`
  padding: 12px ${({ $collapsed }) => ($collapsed ? '0' : '16px')};
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 12px;
  border: none;
  background: ${({ $active }) => ($active ? '#e6e8fb' : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  width: 100%;

  &:hover {
    background: ${({ $active }) => ($active ? '#e6e8fb' : colors.black[50])};
  }
`;

export const IconWrapper = styled.span<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    filter: ${({ $active }) =>
    $active
      ? 'brightness(0) saturate(100%) invert(9%) sepia(98%) saturate(7498%) hue-rotate(246deg) brightness(92%) contrast(109%)'
      : 'brightness(0) saturate(100%) invert(47%) sepia(0%) saturate(0%) hue-rotate(201deg) brightness(93%) contrast(87%)'};
  }
`;

export const SubNavContainer = styled.div`
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease;

  &[data-open='true'] {
    max-height: 200px;
    opacity: 1;
  }
`;

export const SubNavItem = styled.div`
  padding: 10px 16px 10px 48px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease;

  [data-open='true'] & {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s;
  }

  [data-open='true'] &:nth-of-type(1) {
    transition-delay: 0.05s;
  }

  [data-open='true'] &:nth-of-type(2) {
    transition-delay: 0.1s;
  }

  &:hover {
    background: ${colors.black[50]};
  }
`;

export const NavLabel = styled.span<{ $active?: boolean }>`
  font-family: ${({ $active }) => $active ? typography.text14Semibold.fontFamily : typography.text14Medium.fontFamily};
  font-size: ${({ $active }) => $active ? typography.text14Semibold.fontSize : typography.text14Medium.fontSize};
  font-weight: ${({ $active }) => $active ? typography.text14Semibold.fontWeight : typography.text14Medium.fontWeight};
  line-height: ${({ $active }) => $active ? typography.text14Semibold.lineHeight : typography.text14Medium.lineHeight};
  color: ${({ $active }) => ($active ? colors.primary.default : colors.black[100])};
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Divider = styled.div`
  height: 1px;
  margin: 12px 0;
  background: ${colors.black[50]};
`;

export const Footer = styled.footer`
  padding: 24px;
  border-top: 1px solid ${colors.black[50]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
`;

export const ProfileInner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

export const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${colors.primary.default};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  font-family: ${typography.text16Semibold.fontFamily};
  font-size: ${typography.text16Semibold.fontSize};
  font-weight: ${typography.text16Semibold.fontWeight};
  line-height: ${typography.text16Semibold.lineHeight};
  color: #ffffff;
`;

export const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const ProfileSub = styled.span`
  font-family: ${typography.text14Regular.fontFamily};
  font-size: ${typography.text14Regular.fontSize};
  font-weight: ${typography.text14Regular.fontWeight};
  line-height: ${typography.text14Regular.lineHeight};
  color: ${colors.black[100]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfileName = styled.span`
  font-family: ${typography.text18Medium.fontFamily};
  font-size: ${typography.text18Medium.fontSize};
  font-weight: ${typography.text18Medium.fontWeight};
  line-height: ${typography.text18Medium.lineHeight};
  color: ${colors.black[300]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Caret = styled.span`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

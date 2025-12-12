'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import * as S from './style';

const PRIMARY_NAV = [
  { key: 'dashboard', label: '대시보드', icon: '/icons/sidebar/dashboard.svg', path: '/' },
  {
    key: 'project',
    label: '프로젝트',
    icon: '/icons/sidebar/dashboard.svg',
    path: '/project',
    children: [
      { key: 'project-create', label: '프로젝트 생성', path: '/project/create' },
      { key: 'project-manage', label: '프로젝트 관리', path: '/project/manage' },
    ],
  },
  { key: 'report', label: '분석', icon: '/icons/sidebar/analytics.svg', path: '/report' },
];

const SECONDARY_NAV = [
  { key: 'alarm', label: '알림', icon: '/icons/sidebar/alarm.svg', path: '/alarm' },
  { key: 'settings', label: '설정', icon: '/icons/sidebar/setting.svg', path: '/settings' },
  { key: 'support', label: '서포트', icon: '/icons/sidebar/support.svg', path: '/support' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('project');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedMenu(null);
    }
  };

  const toggleMenu = (key: string) => {
    if (isCollapsed) return;
    setExpandedMenu(expandedMenu === key ? null : key);
  };

  const handleNavigation = (path: string, hasChildren?: boolean) => {
    if (!hasChildren) {
      router.push(path);
    }
  };

  const isActive = (path: string, hasChildren?: boolean) => {
    if (hasChildren) {
      return pathname?.startsWith(path);
    }
    return pathname === path;
  };

  return (
    <S.Container $collapsed={isCollapsed}>
      <S.Header>
        <S.Logo>
          <Image src="/assets/logo.svg" alt="M-ADP Logo" width={32} height={32} />
          {!isCollapsed && <S.Brand>M-ADP</S.Brand>}
        </S.Logo>
      </S.Header>

      <S.ExpandButton onClick={toggleSidebar} $collapsed={isCollapsed}>
        <Image src="/icons/sidebar/chevron-left.svg" alt="toggle" width={16} height={16} />
      </S.ExpandButton>

      <S.Main>
        <S.Section>
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.path, !!item.children);
            return (
              <div key={item.key}>
                <S.NavItem
                  $active={active}
                  $collapsed={isCollapsed}
                  onClick={() => {
                    if (item.children) {
                      toggleMenu(item.key);
                    } else {
                      handleNavigation(item.path!);
                    }
                  }}
                >
                  <S.IconWrapper $active={active}>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                  </S.IconWrapper>
                  {!isCollapsed && (
                    <S.NavLabel $active={active}>{item.label}</S.NavLabel>
                  )}
                </S.NavItem>
                {!isCollapsed && item.children && (
                  <S.SubNavContainer data-open={expandedMenu === item.key ? 'true' : 'false'}>
                    {item.children.map((child) => (
                      <S.SubNavItem key={child.key} onClick={() => handleNavigation(child.path!)}>
                        <S.NavLabel $active={pathname === child.path}>{child.label}</S.NavLabel>
                      </S.SubNavItem>
                    ))}
                  </S.SubNavContainer>
                )}
              </div>
            );
          })}
        </S.Section>

        <S.Divider />

        <S.Section>
          {SECONDARY_NAV.map((item) => (
            <S.NavItem
              key={item.key}
              $collapsed={isCollapsed}
              onClick={() => handleNavigation(item.path)}
            >
              <S.IconWrapper>
                <Image src={item.icon} alt={item.label} width={20} height={20} />
              </S.IconWrapper>
              {!isCollapsed && <S.NavLabel>{item.label}</S.NavLabel>}
            </S.NavItem>
          ))}
        </S.Section>
      </S.Main>

      {!isCollapsed && (
        <S.Footer>
          <S.ProfileInner>
            <S.Avatar>N</S.Avatar>
            <S.ProfileText>
              <S.ProfileSub>부산소프트웨어마이스터고</S.ProfileSub>
              <S.ProfileName>류승찬</S.ProfileName>
            </S.ProfileText>
          </S.ProfileInner>
          <S.Caret>
            <Image src="/icons/sidebar/chevron-right.svg" alt="profile" width={20} height={20} />
          </S.Caret>
        </S.Footer>
      )}
    </S.Container>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import * as S from './style';
import { useUserStore } from '@/store/userStore';
import { useUserProfileQuery } from '@/services/user/user.query';
import { useProjectListQuery, useProjectDetailQuery } from '@/services/project/project.query';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useSessions } from '@/services/chatops/chatops.query';
import { useDeleteSession } from '@/services/chatops/chatops.mutation';
import { postLogout } from '@/services/login/login.api';
import Cookies from 'js-cookie';

interface DetailNavItem {
  key: string;
  label: string;
}

interface SidebarChildItem {
  key: string;
  label: string;
  path: string;
}

interface SidebarItem {
  key: string;
  label: string;
  icon: string;
  path: string;
  children?: SidebarChildItem[];
}

const DETAIL_TABS: DetailNavItem[] = [
  { key: 'project-info', label: '프로젝트 정보' },
];

const PRIMARY_NAV: SidebarItem[] = [
  { key: 'dashboard', label: '대시보드', icon: '/icons/sidebar/dashboard.svg', path: '/' },
  {
    key: 'project',
    label: '프로젝트',
    icon: '/icons/sidebar/dashboard.svg',
    path: '/project',
    children: [
      { key: 'project-create', label: '프로젝트 생성', path: '/project/create' },
    ],
  },
  { key: 'report', label: '분석', icon: '/icons/sidebar/analytics.svg', path: '/report' },
  { key: 'agent', label: 'ChatOps', icon: '/icons/sidebar/chat.svg', path: '/agent', children: [] },
];

const SECONDARY_NAV = [
  { key: 'alarm', label: '알림', icon: '/icons/sidebar/alarm.svg', path: '/alarm' },
  { key: 'settings', label: '설정', icon: '/icons/sidebar/setting.svg', path: '/settings' },
  { key: 'support', label: '서포트', icon: '/icons/sidebar/support.svg', path: '/support' },
];

const extractAppName = (app: Record<string, unknown>, index: number) => {
  const candidates: unknown[] = [
    app.name,
    app.app_name,
    app.application_name,
    app.deployment_name,
    app.service_name,
    (app.application as Record<string, unknown> | undefined)?.name,
    (app.deployment as Record<string, unknown> | undefined)?.name,
  ];

  const matched = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
  if (typeof matched === 'string') return matched.trim();
  return `앱 ${index + 1}`;
};

const extractAppId = (app: Record<string, unknown>) => {
  const candidates: unknown[] = [
    app.id,
    app.app_id,
    app.application_id,
    app.deployment_id,
    (app.application as Record<string, unknown> | undefined)?.id,
    (app.deployment as Record<string, unknown> | undefined)?.id,
  ];
  const matched = candidates.find((value) => value !== undefined && value !== null && String(value).trim().length > 0);
  return matched ? String(matched).trim() : '';
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { step, setStep } = useAuthStore();
  const { user, setUser } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [currentAppName, setCurrentAppName] = useState('');

  useUserProfileQuery();
  const { data: projectListData } = useProjectListQuery();
  const { hiddenDeletedSessionIds, resetRequest } = useChatStore();
  const activeSessionId = (() => {
    const match = pathname?.match(/^\/agent\/(\d+)/);
    return match ? Number(match[1]) : null;
  })();
  const {
    data: sessionListData,
    isPending: isSessionsPending,
    isError: isSessionsError,
  } = useSessions();
  const deleteSessionMutation = useDeleteSession();
  const sessions = (sessionListData?.sessions ?? []).filter(
    (session) => !hiddenDeletedSessionIds.includes(session.session_id)
  );

  useEffect(() => {
    if (pathname !== '/login' && step === 'github') {
      setStep('google');
    }
  }, [pathname, step, setStep]);

  useEffect(() => {
    if (isCollapsed) return;

    if (pathname?.startsWith('/agent')) {
      setExpandedMenu('agent');
      return;
    }

    if (pathname?.startsWith('/project')) {
      setExpandedMenu('project');
    }
  }, [isCollapsed, pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queryAppName = new URLSearchParams(window.location.search).get('appName') || '';
    setCurrentAppName(queryAppName.trim());
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await postLogout();
    } catch {
    } finally {
      Cookies.remove('token', { path: '/' });
      setUser(null);
      setStep('google');
      router.push('/login');
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      if (!prev) {
        setExpandedMenu(null);
      }
      return !prev;
    });
  };

  const toggleMenu = (key: string) => {
    if (isCollapsed) return;
    setExpandedMenu((prev) => (prev === key ? null : key));
  };

  const handleNavigation = (path: string, hasChildren?: boolean) => {
    if (!hasChildren) {
      router.push(path);
    }
  };

  const handleDeleteSession = (sessionId: number) => {
    if (deleteSessionMutation.isPending) return;
    if (!window.confirm('이 대화를 삭제할까요?')) return;

    deleteSessionMutation.mutate(
      { sessionId },
      {
        onSuccess: async () => {
          const isDeletingActiveSession = activeSessionId === sessionId;

          if (isDeletingActiveSession) {
            resetRequest();
            router.replace('/agent');
          }
        },
      }
    );
  };

  const isActive = (path: string, hasChildren?: boolean) => {
    if (hasChildren) {
      return pathname?.startsWith(path);
    }
    return pathname === path;
  };

  const currentProjectId = pathname?.match(/^\/project\/manage\/([^/]+)/)?.[1] ?? null;
  const inProjectDetail = Boolean(currentProjectId);
  const inAppManage = Boolean(pathname?.match(/^\/project\/manage\/[^/]+\/app(?:\/|$)/));
  const { data: currentProjectDetail, isPending: isAppsPending } = useProjectDetailQuery(currentProjectId || '');
  const currentProjectApps = currentProjectDetail?.deployments ?? [];

  if (pathname?.startsWith('/login') || pathname?.startsWith('/oauth2/callback')) {
    return null;
  }

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
            const isSubNavOpen = expandedMenu === item.key || active;
            return (
              <div key={item.key}>
                <S.NavItem
                  $active={active}
                  $collapsed={isCollapsed}
                  onClick={() => {
                    if (item.children) {
                      toggleMenu(item.key);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                >
                  <S.IconWrapper $active={active}>
                    <Image src={item.icon} alt={item.label} width={20} height={20} />
                  </S.IconWrapper>
                  {!isCollapsed && <S.NavLabel $active={active}>{item.label}</S.NavLabel>}
                </S.NavItem>

                {!isCollapsed && item.children && (
                  <S.SubNavContainer data-open={isSubNavOpen ? 'true' : 'false'}>
                    {item.children.map((child) => {
                      const childActive = pathname === child.path;
                      return (
                        <S.SubNavItem key={child.key} onClick={() => handleNavigation(child.path)}>
                          <S.NavLabel $active={childActive}>{child.label}</S.NavLabel>
                        </S.SubNavItem>
                      );
                    })}

                    {item.key === 'project' && projectListData?.items && projectListData.items.length > 0 && (
                      <S.SubNavLabel />
                    )}
                    {item.key === 'project' && projectListData?.items?.map((project) => {
                      const isThisProject = currentProjectId === project.id;
                      return (
                        <div key={project.id}>
                          <S.SubNavItem onClick={() => handleNavigation(`/project/manage/${project.id}`)}>
                            <S.NavLabel $active={isThisProject}>{project.name}</S.NavLabel>
                          </S.SubNavItem>

                          {/* 현재 보고 있는 프로젝트이면 하위 탭 표시 */}
                          {isThisProject && (
                            <S.DeepNavContainer data-open="true">
                              {DETAIL_TABS.map((detail) => {
                                const detailActive = detail.key === 'project-info'
                                  ? inProjectDetail && !inAppManage
                                  : false;
                                const detailPath = detail.key === 'project-info'
                                  ? `/project/manage/${project.id}`
                                  : null;

                                return (
                                  <S.DeepNavItem
                                    key={detail.key}
                                    $clickable={Boolean(detailPath)}
                                    onClick={() => {
                                      if (detailPath) {
                                        handleNavigation(detailPath);
                                      }
                                    }}
                                  >
                                    <S.NavLabel $active={detailActive}>{detail.label}</S.NavLabel>
                                  </S.DeepNavItem>
                                );
                              })}

                              {currentProjectId === project.id && (
                                <>
                                  {isAppsPending ? (
                                    <S.DeepNavItem>
                                      <S.NavLabel>앱 불러오는 중...</S.NavLabel>
                                    </S.DeepNavItem>
                                  ) : currentProjectApps.length === 0 ? (
                                    <S.DeepNavItem>
                                      <S.NavLabel>앱 없음</S.NavLabel>
                                    </S.DeepNavItem>
                                  ) : (
                                    currentProjectApps.map((app, index) => {
                                      const appRecord = app as unknown as Record<string, unknown>;
                                      const displayName = extractAppName(appRecord, index);
                                      const appId = extractAppId(appRecord);
                                      const query = new URLSearchParams({ appName: displayName });
                                      if (appId) {
                                        query.set('appId', appId);
                                      }
                                      const appPath = `/project/manage/${project.id}/app?${query.toString()}`;
                                      const isAppActive = inAppManage
                                        && (currentAppName ? currentAppName === displayName : index === 0);
                                      return (
                                        <S.DeepNavItem
                                          key={`${project.id}-${displayName}-${index}`}
                                          $clickable
                                          onClick={() => {
                                            setCurrentAppName(displayName);
                                            handleNavigation(appPath);
                                          }}
                                        >
                                          <S.NavLabel $active={isAppActive}>{displayName}</S.NavLabel>
                                        </S.DeepNavItem>
                                      );
                                    })
                                  )}
                                </>
                              )}
                            </S.DeepNavContainer>
                          )}
                        </div>
                      );
                    })}
                    {item.key === 'agent' && (
                      <S.SubNavItem onClick={() => {
                        handleNavigation('/agent');
                      }}>
                        <S.NavLabel $active={!activeSessionId && pathname === '/agent'}>+ 새 채팅</S.NavLabel>
                      </S.SubNavItem>
                    )}
                    {item.key === 'agent' && isSessionsPending && (
                      <S.SubNavItem>
                        <S.NavLabel>세션 불러오는 중...</S.NavLabel>
                      </S.SubNavItem>
                    )}
                    {item.key === 'agent' && isSessionsError && (
                      <S.SubNavItem>
                        <S.NavLabel>세션을 불러오지 못했습니다</S.NavLabel>
                      </S.SubNavItem>
                    )}
                    {item.key === 'agent' && !isSessionsPending && !isSessionsError && sessions.length === 0 && (
                      <S.SubNavItem>
                        <S.NavLabel>세션 없음</S.NavLabel>
                      </S.SubNavItem>
                    )}
                    {item.key === 'agent' && sessions.length > 0 && (
                      <S.SubNavLabel />
                    )}
                    {item.key === 'agent' && sessions.map((session) => {
                      const isThisSession = activeSessionId === session.session_id;
                      const sessionLabel = session.title || session.last_message_preview || '새 채팅';
                      return (
                        <S.SessionRow key={session.session_id}>
                          <S.SubNavItem onClick={() => {
                            handleNavigation(`/agent/${session.session_id}`);
                          }}>
                            <S.NavLabel $active={isThisSession}>{sessionLabel}</S.NavLabel>
                          </S.SubNavItem>
                          <S.SessionDeleteButton
                            type="button"
                            aria-label={`${sessionLabel} 삭제`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteSession(session.session_id);
                            }}
                          >
                            ×
                          </S.SessionDeleteButton>
                        </S.SessionRow>
                      );
                    })}
                  </S.SubNavContainer>
                )}
              </div>
            );
          })}
        </S.Section>

        <S.Divider />

        <S.Section>
          {SECONDARY_NAV.map((item) => (
            <S.NavItem key={item.key} $collapsed={isCollapsed} onClick={() => handleNavigation(item.path)}>
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
            <S.Avatar>
              {user?.profile ? (
                <Image src={user.profile} alt="profile" width={32} height={32} style={{ borderRadius: '50%' }} />
              ) : (
                user?.nickname?.[0] || 'N'
              )}
            </S.Avatar>
            <S.ProfileText>
              <S.ProfileName>{user?.nickname || '류승찬'}</S.ProfileName>
              {user ? (
                <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
              ) : (
                <S.ProfileSub>부산소프트웨어마이스터고</S.ProfileSub>
              )}
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

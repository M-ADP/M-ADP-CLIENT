export interface DocsNavItem {
  id: string;
  label: string;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

export const docsNav: DocsNavGroup[] = [
  {
    title: '시작하기',
    items: [
      { id: 'introduction', label: '소개' },
      { id: 'quick-start', label: '빠른 시작' },
      { id: 'login', label: '로그인' },
    ],
  },
  {
    title: '프로젝트',
    items: [
      { id: 'project-create', label: '프로젝트 생성' },
      { id: 'project-resource', label: '자원 할당' },
    ],
  },
  {
    title: '앱 배포',
    items: [
      { id: 'app-create', label: '앱 생성' },
      { id: 'github-connect', label: 'GitHub 연동' },
      { id: 'app-deploy', label: '배포와 롤백' },
    ],
  },
  {
    title: '운영',
    items: [
      { id: 'dashboard', label: '대시보드' },
      { id: 'monitoring', label: '모니터링 · 알림' },
    ],
  },
  {
    title: '레퍼런스',
    items: [
      { id: 'cli', label: 'CLI' },
      { id: 'faq', label: '자주 묻는 질문' },
    ],
  },
];

export const docsSectionIds: string[] = docsNav.flatMap((group) =>
  group.items.map((item) => item.id),
);

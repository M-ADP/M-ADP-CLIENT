'use client';

import { useEffect, useRef, useState } from 'react';
import { docsNav, docsSectionIds } from './data';
import * as S from './style';

export default function DocsContainer() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>(docsSectionIds[0]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      },
    );

    docsSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <S.DocsLayout>
      <S.Content ref={contentRef}>
        <S.Article>
          <S.Eyebrow>사용 가이드</S.Eyebrow>
          <S.PageTitle>M-ADP 시작하기</S.PageTitle>
          <S.Lead>
            M-ADP는 부산소프트웨어마이스터고 구성원을 위한 교내 클라우드
            디벨로퍼 플랫폼입니다. 프로젝트를 만들고, GitHub 저장소를 연결해
            앱을 배포하고, 실시간으로 상태를 모니터링하는 방법을 안내합니다.
          </S.Lead>

          <S.Section id="introduction">
            <S.SectionTitle>소개</S.SectionTitle>
            <S.Paragraph>
              M-ADP(Multi Application Deploy Platform)는 코드 저장소 하나로
              빌드부터 배포, 운영까지 이어지는 파이프라인을 제공합니다. 복잡한
              인프라 설정 없이 <S.InlineCode>프로젝트 → 앱 → 배포</S.InlineCode>{' '}
              세 단계만으로 서비스를 띄울 수 있습니다.
            </S.Paragraph>
            <S.List>
              <li>프로젝트 단위로 CPU · 메모리 · 스토리지 자원을 배분합니다.</li>
              <li>GitHub 저장소를 연결하면 푸시 시 자동으로 배포됩니다.</li>
              <li>대시보드에서 트래픽과 리소스 사용량을 실시간으로 확인합니다.</li>
            </S.List>
          </S.Section>

          <S.Section id="quick-start">
            <S.SectionTitle>빠른 시작</S.SectionTitle>
            <S.Paragraph>
              처음이라면 아래 순서대로 5분 안에 첫 배포를 완료할 수 있습니다.
            </S.Paragraph>
            <S.List>
              <li>학교 Google 계정으로 로그인합니다.</li>
              <li>새 프로젝트를 만들고 자원 한도를 설정합니다.</li>
              <li>GitHub 저장소를 연결해 앱을 생성합니다.</li>
              <li>배포가 끝나면 발급된 URL로 접속해 확인합니다.</li>
            </S.List>
            <S.Callout>
              <S.CalloutIcon>💡</S.CalloutIcon>
              <span>
                <strong>팁 —</strong> 예제 저장소로 먼저 배포를 연습해 보세요.
                템플릿에는 헬스체크 엔드포인트가 미리 설정되어 있습니다.
              </span>
            </S.Callout>
          </S.Section>

          <S.Section id="login">
            <S.SectionTitle>로그인</S.SectionTitle>
            <S.Paragraph>
              M-ADP는 학교 Google 계정 기반 OAuth 로그인만 지원합니다. 로그인
              페이지에서 <strong>Google로 계속하기</strong>를 누르면 인증 후
              대시보드로 이동합니다.
            </S.Paragraph>
            <S.Callout $variant="warning">
              <S.CalloutIcon>⚠️</S.CalloutIcon>
              <span>
                <strong>@bssm.hs.kr</strong> 도메인 계정만 접근할 수 있습니다.
                개인 Gmail로는 로그인이 거부됩니다.
              </span>
            </S.Callout>
            <S.Paragraph>
              최초 로그인 시 원활한 배포를 위해 GitHub 계정 연동을 함께
              진행하는 것을 권장합니다.
            </S.Paragraph>
          </S.Section>

          <S.Section id="project-create">
            <S.SectionTitle>프로젝트 생성</S.SectionTitle>
            <S.Paragraph>
              프로젝트는 여러 앱을 담는 논리적 단위입니다. 좌측 사이드바의{' '}
              <S.InlineCode>프로젝트</S.InlineCode> 메뉴에서{' '}
              <strong>새 프로젝트</strong>를 눌러 생성합니다.
            </S.Paragraph>
            <S.SubTitle>필수 입력 항목</S.SubTitle>
            <S.List>
              <li>
                <strong>이름</strong> — 영문 소문자, 숫자, 하이픈만 사용합니다.
              </li>
              <li>
                <strong>설명</strong> — 프로젝트 용도를 간단히 적습니다. (선택)
              </li>
              <li>
                <strong>자원 한도</strong> — 프로젝트에 할당할 총 CPU/메모리를
                지정합니다.
              </li>
            </S.List>
          </S.Section>

          <S.Section id="project-resource">
            <S.SectionTitle>자원 할당</S.SectionTitle>
            <S.Paragraph>
              프로젝트에 배정된 자원은 그 안의 모든 앱이 나누어 사용합니다.
              앱을 생성할 때는 프로젝트의 잔여 자원 범위 안에서만 값을 지정할 수
              있습니다.
            </S.Paragraph>
            <S.Table>
              <thead>
                <tr>
                  <th>등급</th>
                  <th>CPU</th>
                  <th>메모리</th>
                  <th>권장 용도</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Small</td>
                  <td>0.5 vCPU</td>
                  <td>512 MB</td>
                  <td>정적 사이트 · 사이드 프로젝트</td>
                </tr>
                <tr>
                  <td>Medium</td>
                  <td>1 vCPU</td>
                  <td>1 GB</td>
                  <td>API 서버 · 소규모 웹앱</td>
                </tr>
                <tr>
                  <td>Large</td>
                  <td>2 vCPU</td>
                  <td>2 GB</td>
                  <td>트래픽이 많은 서비스</td>
                </tr>
              </tbody>
            </S.Table>
          </S.Section>

          <S.Section id="app-create">
            <S.SectionTitle>앱 생성</S.SectionTitle>
            <S.Paragraph>
              프로젝트 상세 화면에서 <strong>앱 추가</strong>를 눌러 새 앱을
              만듭니다. 실행 환경과 포트, 빌드 명령을 설정하면 됩니다.
            </S.Paragraph>
            <S.CodeBlock>
              <span className="cmt"># madp.config.yaml 예시</span>
              {'\n'}app:{'\n'}
              {'  '}name: my-service{'\n'}
              {'  '}runtime: node20{'\n'}
              {'  '}port: 3000{'\n'}
              {'  '}build: pnpm install && pnpm build{'\n'}
              {'  '}start: pnpm start
            </S.CodeBlock>
          </S.Section>

          <S.Section id="github-connect">
            <S.SectionTitle>GitHub 연동</S.SectionTitle>
            <S.Paragraph>
              앱에 GitHub 저장소를 연결하면 지정한 브랜치에 푸시할 때마다 빌드와
              배포가 자동으로 실행됩니다. 설정 화면의{' '}
              <S.InlineCode>GitHub 연결</S.InlineCode> 버튼으로 권한을
              부여하세요.
            </S.Paragraph>
            <S.List>
              <li>기본 브랜치를 배포 대상으로 지정합니다.</li>
              <li>Pull Request마다 미리보기 환경을 생성할 수 있습니다.</li>
              <li>연동 해제는 앱 설정에서 언제든 가능합니다.</li>
            </S.List>
          </S.Section>

          <S.Section id="app-deploy">
            <S.SectionTitle>배포와 롤백</S.SectionTitle>
            <S.Paragraph>
              배포는 무중단으로 진행되며, 각 배포는 고유한 버전으로 기록됩니다.
              문제가 생기면 이전 버전으로 즉시 롤백할 수 있습니다.
            </S.Paragraph>
            <S.CodeBlock>
              <span className="cmt"># CLI로 수동 배포</span>
              {'\n'}madp deploy --app my-service{'\n\n'}
              <span className="cmt"># 직전 버전으로 롤백</span>
              {'\n'}madp rollback --app my-service
            </S.CodeBlock>
            <S.Callout>
              <S.CalloutIcon>🕒</S.CalloutIcon>
              <span>
                배포 이력은 최근 <strong>20개</strong>까지 보관되며, 각 버전의
                커밋 해시와 배포 시각을 함께 확인할 수 있습니다.
              </span>
            </S.Callout>
          </S.Section>

          <S.Section id="dashboard">
            <S.SectionTitle>대시보드</S.SectionTitle>
            <S.Paragraph>
              대시보드는 프로젝트와 앱의 상태를 한눈에 보여줍니다. 트래픽
              추이, 리소스 사용률, 최근 배포 현황을 카드 형태로 제공합니다.
            </S.Paragraph>
            <S.List>
              <li>
                <strong>상태 배지</strong> — Healthy · Warning · Unhealthy ·
                Stopped로 앱 상태를 표시합니다.
              </li>
              <li>
                <strong>트래픽 차트</strong> — 시간대별 요청 수와 응답 시간을
                시각화합니다.
              </li>
            </S.List>
          </S.Section>

          <S.Section id="monitoring">
            <S.SectionTitle>모니터링 · 알림</S.SectionTitle>
            <S.Paragraph>
              앱 상태가 임계값을 벗어나면 알림 센터로 알려 줍니다. CPU 과부하,
              헬스체크 실패, 배포 오류 등을 감지합니다.
            </S.Paragraph>
            <S.Callout $variant="warning">
              <S.CalloutIcon>⚠️</S.CalloutIcon>
              <span>
                연속으로 헬스체크에 실패하면 앱이 자동으로{' '}
                <strong>Unhealthy</strong> 상태로 전환됩니다. 알림을 확인하고
                로그를 점검하세요.
              </span>
            </S.Callout>
          </S.Section>

          <S.Section id="cli">
            <S.SectionTitle>CLI</S.SectionTitle>
            <S.Paragraph>
              M-ADP CLI를 사용하면 터미널에서 바로 배포와 로그 확인을 할 수
              있습니다.
            </S.Paragraph>
            <S.CodeBlock>
              <span className="cmt"># 설치</span>
              {'\n'}npm install -g @madp/cli{'\n\n'}
              <span className="cmt"># 로그인</span>
              {'\n'}madp login{'\n\n'}
              <span className="cmt"># 실시간 로그 스트리밍</span>
              {'\n'}madp logs --app my-service --follow
            </S.CodeBlock>
          </S.Section>

          <S.Section id="faq">
            <S.SectionTitle>자주 묻는 질문</S.SectionTitle>
            <S.SubTitle>배포가 계속 실패해요.</S.SubTitle>
            <S.Paragraph>
              빌드 로그에서 실패 단계를 먼저 확인하세요. 대부분 의존성 설치나
              환경 변수 누락이 원인입니다. 앱 설정에서 필요한 변수를 등록했는지
              점검해 주세요.
            </S.Paragraph>
            <S.SubTitle>프로젝트 자원을 늘리고 싶어요.</S.SubTitle>
            <S.Paragraph>
              자원 한도 상향은 관리자 승인이 필요합니다. 서포트 채널을 통해
              요청하면 됩니다.
            </S.Paragraph>
            <S.SubTitle>연동한 GitHub 계정을 바꾸려면?</S.SubTitle>
            <S.Paragraph>
              설정 화면에서 기존 연동을 해제한 뒤 새 계정으로 다시 연결하면
              됩니다. 진행 중인 배포에는 영향을 주지 않습니다.
            </S.Paragraph>
          </S.Section>
        </S.Article>
      </S.Content>

      <S.Toc aria-label="이 페이지 목차">
        <S.TocTitle>이 페이지에서</S.TocTitle>
        <S.TocList>
          {docsNav
            .flatMap((group) => group.items)
            .map((item) => (
              <li key={item.id}>
                <S.TocLink
                  href={`#${item.id}`}
                  $active={activeId === item.id}
                  onClick={(event) => handleNavClick(event, item.id)}
                >
                  {item.label}
                </S.TocLink>
              </li>
            ))}
        </S.TocList>
      </S.Toc>
    </S.DocsLayout>
  );
}

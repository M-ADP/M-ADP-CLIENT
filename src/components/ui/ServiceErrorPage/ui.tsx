'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './style';

type ActionVariant = 'primary' | 'secondary';
type GameStatus = 'idle' | 'running' | 'gameover';

interface LinkAction {
  label: string;
  href: string;
  variant?: ActionVariant;
}

interface ButtonAction {
  label: string;
  onClick: () => void;
  variant?: ActionVariant;
}

interface StageSize {
  width: number;
  height: number;
}

interface ObstacleModel {
  id: number;
  kind: 'small' | 'large';
  x: number;
  width: number;
  height: number;
}

interface GameSnapshot {
  status: GameStatus;
  playerY: number;
  playerFrameOffset: number;
  score: number;
  bestScore: number;
  obstacles: ObstacleModel[];
}

interface GameRuntime {
  status: GameStatus;
  playerY: number;
  velocityY: number;
  score: number;
  distance: number;
  spawnTimer: number;
  lastTime: number;
  obstacleId: number;
  obstacles: ObstacleModel[];
}

type ServiceErrorAction = LinkAction | ButtonAction;

interface ServiceErrorPageProps {
  eyebrow?: string;
  title: string;
  description?: string;
  notices?: string[];
  primaryAction?: ServiceErrorAction;
  secondaryAction?: ServiceErrorAction;
  showMiniGame?: boolean;
}

const BEST_SCORE_STORAGE_KEY = 'm-adp-system-error-best-score';
const FALLBACK_STAGE_SIZE: StageSize = {
  width: 470,
  height: 520,
};
const SPRITE_URL = '/assets/system-error/chromium/offline-sprite.png';
const SPRITE_SIZE = {
  width: 1233,
  height: 68,
};
const CLOUD_SPRITE = { x: 86, y: 2, width: 46, height: 14 };
const HORIZON_SPRITE = { x: 2, y: 54, width: 600, height: 12 };
const TREX_BASE_X = 848;
const TREX_SPRITE = { y: 2, width: 44, height: 47 };
const TREX_FRAME_OFFSETS = {
  idle: 44,
  jump: 0,
  run: [88, 132],
  crashed: 220,
} as const;
const CACTUS_SPRITES = {
  small: { x: 228, y: 2, width: 17, height: 35 },
  large: { x: 332, y: 2, width: 25, height: 50 },
} as const;

function isButtonAction(action: ServiceErrorAction): action is ButtonAction {
  return 'onClick' in action;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getStageMetrics(size: StageSize) {
  const width = Math.max(size.width, 320);
  const height = Math.max(size.height, 360);
  const groundHeight = clamp(height * 0.15, 52, 78);
  const playerSize = clamp(width * 0.14, 52, 72);

  return {
    width,
    height,
    groundHeight,
    playerSize,
    playerX: clamp(width * 0.12, 40, 72),
    obstacleBaseWidth: clamp(width * 0.075, 28, 42),
    baseSpeed: clamp(width * 0.46, 210, 320),
    gravity: clamp(height * 4.8, 1850, 2800),
    jumpVelocity: clamp(height * 1.62, 720, 980),
  };
}

function createInitialRuntime(): GameRuntime {
  return {
    status: 'idle',
    playerY: 0,
    velocityY: 0,
    score: 0,
    distance: 0,
    spawnTimer: 1.1,
    lastTime: 0,
    obstacleId: 0,
    obstacles: [],
  };
}

function createInitialSnapshot(bestScore: number): GameSnapshot {
  return {
    status: 'idle',
    playerY: 0,
    playerFrameOffset: TREX_FRAME_OFFSETS.idle,
    score: 0,
    bestScore,
    obstacles: [],
  };
}

function Action({
  action,
  fallbackVariant,
}: {
  action?: ServiceErrorAction;
  fallbackVariant: ActionVariant;
}) {
  if (!action) return null;

  const variant = action.variant ?? fallbackVariant;

  if (isButtonAction(action)) {
    return (
      <S.ActionButtonElement type="button" onClick={action.onClick} $variant={variant}>
        {action.label}
      </S.ActionButtonElement>
    );
  }

  return (
    <Link href={action.href} passHref legacyBehavior>
      <S.ActionButton $variant={variant}>{action.label}</S.ActionButton>
    </Link>
  );
}

function MiniJumpGame() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const stageSizeRef = useRef<StageSize>(FALLBACK_STAGE_SIZE);
  const bestScoreRef = useRef(0);
  const runtimeRef = useRef<GameRuntime>(createInitialRuntime());
  const [stageSize, setStageSize] = useState<StageSize>(FALLBACK_STAGE_SIZE);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => createInitialSnapshot(0));
  const metrics = getStageMetrics(stageSize);
  const playerScale = metrics.playerSize / TREX_SPRITE.width;
  const playerHeight = TREX_SPRITE.height * playerScale;

  const syncSnapshot = useCallback((status?: GameStatus) => {
    const runtime = runtimeRef.current;
    const nextStatus = status ?? runtime.status;
    const playerFrameOffset =
      nextStatus === 'gameover'
        ? TREX_FRAME_OFFSETS.crashed
        : runtime.playerY > 0
          ? TREX_FRAME_OFFSETS.jump
          : nextStatus === 'running'
            ? TREX_FRAME_OFFSETS.run[Math.floor(runtime.distance / 18) % TREX_FRAME_OFFSETS.run.length]
            : TREX_FRAME_OFFSETS.idle;

    setSnapshot({
      status: nextStatus,
      playerY: runtime.playerY,
      playerFrameOffset,
      score: runtime.score,
      bestScore: bestScoreRef.current,
      obstacles: runtime.obstacles.map((obstacle) => ({ ...obstacle })),
    });
  }, []);

  const startGame = useCallback(
    (withJump: boolean) => {
    const runtime = runtimeRef.current;
    const currentMetrics = getStageMetrics(stageSizeRef.current);

    runtime.status = 'running';
    runtime.playerY = 0;
    runtime.velocityY = withJump ? currentMetrics.jumpVelocity : 0;
    runtime.score = 0;
    runtime.distance = 0;
    runtime.spawnTimer = 0.85;
    runtime.lastTime = performance.now();
    runtime.obstacleId = 0;
    runtime.obstacles = [];

      syncSnapshot('running');
    },
    [syncSnapshot]
  );

  const handleJump = useCallback(() => {
    const runtime = runtimeRef.current;
    const currentMetrics = getStageMetrics(stageSizeRef.current);

    if (runtime.status === 'idle' || runtime.status === 'gameover') {
      startGame(true);
      return;
    }

    if (runtime.playerY <= 4) {
      runtime.velocityY = currentMetrics.jumpVelocity;
    }
  }, [startGame]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedBestScore = Number(window.localStorage.getItem(BEST_SCORE_STORAGE_KEY) ?? 0);
    if (Number.isNaN(storedBestScore)) return;

    const animationFrame = window.requestAnimationFrame(() => {
      bestScoreRef.current = storedBestScore;
      setSnapshot(createInitialSnapshot(storedBestScore));
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;

    const updateStageSize = () => {
      const nextSize = {
        width: element.clientWidth,
        height: element.clientHeight,
      };

      stageSizeRef.current = nextSize;
      setStageSize(nextSize);
    };

    updateStageSize();

    const observer = new ResizeObserver(updateStageSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!['Space', 'ArrowUp', 'KeyW'].includes(event.code)) return;

      event.preventDefault();
      handleJump();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  useEffect(() => {
    const step = (time: number) => {
      const runtime = runtimeRef.current;

      if (runtime.status === 'running') {
        const currentMetrics = getStageMetrics(stageSizeRef.current);
        const deltaTime = runtime.lastTime
          ? Math.min((time - runtime.lastTime) / 1000, 0.032)
          : 0.016;
        const speed = currentMetrics.baseSpeed + runtime.score * 1.4;

        runtime.lastTime = time;
        runtime.velocityY -= currentMetrics.gravity * deltaTime;
        runtime.playerY = Math.max(0, runtime.playerY + runtime.velocityY * deltaTime);

        if (runtime.playerY === 0 && runtime.velocityY < 0) {
          runtime.velocityY = 0;
        }

        runtime.spawnTimer -= deltaTime;

        if (runtime.spawnTimer <= 0) {
          const kind = Math.random() > 0.52 ? 'large' : 'small';
          const source = CACTUS_SPRITES[kind];
          const obstacleScale = currentMetrics.playerSize / TREX_SPRITE.width;
          const obstacleWidth = source.width * obstacleScale;
          const obstacleHeight = source.height * obstacleScale;

          runtime.obstacles.push({
            id: runtime.obstacleId,
            kind,
            x: currentMetrics.width + obstacleWidth + 20,
            width: obstacleWidth,
            height: obstacleHeight,
          });
          runtime.obstacleId += 1;
          runtime.spawnTimer = randomBetween(0.95, 1.75);
        }

        runtime.obstacles = runtime.obstacles
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - speed * deltaTime,
          }))
          .filter((obstacle) => obstacle.x + obstacle.width > -32);

        runtime.distance += speed * deltaTime;
        runtime.score = Math.floor(runtime.distance / 18);

        const playerFront = currentMetrics.playerX + currentMetrics.playerSize * 0.82;
        const playerBack = currentMetrics.playerX + currentMetrics.playerSize * 0.14;

        const isColliding = runtime.obstacles.some((obstacle) => {
          const overlapsHorizontally =
            obstacle.x < playerFront && obstacle.x + obstacle.width > playerBack;
          const clearsObstacle = runtime.playerY > obstacle.height - 6;

          return overlapsHorizontally && !clearsObstacle;
        });

        if (isColliding) {
          runtime.status = 'gameover';

          if (runtime.score > bestScoreRef.current) {
            bestScoreRef.current = runtime.score;
            window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(runtime.score));
          }

          syncSnapshot('gameover');
        } else {
          syncSnapshot('running');
        }
      }

      frameRef.current = window.requestAnimationFrame(step);
    };

    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [syncSnapshot]);

  const overlayTitle =
    snapshot.status === 'gameover' ? '다시 해볼까요?' : '기다리는 동안 한 판';
  const overlayText =
    snapshot.status === 'gameover'
      ? 'Space로 다시 시작할 수 있어요.'
      : 'Space로 점프하세요.';

  return (
    <S.GameCard>
      <S.GameViewport
        ref={stageRef}
        onPointerDown={handleJump}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;

          event.preventDefault();
          handleJump();
        }}
        aria-label="M-ADP 미니게임. Space 또는 탭으로 점프"
      >
        <S.GameCloudSprite
          style={{
            top: 36,
            left: 34,
            width: CLOUD_SPRITE.width,
            height: CLOUD_SPRITE.height,
            backgroundImage: `url(${SPRITE_URL})`,
            backgroundSize: `${SPRITE_SIZE.width}px ${SPRITE_SIZE.height}px`,
            backgroundPosition: `-${CLOUD_SPRITE.x}px -${CLOUD_SPRITE.y}px`,
          }}
        />
        <S.GameCloudSprite
          style={{
            top: 72,
            left: 160,
            width: CLOUD_SPRITE.width,
            height: CLOUD_SPRITE.height,
            backgroundImage: `url(${SPRITE_URL})`,
            backgroundSize: `${SPRITE_SIZE.width}px ${SPRITE_SIZE.height}px`,
            backgroundPosition: `-${CLOUD_SPRITE.x}px -${CLOUD_SPRITE.y}px`,
            opacity: 0.82,
          }}
        />
        <S.GameCloudSprite
          style={{
            top: 112,
            left: 280,
            width: CLOUD_SPRITE.width,
            height: CLOUD_SPRITE.height,
            backgroundImage: `url(${SPRITE_URL})`,
            backgroundSize: `${SPRITE_SIZE.width}px ${SPRITE_SIZE.height}px`,
            backgroundPosition: `-${CLOUD_SPRITE.x}px -${CLOUD_SPRITE.y}px`,
            transform: 'scale(0.92)',
            transformOrigin: 'left top',
            opacity: 0.72,
          }}
        />

        <S.GameTrack style={{ height: metrics.groundHeight }} />
        <S.GameGroundSprite
          style={{
            height: HORIZON_SPRITE.height,
            bottom: metrics.groundHeight - HORIZON_SPRITE.height,
            backgroundImage: `url(${SPRITE_URL})`,
            backgroundSize: `${SPRITE_SIZE.width}px ${SPRITE_SIZE.height}px`,
            backgroundPosition: `-${HORIZON_SPRITE.x}px -${HORIZON_SPRITE.y}px`,
          }}
        />

        <S.GamePlayerShadow
          style={{
            left: metrics.playerX + metrics.playerSize * 0.1,
            bottom: metrics.groundHeight - 10,
            width: metrics.playerSize * 0.72,
          }}
        />

        <S.GamePlayer
          style={{
            left: metrics.playerX,
            bottom: metrics.groundHeight + snapshot.playerY,
            width: metrics.playerSize,
            height: metrics.playerSize,
          }}
        >
          <S.GamePlayerLogo
            src="/assets/logo.svg"
            alt="M-ADP"
            $isJumping={snapshot.playerY > 0}
          />
        </S.GamePlayer>

        {snapshot.obstacles.map((obstacle) => {
          const source = CACTUS_SPRITES[obstacle.kind];
          const obstacleScale = obstacle.width / source.width;

          return (
            <S.GameObstacle
              key={obstacle.id}
              style={{
                left: obstacle.x,
                bottom: metrics.groundHeight,
                width: obstacle.width,
                height: obstacle.height,
              }}
            >
              <S.GameObstacleSprite
                style={{
                  backgroundImage: `url(${SPRITE_URL})`,
                  backgroundSize: `${SPRITE_SIZE.width * obstacleScale}px ${SPRITE_SIZE.height * obstacleScale}px`,
                  backgroundPosition: `-${source.x * obstacleScale}px -${source.y * obstacleScale}px`,
                }}
              />
            </S.GameObstacle>
          );
        })}

        <S.GameScoreDisplay>
          <S.GameScoreItem>
            <S.GameScoreLabel>SCORE</S.GameScoreLabel>
            <S.GameScoreNumber>{String(snapshot.score).padStart(5, '0')}</S.GameScoreNumber>
          </S.GameScoreItem>
          <S.GameScoreItem>
            <S.GameScoreLabel>BEST</S.GameScoreLabel>
            <S.GameScoreNumber>{String(snapshot.bestScore).padStart(5, '0')}</S.GameScoreNumber>
          </S.GameScoreItem>
        </S.GameScoreDisplay>

        {snapshot.status !== 'running' ? (
          <S.GameOverlay>
            <S.GameOverlayCard>
              <S.GameOverlayTitle>{overlayTitle}</S.GameOverlayTitle>
              <S.GameOverlayText>{overlayText}</S.GameOverlayText>
            </S.GameOverlayCard>
          </S.GameOverlay>
        ) : null}
      </S.GameViewport>

      <S.GameHint>Space / 탭으로 점프</S.GameHint>
    </S.GameCard>
  );
}

export default function ServiceErrorPage({
  eyebrow,
  title,
  description,
  notices,
  primaryAction,
  secondaryAction,
  showMiniGame = false,
}: ServiceErrorPageProps) {
  const miniGame = showMiniGame ? <MiniJumpGame /> : null;

  return (
    <S.Page>
      <S.Shell>
        <S.Header>
          <S.Brand>
            <Image src="/assets/logo.svg" alt="M-ADP" width={38} height={38} priority />
            <S.BrandText>
              <S.BrandName>M-ADP</S.BrandName>
            </S.BrandText>
          </S.Brand>
        </S.Header>

        {showMiniGame ? (
          <S.StageSection>
            <S.StageHead>
              <div>
                <S.StageTitle>M-RUNNER</S.StageTitle>
                <S.StageHint>Space 또는 탭으로 시작</S.StageHint>
              </div>
            </S.StageHead>
            {miniGame}
          </S.StageSection>
        ) : null}

        <S.InfoSection>
          <S.Content>
            {eyebrow ? <S.Eyebrow>{eyebrow}</S.Eyebrow> : null}
            <S.Title>{title}</S.Title>
            {description ? <S.Description>{description}</S.Description> : null}

            {notices && notices.length > 0 ? (
              <S.NoticeList>
                {notices.map((notice) => (
                  <S.NoticeItem key={notice}>
                    <S.NoticeDot />
                    <S.NoticeText>{notice}</S.NoticeText>
                  </S.NoticeItem>
                ))}
              </S.NoticeList>
            ) : null}

            <S.ActionRow>
              <Action action={primaryAction} fallbackVariant="primary" />
              <Action action={secondaryAction} fallbackVariant="secondary" />
            </S.ActionRow>
          </S.Content>
        </S.InfoSection>
      </S.Shell>
    </S.Page>
  );
}

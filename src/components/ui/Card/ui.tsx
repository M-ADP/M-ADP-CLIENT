'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import * as S from './style';

export interface MetaItemData {
  icon: string;
  label: string;
}

export interface CardProps {
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  meta?: MetaItemData[];
  status?: 'healthy' | 'unhealthy' | 'warning' | 'stopped';
}

export default function Card({ title, children, footer, onClick, meta, status }: CardProps) {
  return (
    <S.Card onClick={onClick}>
      <S.CardHeader>
        <S.CardTitle>{title}</S.CardTitle>
        <S.ArrowIcon>
          <Image src="/icons/sidebar/chevron-right.svg" alt="arrow" width={20} height={20} />
        </S.ArrowIcon>
      </S.CardHeader>
      {meta && (
        <S.CardMeta>
          {meta.map((item, idx) => (
            <S.MetaItem key={idx}>
              <Image src={item.icon} alt="" width={16} height={16} />
              {item.label}
            </S.MetaItem>
          ))}
        </S.CardMeta>
      )}
      {children && <S.CardMeta>{children}</S.CardMeta>}
      {footer && <S.CardFooter>{footer}</S.CardFooter>}
      {status && (
        <S.CardFooter>
          <S.StatusBadge $variant={status}>{status}</S.StatusBadge>
        </S.CardFooter>
      )}
    </S.Card>
  );
}

export { MetaItem, FooterMessage, StatusBadge } from './style';

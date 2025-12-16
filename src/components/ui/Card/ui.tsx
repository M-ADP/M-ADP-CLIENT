'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import * as S from './style';

export interface CardProps {
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
}

export default function Card({ title, children, footer, onClick }: CardProps) {
  return (
    <S.Card onClick={onClick}>
      <S.CardHeader>
        <S.CardTitle>{title}</S.CardTitle>
        <S.ArrowIcon>
          <Image src="/icons/sidebar/chevron-right.svg" alt="arrow" width={20} height={20} />
        </S.ArrowIcon>
      </S.CardHeader>
      {children && <S.CardMeta>{children}</S.CardMeta>}
      {footer && <S.CardFooter>{footer}</S.CardFooter>}
    </S.Card>
  );
}

export { MetaItem, FooterMessage, StatusBadge } from './style';

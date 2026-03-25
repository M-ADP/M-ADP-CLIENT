'use client';

import * as S from './style';
import type { ButtonProps } from '@/types/button';

export default function Button({ variant = 'confirm', size = 'medium', onClick, disabled = false, className, children, type = 'button', style }: ButtonProps) {
  const defaultText = variant === 'confirm' ? '확인' : '취소';

  return (
    <S.StyledButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
      type={type}
      style={style}
    >
      {children || defaultText}
    </S.StyledButton>
  );
}

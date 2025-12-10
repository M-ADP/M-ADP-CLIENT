'use client';

import { StyledButton } from './style';

type ButtonProps = {
  variant?: 'confirm' | 'cancel';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function Button({
  variant = 'confirm',
  onClick,
  disabled = false,
  className,
  children,
}: ButtonProps) {
  const defaultText = variant === 'confirm' ? '확인' : '취소';

  return (
    <StyledButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children || defaultText}
    </StyledButton>
  );
}

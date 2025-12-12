import type { ReactNode } from 'react';

export type ButtonProps = {
  variant?: 'confirm' | 'cancel';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};
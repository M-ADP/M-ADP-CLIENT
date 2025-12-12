import type { ReactNode } from 'react';

export type ModalProps = {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  width?: string | number;
  height?: string | number;
  closeOnOverlay?: boolean;
};
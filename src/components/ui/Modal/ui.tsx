'use client';

import { createPortal } from 'react-dom';
import { Overlay, Card } from './style';
import type { ModalProps } from '@/types/modal';
import { getSize } from '@/utils/size';

export default function Modal({ open, onClose, children, width, height, closeOnOverlay = true }: ModalProps) {
  if (!open) return null;

  const content = (
    <Overlay onClick={closeOnOverlay ? onClose : undefined}>
      <Card
        width={getSize(width)}
        height={getSize(height)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        {children || '내용내용'}
      </Card>
    </Overlay>
  );

  if (typeof window === 'undefined') return content;
  return createPortal(content, document.body);
}
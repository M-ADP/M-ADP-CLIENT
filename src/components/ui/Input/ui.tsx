'use client';

import { forwardRef } from 'react';
import { Container, LabelText, StyledInput } from './style';
import type { InputProps } from '@/types/input';

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, width, id, name, ...rest }, ref) => {
  const inputId = id || name;

  return (
    <Container width={width}>
      {label && <LabelText className="input-label">{label}</LabelText>}
      <StyledInput ref={ref} id={inputId} name={name} {...rest} />
    </Container>
  );
});

Input.displayName = 'Input';

export default Input;
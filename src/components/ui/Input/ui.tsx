'use client';

import { forwardRef } from 'react';
import * as S from './style';
import type { InputProps } from '@/types/input';

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, width, id, name, ...rest }, ref) => {
  const inputId = id || name;

  return (
    <S.Container width={width}>
      {label && <S.LabelText className="input-label">{label}</S.LabelText>}
      <S.StyledInput ref={ref} id={inputId} name={name} {...rest} />
    </S.Container>
  );
});

Input.displayName = 'Input';

export default Input;
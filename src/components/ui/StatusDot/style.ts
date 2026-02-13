import styled from '@emotion/styled';

export const Dot = styled.div<{ $color: string }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 100px;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

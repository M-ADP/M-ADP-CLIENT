import styled from '@emotion/styled';

export const GridContainer = styled.div<{
  columns?: number;
  gap?: string;
  responsive?: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ columns = 2 }) =>
    `repeat(${columns}, 1fr)`
  };
  gap: ${({ gap = '20px' }) => gap};
  width: 100%;

  ${({ responsive = true }) => responsive && `

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }

    @media (max-width: 768px) {
      gap: 16px;
    }

    @media (max-width: 480px) {
      gap: 12px;
    }
  `}
`;

export const GridItem = styled.div<{
  colspan?: number;
  minWidth?: string;
}>`
  grid-column: ${({ colspan = 1 }) =>
    colspan > 1 ? `span ${colspan}` : 'auto'
  };
  min-width: ${({ minWidth = '300px' }) => minWidth};
  width: 100%;


  > * {
    width: 100%;
    height: 100%;
  }
`;
'use client';

import * as S from './style';
import ChartRenderer from '../common/ChartRenderer';
import { ChartComponentProps } from '@/types/chart';

function Chart(props: ChartComponentProps) {
  const {
    title,
    width,
    height,
    style,
    className,
    minWidth,
    maxWidth,
    aspectRatio,
  } = props;

  return (
    <S.ChartContainer
      width={width}
      height={height}
      minWidth={minWidth}
      maxWidth={maxWidth}
      style={style}
      className={className}
    >
      {title && (
        <S.ChartHeader>
          <S.ChartTitle>{title}</S.ChartTitle>
        </S.ChartHeader>
      )}
      <S.ChartContent
        $isFixedHeight={!!height}
        aspectRatio={aspectRatio}
      >
        <ChartRenderer {...props} />
      </S.ChartContent>
    </S.ChartContainer>
  );
}

export default Chart;
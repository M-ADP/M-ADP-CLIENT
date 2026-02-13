'use client';

import Image from 'next/image';
import * as S from './style';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <S.PaginationWrapper>
      <S.NavButton
        $disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        <Image src="/icons/sidebar/chevron-left.svg" alt="이전" width={20} height={20} />
        <span>이전</span>
      </S.NavButton>

      <S.PageNumbers>
        {pages.map((page) => (
          <S.PageNumber
            key={page}
            $active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </S.PageNumber>
        ))}
      </S.PageNumbers>

      <S.NavButton
        $disabled={currentPage === totalPages}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >
        <span>다음</span>
        <Image src="/icons/sidebar/chevron-right.svg" alt="다음" width={20} height={20} />
      </S.NavButton>
    </S.PaginationWrapper>
  );
}

import * as S from './style';

interface SearchSectionProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSearch: (e?: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
}

export default function SearchSection({ inputValue, setInputValue, handleSearch, handleKeyDown, disabled }: SearchSectionProps) {
  return (
    <S.SearchContainer onSubmit={handleSearch}>
      <S.InputWrapper>
        <S.IconCircle>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L14.4 9.6L20 12L14.4 14.4L12 20L9.6 14.4L4 12L9.6 9.6L12 4Z" fill="#969696" />
          </svg>
        </S.IconCircle>
        <S.SearchInput
          placeholder="무엇을 원하시나요?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
        />
      </S.InputWrapper>

      <S.SendButton
        type="submit"
        disabled={disabled}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </S.SendButton>
    </S.SearchContainer>
  );
}

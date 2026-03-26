import styled from '@emotion/styled';
import { black, primary } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

export const Container = styled.div`
  padding: 2.5rem;
  background: #ffffff;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.bold};
  font-size: 2.5rem;
  color: ${black[300]};
  margin: 0;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 2px solid ${black[50]};
  margin-bottom: 2rem;
`;

export const Tab = styled.button<{ $active: boolean }>`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 1.125rem;
  color: ${({ $active }) => ($active ? primary.default : black[100])};
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? primary.default : 'transparent')};
  padding: 0.75rem 0;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: ${primary.default};
  }
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  border: 1px solid ${black[50]};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: fit-content;
`;

export const SidebarHeader = styled.div`
  display: flex;
  justify-content: stretch;
  
  button {
    width: 100%;
  }
`;

export const SearchWrapper = styled.div`
  width: 100%;
`;

export const RecentSection = styled.div`
  margin: 1rem 0;
`;

export const RecentTitle = styled.div`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 0.75rem;
  color: ${black[100]};
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
`;

export const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const RecentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[200]};
  transition: all 0.2s;

  &:hover {
    background: rgba(3, 9, 130, 0.03);
    color: ${black[300]};
  }
`;

export const TableList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  max-height: 400px;
  overflow-y: auto;
`;

export const TableItemWrapper = styled.div`
  position: relative;
`;

export const TableItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $selected }) => ($selected ? 'rgba(3, 9, 130, 0.05)' : 'transparent')};

  &:hover {
    background: rgba(3, 9, 130, 0.03);
  }
`;

export const TableIcon = styled.div`
  width: 16px;
  height: 16px;
  background: url('/icons/cloud-db/table.svg') no-repeat center;
  background-size: contain;
`;

export const TableName = styled.span`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[300]};
  flex: 1;
`;

export const TableMenu = styled.button`
  background: none;
  border: none;
  color: ${black[100]};
  cursor: pointer;
  padding: 0 0.25rem;
  font-size: 1.25rem;

  &:hover {
    color: ${black[300]};
  }
`;

export const TableDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid ${black[50]};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 100px;
  margin-top: 0.25rem;
`;

export const DropdownItem = styled.button<{ $danger?: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${({ $danger }) => ($danger ? '#FF3B30' : black[300])};
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${black[50]};
  }

  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 4px 4px;
  }
`;

export const SidebarActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${black[50]};
`;

export const DeleteButton = styled.button`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 0.875rem;
  color: white;
  background: #FF3B30;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #E02D20;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  height: 100%;
`;

export const DataTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid ${black[50]};
`;

export const DataTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 0.875rem;
  color: ${({ $active }) => ($active ? black[300] : black[100])};
  background: ${({ $active }) => ($active ? 'white' : 'transparent')};
  border: ${({ $active }) => ($active ? `1px solid ${black[50]}` : '1px solid transparent')};
  border-bottom: ${({ $active }) => ($active ? '1px solid white' : '1px solid transparent')};
  border-radius: 4px 4px 0 0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-bottom: -1px;
  transition: all 0.2s;

  &:hover {
    color: ${black[300]};
  }
`;

export const DataTabIcon = styled.div`
  width: 16px;
  height: 16px;
  background: url('/icons/cloud-db/table.svg') no-repeat center;
  background-size: contain;
`;

export const CloseTab = styled.span`
  margin-left: 0.5rem;
  &:hover {
    color: ${primary.default};
  }
`;

export const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;

  input {
    flex: 1;
    max-width: 400px;
  }
`;

export const TableWrapper = styled.div`
  border: 1px solid ${black[50]};
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: auto;
  max-width: 100%;
  max-height: 500px;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${black[50]};
  position: sticky;
  top: 0;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${black[50]};

  &:hover {
    background: rgba(3, 9, 130, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const CheckboxCell = styled.td`
  width: 40px;
  min-width: 40px;
  text-align: center;
  padding: 0.75rem 0.5rem;
`;

export const TableHeaderCell = styled.th`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 0.875rem;
  color: ${black[300]};
  text-align: left;
  padding: 0.75rem 1rem;
  min-width: 120px;
  white-space: nowrap;
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const KeyIcon = styled.img`
  width: 16px;
  height: 16px;
  opacity: 0.7;
`;

export const TableCell = styled.td`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.regular};
  font-size: 0.875rem;
  color: ${black[200]};
  padding: 0.75rem 1rem;
  min-width: 120px;
  white-space: nowrap;
`;

export const SortIcon = styled.span`
  font-size: 0.75rem;
  color: ${black[75]};
  margin-left: 0.25rem;
  font-weight: ${fontWeights.regular};
`;

export const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  font-family: ${FONT_FAMILY};
  font-size: 1rem;
  color: ${black[100]};
`;

// SQL 쿼리 스타일
export const SqlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
`;

export const SqlTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  border-bottom: 1px solid ${black[50]};
  padding-bottom: 0;
`;

export const SqlTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.medium};
  font-size: 0.875rem;
  color: ${({ $active }) => ($active ? black[300] : black[100])};
  background: ${({ $active }) => ($active ? 'white' : 'transparent')};
  border: ${({ $active }) => ($active ? `1px solid ${black[50]}` : '1px solid transparent')};
  border-bottom: ${({ $active }) => ($active ? '1px solid white' : '1px solid transparent')};
  border-radius: 4px 4px 0 0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-bottom: -1px;
  transition: all 0.2s;

  &:hover {
    color: ${black[300]};
  }
`;

export const SqlTabIcon = styled.div`
  width: 14px;
  height: 14px;
  background: url('/icons/cloud-db/table.svg') no-repeat center;
  background-size: contain;
`;

export const SqlTabClose = styled.span`
  margin-left: 0.25rem;
  font-size: 1.125rem;
  
  &:hover {
    color: ${primary.default};
  }
`;

export const SqlTabAdd = styled.button`
  font-family: ${FONT_FAMILY};
  font-size: 1.125rem;
  color: ${black[100]};
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${black[300]};
  }
`;

export const SqlEditor = styled.div`
  display: flex;
  border: 1px solid ${black[50]};
  border-radius: 8px;
  overflow: hidden;
  min-height: 300px;
`;

export const SqlLineNumbers = styled.div`
  background: ${black[50]};
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  min-width: 3rem;
  user-select: none;
`;

export const SqlLineNumber = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: ${black[100]};
  text-align: right;
  line-height: 1.5;
  height: 1.3125rem;
`;

export const SqlEditorWrapper = styled.div`
  flex: 1;
  position: relative;
`;

export const SqlHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: ${black[300]};
  line-height: 1.5;
  pointer-events: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
`;

export const SqlTextarea = styled.textarea`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: transparent;
  caret-color: ${black[300]};
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;

  &::selection {
    background: rgba(3, 9, 130, 0.2);
  }

  &::placeholder {
    color: ${black[75]};
  }
`;

export const SqlResultSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SqlResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SqlResultTitle = styled.h3`
  font-family: ${FONT_FAMILY};
  font-weight: ${fontWeights.semibold};
  font-size: 1rem;
  color: ${black[300]};
  margin: 0;
`;

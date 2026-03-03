'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/ui';
import Input from '@/components/ui/Input/ui';
import TableCreateModal from '@/components/ui/Modal/TableCreateModal/ui';
import TableEditModal from '@/components/ui/Modal/TableEditModal/ui';
import * as S from './style';

interface Props {
  databaseId: string;
}

const MOCK_TABLES = [
  { id: 't-001', name: 'user' },
  { id: 't-002', name: 'project' },
  { id: 't-003', name: 'emote' },
  { id: 't-004', name: 'title' },
  { id: 't-005', name: 'book' },
  { id: 't-006', name: 'meaterial' },
  { id: 't-007', name: 'application' },
];

const MOCK_COLUMNS = [
  { name: 'id', type: 'int', isPrimary: true, isForeign: false },
  { name: 'user_id', type: 'int', isPrimary: false, isForeign: true },
  { name: 'date', type: 'timestamp', isPrimary: false, isForeign: false },
  { name: 'status', type: 'varchar', isPrimary: false, isForeign: false },
  { name: 'age', type: 'int', isPrimary: false, isForeign: false },
  { name: 'created_at', type: 'timestamp', isPrimary: false, isForeign: false },
];

const MOCK_DATA = [
  { id: 1, user_id: 'ziu3', date: '2025-12-23 22:17:14', status: 'active', created_at: '2025-12-20 10:00:00' },
  { id: 2, user_id: 'ziu3', date: '2025-12-23 22:17:14', status: 'active', created_at: '2025-12-20 11:00:00' },
  { id: 3, user_id: 'ziu3', date: '2025-12-23 22:17:14', status: 'inactive', created_at: '2025-12-20 12:00:00' },
  { id: 4, user_id: 'ziu3', date: '2025-12-23 22:17:14', status: 'active', created_at: '2025-12-20 13:00:00' },
  { id: 5, user_id: 'ziu3', date: '2025-12-23 22:17:14', status: 'pending', age: '13', created_at: '2025-12-20 14:00:00' },
];

const MOCK_RECENT_TABLES = ['user', 'project', 'emote'];

const MOCK_SQL_QUERIES = [
  { id: 1, query: 'desc user;' },
  { id: 2, query: 'SELECT * FROM user WHERE id = 1;' },
  { id: 3, query: 'SELECT COUNT(*) FROM user;' },
];

const MOCK_SQL_RESULT = [
  { id: 1, user_id: 'ziu3', date: '2025-12-21 22:17:14' },
  { id: 1, user_id: 'ziu3', date: '2025-12-21 22:17:14' },
  { id: 1, user_id: 'ziu3', date: '2025-12-21 22:17:14' },
  { id: 1, user_id: 'ziu3', date: '2025-12-21 22:17:14' },
  { id: 1, user_id: 'ziu3', date: '2025-12-21 22:17:14' },
];

export default function TableDetailContainer({ databaseId }: Props) {
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<string>(MOCK_TABLES[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'ui' | 'sql' | 'settings'>('ui');
  const [searchTerm, setSearchTerm] = useState('');
  const [openedTables, setOpenedTables] = useState<string[]>(['user']);
  const [activeDataTab, setActiveDataTab] = useState<string>('user');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuOpenTable, setMenuOpenTable] = useState<string | null>(null);
  const [activeSqlTab, setActiveSqlTab] = useState<number>(1);
  const [sqlQuery, setSqlQuery] = useState('desc user;');

  const handleBack = () => {
    router.push('/cloud-database');
  };

  const currentTable = MOCK_TABLES.find((t) => t.id === selectedTable);

  const handleTableClick = (tableName: string) => {
    if (!openedTables.includes(tableName)) {
      setOpenedTables([...openedTables, tableName]);
    }
    setActiveDataTab(tableName);
  };

  const closeTableTab = (tableName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenedTables = openedTables.filter(t => t !== tableName);
    setOpenedTables(newOpenedTables);
    if (activeDataTab === tableName && newOpenedTables.length > 0) {
      setActiveDataTab(newOpenedTables[0]);
    }
  };

  const highlightSql = (sql: string) => {
    const keywords = /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INTO|VALUES|SET|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|UNION|ALL|EXISTS|BETWEEN|IS|NULL|DESC|ASC|DESCRIBE)\b/gi;

    return sql.replace(keywords, (match) => `<span style="color: #0366d6; font-weight: 600;">${match}</span>`);
  };

  return (
    <>
      <S.Container>
        <S.Header>
          <S.Title>Aemaehano DB</S.Title>
        </S.Header>

        <S.TabContainer>
          <S.Tab $active={activeTab === 'ui'} onClick={() => setActiveTab('ui')}>
            테이블 UI
          </S.Tab>
          <S.Tab $active={activeTab === 'sql'} onClick={() => setActiveTab('sql')}>
            SQL 쿼리
          </S.Tab>
          <S.Tab $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            설정
          </S.Tab>
        </S.TabContainer>

        {activeTab === 'ui' && (
          <S.ContentWrapper>
            <S.Sidebar>
              <S.SidebarHeader>
                <Button variant="confirm" onClick={() => setIsCreateModalOpen(true)}>
                  새 테이블
                </Button>
              </S.SidebarHeader>

              <S.SearchWrapper>
                <Input
                  placeholder="테이블 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </S.SearchWrapper>

              <S.TableList>
                {MOCK_TABLES.filter(table =>
                  table.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((table) => (
                  <S.TableItemWrapper key={table.id}>
                    <S.TableItem
                      $selected={selectedTable === table.id}
                      onClick={() => {
                        setSelectedTable(table.id);
                        handleTableClick(table.name);
                      }}
                    >
                      <S.TableIcon />
                      <S.TableName>{table.name}</S.TableName>
                      <S.TableMenu onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenTable(menuOpenTable === table.id ? null : table.id);
                      }}>⋮</S.TableMenu>
                    </S.TableItem>
                    {menuOpenTable === table.id && (
                      <S.TableDropdown>
                        <S.DropdownItem onClick={() => {
                          setIsEditModalOpen(true);
                          setMenuOpenTable(null);
                        }}>수정</S.DropdownItem>
                        <S.DropdownItem $danger onClick={() => {
                          setMenuOpenTable(null);
                          // TODO: 삭제 기능
                        }}>삭제</S.DropdownItem>
                      </S.TableDropdown>
                    )}
                  </S.TableItemWrapper>
                ))}
              </S.TableList>

              <S.SidebarActions />
            </S.Sidebar>

            <S.MainContent>
              <S.DataTabContainer>
                {openedTables.map((tableName) => (
                  <S.DataTab
                    key={tableName}
                    $active={activeDataTab === tableName}
                    onClick={() => setActiveDataTab(tableName)}
                  >
                    <S.DataTabIcon />
                    {tableName}
                    {openedTables.length > 1 && (
                      <S.CloseTab onClick={(e) => closeTableTab(tableName, e)}>×</S.CloseTab>
                    )}
                  </S.DataTab>
                ))}
              </S.DataTabContainer>

              <S.ActionBar>
                <Button variant="confirm">값 추가</Button>
              </S.ActionBar>

              <S.TableWrapper>
                <S.Table>
                  <S.TableHead>
                    <S.TableRow>
                      <S.CheckboxCell>
                        <input type="checkbox" />
                      </S.CheckboxCell>
                      {MOCK_COLUMNS.map((column, idx) => (
                        <S.TableHeaderCell key={idx}>
                          <S.ColumnHeader>
                            {column.isPrimary && (
                              <S.KeyIcon src="/icons/cloud-db/primary.svg" alt="Primary Key" />
                            )}
                            {column.isForeign && (
                              <S.KeyIcon src="/icons/cloud-db/foreign.svg" alt="Foreign Key" />
                            )}
                            {column.name} <S.SortIcon>{column.type}</S.SortIcon>
                          </S.ColumnHeader>
                        </S.TableHeaderCell>
                      ))}
                    </S.TableRow>
                  </S.TableHead>
                  <S.TableBody>
                    {MOCK_DATA.map((row, idx) => (
                      <S.TableRow key={idx}>
                        <S.CheckboxCell>
                          <input type="checkbox" />
                        </S.CheckboxCell>
                        <S.TableCell>{row.id}</S.TableCell>
                        <S.TableCell>{row.user_id}</S.TableCell>
                        <S.TableCell>{row.date}</S.TableCell>
                        <S.TableCell>{row.status}</S.TableCell>
                        <S.TableCell>{row.created_at}</S.TableCell>
                      </S.TableRow>
                    ))}
                  </S.TableBody>
                </S.Table>
              </S.TableWrapper>
            </S.MainContent>
          </S.ContentWrapper>
        )}

        {activeTab === 'sql' && (
          <S.SqlContainer>
            <S.SqlTabContainer>
              {MOCK_SQL_QUERIES.map((query) => (
                <S.SqlTab
                  key={query.id}
                  $active={activeSqlTab === query.id}
                  onClick={() => {
                    setActiveSqlTab(query.id);
                    setSqlQuery(query.query);
                  }}
                >
                  <S.SqlTabIcon />#{query.id}
                  <S.SqlTabClose>×</S.SqlTabClose>
                </S.SqlTab>
              ))}
              <S.SqlTabAdd>+</S.SqlTabAdd>
            </S.SqlTabContainer>

            <S.SqlEditor>
              <S.SqlLineNumbers>
                {sqlQuery.split('\n').map((_, idx) => (
                  <S.SqlLineNumber key={idx}>{idx + 1}</S.SqlLineNumber>
                ))}
              </S.SqlLineNumbers>
              <S.SqlEditorWrapper>
                <S.SqlHighlight
                  dangerouslySetInnerHTML={{ __html: highlightSql(sqlQuery) }}
                />
                <S.SqlTextarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SQL 쿼리를 입력하세요"
                  spellCheck={false}
                />
              </S.SqlEditorWrapper>
            </S.SqlEditor>

            <S.SqlResultSection>
              <S.SqlResultHeader>
                <S.SqlResultTitle>결과</S.SqlResultTitle>
                <Button variant="confirm" size="small">실행</Button>
              </S.SqlResultHeader>

              <S.TableWrapper>
                <S.Table>
                  <S.TableHead>
                    <S.TableRow>
                      <S.TableHeaderCell>id <S.SortIcon>int</S.SortIcon></S.TableHeaderCell>
                      <S.TableHeaderCell>user_id <S.SortIcon>int</S.SortIcon></S.TableHeaderCell>
                      <S.TableHeaderCell>date <S.SortIcon>timestamp</S.SortIcon></S.TableHeaderCell>
                    </S.TableRow>
                  </S.TableHead>
                  <S.TableBody>
                    {MOCK_SQL_RESULT.map((row, idx) => (
                      <S.TableRow key={idx}>
                        <S.TableCell>{row.id}</S.TableCell>
                        <S.TableCell>{row.user_id}</S.TableCell>
                        <S.TableCell>{row.date}</S.TableCell>
                      </S.TableRow>
                    ))}
                  </S.TableBody>
                </S.Table>
              </S.TableWrapper>
            </S.SqlResultSection>
          </S.SqlContainer>
        )}

        {activeTab === 'settings' && (
          <S.ContentWrapper>
            <S.EmptyMessage>설정 기능은 준비 중입니다.</S.EmptyMessage>
          </S.ContentWrapper>
        )}
      </S.Container>

      <TableCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data: { tableName: string; columns: any[] }) => {
          console.log('Create table:', data);
          setIsCreateModalOpen(false);
        }}
      />

      <TableEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tableName={currentTable?.name || ''}
        onSubmit={(data: { tableName: string; columns: any[] }) => {
          console.log('Edit table:', data);
          setIsEditModalOpen(false);
        }}
      />
    </>
  );
}

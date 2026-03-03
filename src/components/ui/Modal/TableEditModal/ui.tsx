'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Modal from '../ui';
import Input from '../../Input/ui';
import Button from '../../Button/ui';
import * as S from '../tableStyle';

interface Column {
  name: string;
  type: string;
  length?: string;
  primaryKey: boolean;
  notNull: boolean;
  autoIncrement: boolean;
  unique: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  onSubmit: (data: { tableName: string; columns: Column[] }) => void;
}

const COLUMN_TYPES = [
  'INT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 'TIMESTAMP',
  'BOOLEAN', 'DECIMAL', 'FLOAT', 'DOUBLE'
];

// Mock existing columns (실제로는 props로 받아야 함)
const EXISTING_COLUMNS: Column[] = [
  {
    name: 'id',
    type: 'INT',
    primaryKey: true,
    notNull: true,
    autoIncrement: true,
    unique: false,
  },
  {
    name: 'name',
    type: 'VARCHAR',
    length: '255',
    primaryKey: false,
    notNull: true,
    autoIncrement: false,
    unique: false,
  },
];

export default function TableEditModal({ isOpen, onClose, tableName, onSubmit }: Props) {
  const [newTableName, setNewTableName] = useState(tableName);
  const [columns, setColumns] = useState<Column[]>(EXISTING_COLUMNS);
  const [activeTab, setActiveTab] = useState<'columns' | 'foreignKeys'>('columns');

  useEffect(() => {
    setNewTableName(tableName);
    setColumns(EXISTING_COLUMNS);
  }, [tableName, isOpen]);

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        name: '',
        type: 'VARCHAR',
        primaryKey: false,
        notNull: false,
        autoIncrement: false,
        unique: false,
      },
    ]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof Column, value: any) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  const handleSubmit = () => {
    if (!newTableName) {
      alert('테이블 이름을 입력해주세요.');
      return;
    }
    if (columns.some((col) => !col.name)) {
      alert('모든 컬럼의 이름을 입력해주세요.');
      return;
    }
    onSubmit({ tableName: newTableName, columns });
  };

  return (
    <Modal open={isOpen} onClose={onClose} width={700} height="auto" position="right">
      <S.ModalContent>
        <S.ModalTitle>테이블 수정</S.ModalTitle>
        <S.FormGroup>
          <S.Label>테이블 이름</S.Label>
          <Input
            placeholder="테이블 이름을 입력하세요"
            value={newTableName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTableName(e.target.value)}
          />
        </S.FormGroup>

        <S.TabContainer>
          <S.Tab $active={activeTab === 'columns'} onClick={() => setActiveTab('columns')}>
            컬럼 설정
          </S.Tab>
          <S.Tab $active={activeTab === 'foreignKeys'} onClick={() => setActiveTab('foreignKeys')}>
            외래키 설정
          </S.Tab>
        </S.TabContainer>

        {activeTab === 'columns' && (
          <S.ColumnsSection>
            {columns.map((column, index) => (
              <S.ColumnRow key={index}>
                <S.ColumnInputGroup>
                  <Input
                    placeholder="컬럼명"
                    value={column.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateColumn(index, 'name', e.target.value)}
                  />
                  <S.Select
                    value={column.type}
                    onChange={(e) => updateColumn(index, 'type', e.target.value)}
                  >
                    {COLUMN_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </S.Select>
                  {(column.type === 'VARCHAR' || column.type === 'DECIMAL') && (
                    <Input
                      placeholder="길이"
                      value={column.length || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateColumn(index, 'length', e.target.value)}
                    />
                  )}
                </S.ColumnInputGroup>

                <S.CheckboxGroup>
                  <S.Checkbox>
                    <input
                      type="checkbox"
                      checked={column.primaryKey}
                      onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                    />
                    <span>PK</span>
                  </S.Checkbox>
                  <S.Checkbox>
                    <input
                      type="checkbox"
                      checked={column.notNull}
                      onChange={(e) => updateColumn(index, 'notNull', e.target.checked)}
                    />
                    <span>NOT NULL</span>
                  </S.Checkbox>
                  <S.Checkbox>
                    <input
                      type="checkbox"
                      checked={column.autoIncrement}
                      onChange={(e) => updateColumn(index, 'autoIncrement', e.target.checked)}
                    />
                    <span>AI</span>
                  </S.Checkbox>
                  <S.Checkbox>
                    <input
                      type="checkbox"
                      checked={column.unique}
                      onChange={(e) => updateColumn(index, 'unique', e.target.checked)}
                    />
                    <span>UNI</span>
                  </S.Checkbox>
                </S.CheckboxGroup>

                {columns.length > 1 && (
                  <S.RemoveButton onClick={() => removeColumn(index)}>
                    ✕
                  </S.RemoveButton>
                )}
              </S.ColumnRow>
            ))}

            <Button variant="cancel" size="small" onClick={addColumn}>
              + 컬럼 추가
            </Button>
          </S.ColumnsSection>
        )}

        {activeTab === 'foreignKeys' && (
          <S.ForeignKeysSection>
            <S.InfoText>외래키 설정 기능은 추후 추가될 예정입니다.</S.InfoText>
          </S.ForeignKeysSection>
        )}

        <S.ButtonGroup>
          <Button variant="cancel" size="medium" onClick={onClose}>
            취소
          </Button>
          <Button variant="confirm" size="medium" onClick={handleSubmit}>
            저장하기
          </Button>
        </S.ButtonGroup>
      </S.ModalContent>
    </Modal>
  );
}

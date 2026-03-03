'use client';

import { useState, ChangeEvent } from 'react';
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
  onSubmit: (data: { tableName: string; columns: Column[] }) => void;
}

const COLUMN_TYPES = [
  'INT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 'TIMESTAMP',
  'BOOLEAN', 'DECIMAL', 'FLOAT', 'DOUBLE'
];

export default function TableCreateModal({ isOpen, onClose, onSubmit }: Props) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    {
      name: '',
      type: 'INT',
      primaryKey: false,
      notNull: false,
      autoIncrement: false,
      unique: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState<'columns' | 'foreignKeys'>('columns');

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
    if (!tableName) {
      alert('테이블 이름을 입력해주세요.');
      return;
    }
    if (columns.some((col) => !col.name)) {
      alert('모든 컬럼의 이름을 입력해주세요.');
      return;
    }
    onSubmit({ tableName, columns });
    // Reset form
    setTableName('');
    setColumns([
      {
        name: '',
        type: 'INT',
        primaryKey: false,
        notNull: false,
        autoIncrement: false,
        unique: false,
      },
    ]);
  };

  return (
    <Modal open={isOpen} onClose={onClose} width={700} height="auto" position="right">
      <S.ModalContent>
        <S.ModalTitle>새 테이블 생성</S.ModalTitle>
        <S.FormGroup>
          <S.Label>테이블 이름</S.Label>
          <Input
            placeholder="테이블 이름을 입력하세요"
            value={tableName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTableName(e.target.value)}
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
            <S.InfoText>외래키는 테이블 생성 후 추가할 수 있습니다.</S.InfoText>
          </S.ForeignKeysSection>
        )}

        <S.ButtonGroup>
          <Button variant="cancel" size="medium" onClick={onClose}>
            취소
          </Button>
          <Button variant="confirm" size="medium" onClick={handleSubmit}>
            생성하기
          </Button>
        </S.ButtonGroup>
      </S.ModalContent>
    </Modal>
  );
}

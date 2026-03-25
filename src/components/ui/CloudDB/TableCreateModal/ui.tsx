'use client';

import { useState, ChangeEvent } from 'react';
import Modal from '../../Modal/ui';
import Button from '../../Button/ui';
import * as S from '../tableStyle';
import ForeignKeyModal from '../ForeignKeyModal/ui';

interface Column {
  name: string;
  type: string;
  defaultValue: string;
  primaryKey: boolean;
  notNull: boolean;
  autoIncrement: boolean;
  unique: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { tableName: string; description: string; columns: Column[] }) => void;
}

const COLUMN_TYPES = [
  'int8', 'varchar', 'text', 'date', 'datetime', 'timestamp',
  'boolean', 'decimal', 'float', 'double'
];

const DragHandleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="8" x2="20" y2="8"></line>
    <line x1="4" y1="16" x2="20" y2="16"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const CaretDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
);

export default function TableCreateModal({ isOpen, onClose, onSubmit }: Props) {
  const [isFkModalOpen, setIsFkModalOpen] = useState(false);
  const [tableName, setTableName] = useState('');
  const [description, setDescription] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    {
      name: 'id',
      type: 'int8',
      defaultValue: 'NULL',
      primaryKey: true,
      notNull: false,
      autoIncrement: false,
      unique: false,
    },
    {
      name: 'id',
      type: 'int8',
      defaultValue: 'NULL',
      primaryKey: false,
      notNull: false,
      autoIncrement: false,
      unique: false,
    },
  ]);

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        name: '',
        type: 'varchar',
        defaultValue: 'NULL',
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
    onSubmit({ tableName, description, columns });
    
    // Reset form after submit
    setTableName('');
    setDescription('');
    setColumns([
      {
        name: 'id',
        type: 'int8',
        defaultValue: 'NULL',
        primaryKey: true,
        notNull: false,
        autoIncrement: false,
        unique: false,
      },
      {
        name: 'id',
        type: 'int8',
        defaultValue: 'NULL',
        primaryKey: false,
        notNull: false,
        autoIncrement: false,
        unique: false,
      },
    ]);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} width={760} height="100vh" position="right" closeOnOverlay={true} padding={0}>
      <S.ModalContainer>
        <S.ModalHeader>
          <S.ModalTitle>새 테이블 생성</S.ModalTitle>
        </S.ModalHeader>

        <S.ModalBody>
          <S.FormGroup>
            <S.Label>테이블 명</S.Label>
            <S.CustomInput
              placeholder="예: user"
              value={tableName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTableName(e.target.value)}
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label $color="#6B6B6B">설명</S.Label>
            <S.OptionalInputWrapper>
              <input
                placeholder="Optional"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              />
            </S.OptionalInputWrapper>
          </S.FormGroup>

          {/* Columns Section */}
          <div>
            <S.SectionTitle>컬럼</S.SectionTitle>
            <S.TableContainer>
              <S.TableHeader>
                <div />{/* spacing for drag handle */}
                <S.HeaderCell>이름</S.HeaderCell>
                <S.HeaderCell>타입</S.HeaderCell>
                <S.HeaderCell>기본 값</S.HeaderCell>
                <S.HeaderCell $align="center">Primary</S.HeaderCell>
                <S.HeaderCell />
                <S.HeaderCell />
              </S.TableHeader>

              {columns.map((col, index) => (
                <S.TableRow key={index}>
                  <S.DragHandle>
                    <DragHandleIcon />
                  </S.DragHandle>

                  <S.NameInputWrapper>
                    <S.NameInput
                      placeholder=""
                      value={col.name}
                      onChange={(e) => updateColumn(index, 'name', e.target.value)}
                    />
                    <S.ChainButton onClick={() => setIsFkModalOpen(true)}>
                      <img src="/icons/cloud-db/chain.svg" alt="foreign key" width={16} height={16} />
                    </S.ChainButton>
                  </S.NameInputWrapper>

                  <S.InputWrapper>
                    <S.TableSelect
                      value={col.type}
                      onChange={(e) => updateColumn(index, 'type', e.target.value)}
                    >
                      {COLUMN_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </S.TableSelect>
                    <S.InputIcon>
                      <CaretDownIcon />
                    </S.InputIcon>
                  </S.InputWrapper>

                  <S.InputWrapper>
                    <S.TableInput
                      placeholder=""
                      value={col.defaultValue}
                      onChange={(e) => updateColumn(index, 'defaultValue', e.target.value)}
                    />
                  </S.InputWrapper>

                  <S.CheckboxWrapper>
                    <S.Checkbox
                      type="checkbox"
                      checked={col.primaryKey}
                      onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                    />
                  </S.CheckboxWrapper>

                  <S.ActionButtons>
                    <S.IconButton>
                      <SettingsIcon />
                    </S.IconButton>
                    <S.IconButton onClick={() => removeColumn(index)}>
                      <CloseIcon />
                    </S.IconButton>
                  </S.ActionButtons>
                </S.TableRow>
              ))}

              <S.DashedButton onClick={addColumn}>
                새 컬럼
              </S.DashedButton>
            </S.TableContainer>
          </div>

          {/* Foreign Keys Section */}
          <div>
            <S.SectionTitle>외래 키</S.SectionTitle>
            <S.ForeignKeyBox>
              <S.FKTargetWrap>
                <S.Label $color="#000">외래 키가 참조하는 테이블:</S.Label>
                <S.SelectBadge>
                  <TableIcon /> user
                </S.SelectBadge>
              </S.FKTargetWrap>

              <S.FKShip>
                user_id → user.id
              </S.FKShip>
            </S.ForeignKeyBox>

            <S.DashedButton style={{ marginTop: '0.5rem' }}>
              새 외래 키 릴레이션
            </S.DashedButton>
          </div>
        </S.ModalBody>

        <S.ModalFooter>
          <Button variant="cancel" style={{ width: '80px', borderRadius: '4px' }} onClick={onClose}>
            취소
          </Button>
          <Button variant="confirm" style={{ width: '80px', borderRadius: '4px', background: '#030982' }} onClick={handleSubmit}>
            생성
          </Button>
        </S.ModalFooter>
      </S.ModalContainer>
      <ForeignKeyModal isOpen={isFkModalOpen} onClose={() => setIsFkModalOpen(false)} />
    </Modal>
  );
}

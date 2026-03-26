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

export default function TableCreateModal({ isOpen, onClose, onSubmit }: Props) {
  const [isFkModalOpen, setIsFkModalOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer?.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newColumns = [...columns];
    const draggedItem = newColumns[draggedIdx];
    newColumns.splice(draggedIdx, 1);
    newColumns.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    setColumns(newColumns);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
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
                <S.TableRow
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{ opacity: draggedIdx === index ? 0.5 : 1 }}
                >
                  <S.DragHandle>
                    <img src="/icons/cloud-db/drag-handle.svg" alt="drag" width={20} height={20} />
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
                      <img src="/icons/cloud-db/caret-down.svg" alt="down" width={16} height={16} />
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
                      <img src="/icons/cloud-db/settings.svg" alt="settings" width={16} height={16} />
                    </S.IconButton>
                    <S.IconButton onClick={() => removeColumn(index)}>
                      <img src="/icons/cloud-db/close.svg" alt="close" width={16} height={16} />
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
                  <img src="/icons/cloud-db/table.svg" alt="table" width={16} height={16} /> user
                </S.SelectBadge>
              </S.FKTargetWrap>

              <S.FKShip>
                user_id → user.id
              </S.FKShip>
            </S.ForeignKeyBox>

            <S.DashedButton style={{ marginTop: '0.5rem' }} onClick={() => setIsFkModalOpen(true)}>
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

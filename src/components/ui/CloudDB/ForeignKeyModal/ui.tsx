'use client';

import { useState } from 'react';
import Modal from '../../Modal/ui';
import Button from '../../Button/ui';
import * as S from '../tableStyle';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}



export default function ForeignKeyModal({ isOpen, onClose }: Props) {
  const [refTable, setRefTable] = useState('');
  const [refColumn, setRefColumn] = useState('');
  const [targetColumn, setTargetColumn] = useState('');

  const [onUpdate, setOnUpdate] = useState('Cascade');
  const [onDelete, setOnDelete] = useState('Cascade');

  return (
    <Modal open={isOpen} onClose={onClose} width={480} height="100vh" position="right" closeOnOverlay={true} padding={0}>
      <S.ModalContainer>
        <S.ModalHeader>
          <S.ModalTitle>새 테이블에 외래 키 관계 추가</S.ModalTitle>
        </S.ModalHeader>

        <S.ModalBody>
          <S.FKFormGroup>
            <S.Label style={{ marginBottom: '0.25rem', color: '#000' }}>참조할 테이블을 선택하세요</S.Label>
            <S.InputWrapper>
              <S.TableSelect
                value={refTable}
                onChange={(e) => setRefTable(e.target.value)}
                style={{ height: '40px', padding: '0 1rem' }}
              >
                <option value="">---</option>
                <option value="user">user</option>
                <option value="project">project</option>
                <option value="emote">emote</option>
                <option value="title">title</option>
                <option value="book">book</option>
                <option value="meterial">meterial</option>
                <option value="application">application</option>
              </S.TableSelect>
              <S.InputIcon style={{ right: '1rem' }}>
                <img src="/icons/cloud-db/caret-down.svg" alt="down" width={16} height={16} />
              </S.InputIcon>
            </S.InputWrapper>
          </S.FKFormGroup>

          <S.FKFormGroup>
            <S.Label style={{ marginBottom: '0.25rem', color: '#000' }}>
              참조할 {refTable || '---'} 의 컬럼을 선택하세요
            </S.Label>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#666', flex: 1 }}>테이블의 이름</span>
              <span style={{ fontSize: '0.75rem', color: '#666', flex: 1, paddingLeft: '56px' }}>{refTable || '---'}</span>
            </div>

            <S.FKSelectRow>
              <S.InputWrapper style={{ flex: 1 }}>
                <S.TableSelect
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  style={{ height: '40px', padding: '0 1rem' }}
                >
                  <option value="">---</option>
                  <option value="id">id</option>
                  <option value="name">name</option>
                </S.TableSelect>
                <S.InputIcon style={{ right: '1rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </S.InputIcon>
              </S.InputWrapper>

              <div style={{ padding: '0 0.5rem', color: '#333', display: 'flex' }}>
                <img src="/icons/cloud-db/uil_arrow.svg" alt="arrow right" width={20} height={20} />
              </div>

              <S.InputWrapper style={{ flex: 1 }}>
                <S.TableSelect
                  value={refColumn}
                  onChange={(e) => setRefColumn(e.target.value)}
                  style={{ height: '40px', padding: '0 1rem' }}
                >
                  <option value="">---</option>
                  <option value="id">id</option>
                  <option value="name">name</option>
                </S.TableSelect>
                <S.InputIcon style={{ right: '1rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </S.InputIcon>
              </S.InputWrapper>
            </S.FKSelectRow>

            <S.DashedButton style={{ marginTop: '0.5rem', alignSelf: 'flex-start', border: '1px solid #e5e7eb', width: 'auto', padding: '0.5rem 1rem' }}>
              다른 컬럼 추가
            </S.DashedButton>
          </S.FKFormGroup>

          <S.FKFormGroup>
            <S.Label style={{ marginBottom: '0.25rem', color: '#000' }}>참조된 행이 수정될 때의 동작</S.Label>
            <S.InputWrapper>
              <S.TableSelect
                value={onUpdate}
                onChange={(e) => setOnUpdate(e.target.value)}
                style={{ height: '40px', padding: '0 1rem' }}
              >
                <option value="Cascade">Cascade</option>
                <option value="Restrict">Restrict</option>
                <option value="Set Null">Set Null</option>
                <option value="No Action">No Action</option>
              </S.TableSelect>
              <S.InputIcon style={{ right: '1rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </S.InputIcon>
            </S.InputWrapper>
          </S.FKFormGroup>

          <S.FKFormGroup>
            <S.Label style={{ marginBottom: '0.25rem', color: '#000' }}>참조된 행이 삭제될 때의 동작</S.Label>
            <S.InputWrapper>
              <S.TableSelect
                value={onDelete}
                onChange={(e) => setOnDelete(e.target.value)}
                style={{ height: '40px', padding: '0 1rem' }}
              >
                <option value="Cascade">Cascade</option>
                <option value="Restrict">Restrict</option>
                <option value="Set Null">Set Null</option>
                <option value="No Action">No Action</option>
              </S.TableSelect>
              <S.InputIcon style={{ right: '1rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </S.InputIcon>
            </S.InputWrapper>
          </S.FKFormGroup>

        </S.ModalBody>

        <S.ModalFooter>
          <Button variant="cancel" style={{ width: '80px', borderRadius: '4px' }} onClick={onClose}>
            취소
          </Button>
          <Button variant="confirm" style={{ width: '80px', borderRadius: '4px', background: '#030982' }} onClick={onClose}>
            저장
          </Button>
        </S.ModalFooter>
      </S.ModalContainer>
    </Modal>
  );
}

import React from 'react';
import * as S from './style';
import { ProjectResource } from '@/types/dashboard';
import ProgressBar from '../Charts/ProgressBar/ui';

interface ResourceAllocationProps {
  projects: ProjectResource[];
}

export const ResourceAllocation: React.FC<ResourceAllocationProps> = ({ projects }) => {
  return (
    <S.AllocationContainer>
      <S.AllocationList>
        {projects.map((project) => (
          <S.ProjectCard key={project.id}>
            <S.ProjectName>{project.name}</S.ProjectName>
            <S.ResourceGrid>

              <S.ResourceItem>
                <S.ResourceHeader>
                  <S.ResourceLabel>CPU</S.ResourceLabel>
                  <S.ResourceValue>{project.allocation.cpu}%</S.ResourceValue>
                </S.ResourceHeader>
                <S.ProgressBarWrapper>
                  <ProgressBar value={project.allocation.cpu} max={100} height={4} />
                </S.ProgressBarWrapper>
              </S.ResourceItem>

              <S.ResourceItem>
                <S.ResourceHeader>
                  <S.ResourceLabel>MEM</S.ResourceLabel>
                  <S.ResourceValue>{project.allocation.memory.current}GB</S.ResourceValue>
                </S.ResourceHeader>
                <S.ProgressBarWrapper>
                  <ProgressBar
                    value={project.allocation.memory.current}
                    max={project.allocation.memory.max}
                    height={4}
                  />
                </S.ProgressBarWrapper>
              </S.ResourceItem>

              <S.ResourceItem>
                <S.ResourceHeader>
                  <S.ResourceLabel>DISK</S.ResourceLabel>
                  <S.ResourceValue>{project.allocation.disk.current}GB</S.ResourceValue>
                </S.ResourceHeader>
                <S.ProgressBarWrapper>
                  <ProgressBar
                    value={project.allocation.disk.current}
                    max={project.allocation.disk.max}
                    height={4}
                  />
                </S.ProgressBarWrapper>
              </S.ResourceItem>

              <S.ResourceItem>
                <S.ResourceHeader>
                  <S.ResourceLabel>INSTANCE</S.ResourceLabel>
                  <S.ResourceValue>{project.allocation.instance.current}</S.ResourceValue>
                </S.ResourceHeader>
                <S.ProgressBarWrapper>
                  <ProgressBar
                    value={project.allocation.instance.current}
                    max={project.allocation.instance.max}
                    height={4}
                  />
                </S.ProgressBarWrapper>
              </S.ResourceItem>

            </S.ResourceGrid>
          </S.ProjectCard>
        ))}
      </S.AllocationList>
    </S.AllocationContainer>
  );
};

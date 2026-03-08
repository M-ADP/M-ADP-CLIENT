import styled from '@emotion/styled';

export const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 16px 24px;
  background-color: #f8f9fc;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
`;

export const TopSection = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  
  > div:first-of-type {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  
  > div:last-of-type {
    flex: 1.4;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
`;

export const BottomSection = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  
  > div:first-of-type {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  
  > div:last-of-type {
    flex: 0 0 450px;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
`;

export const ChartArea = styled.div`
  flex: 1;
  min-height: 0;
`;

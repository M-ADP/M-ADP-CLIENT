import styled from '@emotion/styled';

export const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

export const TrafficPlaceholderCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  padding: 20px 24px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
`;

export const TrafficPlaceholderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TrafficPlaceholderTitle = styled.h3`
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
`;

export const TrafficPlaceholderBody = styled.div`
  margin-top: 16px;
  flex: 1;
  border: 1px dashed #d0d7e4;
  border-radius: 16px;
  background: #f8faff;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
`;

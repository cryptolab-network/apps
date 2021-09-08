import React from 'react';
import styled from 'styled-components';
import UnderConstruction from '../../components/UnderConstruction';
import { useLocation } from 'react-router';
import { sendPageView } from '../../utils/ga';

const Management: React.FC = () => {
  sendPageView(useLocation());
  return (
    <MainLayout>
      <UnderConstruction />
    </MainLayout>
  )
};

export default Management;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: auto;
`;
import React from 'react';
import styled from 'styled-components';
import UnderConstruction from '../../components/UnderConstruction';

const Guide: React.FC = () => {
  return (
    <MainLayout>
      <UnderConstruction />
    </MainLayout>
  )
};

export default Guide;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: auto;
`;
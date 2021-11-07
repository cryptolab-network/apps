import styled from 'styled-components';
import ValNomStatus from './components/ValidatorsCardStyle';
import { useLocation } from 'react-router';
import { sendPageView } from '../../../utils/ga';

const ValNom = () => {
  sendPageView(useLocation());
  return (
    <ValNomLayout>
      <MainLayout>
        <ValNomStatus />
      </MainLayout>
    </ValNomLayout>
  );
};

export default ValNom;

const ValNomLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-left: 6px;
  padding-right: 6px;
`;

import styled from 'styled-components';
import ValNomStatus from './components/ValidatorsCardStyle';

const ValNom = () => {
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
`;
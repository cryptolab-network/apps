import styled from 'styled-components';
import SRRStatus from './components/SRRStatus';

const ValNom = () => {
  return (
    <SRRLayout>
      <MainLayout>
        <SRRStatus />
      </MainLayout>
    </SRRLayout>
  );
};

export default ValNom;

const SRRLayout = styled.div`
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

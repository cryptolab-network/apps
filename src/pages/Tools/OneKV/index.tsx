import styled from 'styled-components';
import { OneKVStatus } from './components/oneKVStatus';

const OneKV = (props) => {
  return (
    <OneKVLayout>
      <MainLayout>
        <OneKVStatus />
      </MainLayout>
    </OneKVLayout>
  );
};

export default OneKV;

const OneKVLayout = styled.div`
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

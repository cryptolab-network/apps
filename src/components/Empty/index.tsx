import styled from 'styled-components';
import { ReactComponent as EmptyIcon } from '../../assets/images/empty.svg';

const Empty = () => {
  return (
    <MainLayout>
      <EmptyIcon />
      <Hint>There is no data to display.</Hint>
    </MainLayout>
  );
};

export default Empty;

const MainLayout = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Hint = styled.div`
  margin-top: 30px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: white;
`;

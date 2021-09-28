import styled from 'styled-components';

const Empty = () => {
  return <MainLayout>Is Empty</MainLayout>;
};

export default Empty;

const MainLayout = styled.div`
  width: 100%;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: #23beb9;
  text-align: center;
`;

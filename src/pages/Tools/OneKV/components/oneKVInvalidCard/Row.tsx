import styled from 'styled-components';

const Row = ({ label, value }) => {
  return (
    <MainLayout>
      <Label>{label}</Label>
      <div>{value}</div>
    </MainLayout>
  );
};

export default Row;

const MainLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #404952;
`;

const Label = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
`;

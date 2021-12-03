import styled from 'styled-components';

const Reason = ({ label, value }) => {
  return (
    <MainLayout>
      <Label>{label}</Label>
      <div style={{ width: '100%' }}>{value}</div>
    </MainLayout>
  );
};

export default Reason;

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
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid #404952;
`;

const Label = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
`;

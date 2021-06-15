import styled from 'styled-components';

const CardHeader = ({ Header, children = {} }) => {
  return (
    <CardHeaderLayout>
      <HeaderLayout>
        <Header />
      </HeaderLayout>
      <MainContentLayout>{children}</MainContentLayout>
    </CardHeaderLayout>
  );
};

export default CardHeader;

const CardHeaderLayout = styled.div`
  width: 100%;
  border-radius: 8px;
  border: solid 1px #23beb9;
  background-color: #18232f;
  margin-top: 25px;
`;

const HeaderLayout = styled.div`
  width: 100%;
  border-bottom: solid 1px #23beb9;
  padding: 17px 27px 17px 27px;
  box-sizing: border-box;
`;

const MainContentLayout = styled.div`
  padding: 29px 29px 15px 29px;
  display: flex;
  flex-direction: column;
`;

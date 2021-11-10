import styled from 'styled-components';

const CardHeaderFullWidth = ({ Header, children = {}, alignItems = 'center', mainPadding = '' }) => {
  return (
    <CardHeaderLayout>
      <HeaderLayout>
        <Header />
      </HeaderLayout>
      <MainContentLayout alignItems={alignItems} padding={mainPadding}>
        {children}
      </MainContentLayout>
    </CardHeaderLayout>
  );
};

export default CardHeaderFullWidth;

const CardHeaderLayout = styled.div`
  width: calc(100vw - 32px);
  border-radius: 8px;
  border: solid 1px #23beb9;
  background-color: #18232f;
  margin-top: 25px;
`;

const HeaderLayout = styled.div`
  width: 100%;
  /* max-height: 72px; */
  border-bottom: solid 1px #23beb9;
  padding: 17px 27px 17px 27px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

interface MainContentLayoutProps {
  alignItems: string;
  padding?: string;
}
const MainContentLayout = styled.div<MainContentLayoutProps>`
  padding: ${(props) => (props.padding ? props.padding : '29px 29px 15px 29px')};
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.alignItems};
`;

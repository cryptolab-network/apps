import styled from 'styled-components';

const CardHeaderValNom = ({ Header, children = {}, alignItems = 'center', mainPadding = '' }) => {
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

export default CardHeaderValNom;

const CardHeaderLayout = styled.div`
  width: 1400px;
  border-radius: 8px;
  border: solid 1px #23beb9;
  background-color: #18232f;
  margin-top: 25px;
  @media (max-width: 1440px) {
    width: 936px;
  }
  @media (max-width: 968px) {
    width: 472px;
  }

  @media (max-width: 540px) {
    width: 240px;
  }
`;

const HeaderLayout = styled.div`
  width: 100%;
  max-height: 72px;
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

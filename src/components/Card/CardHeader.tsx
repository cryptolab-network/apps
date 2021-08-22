import styled from 'styled-components';

const CardHeader = ({ Header, children = {}, alignItems = 'center' }) => {
  return (
    <CardHeaderLayout>
      <HeaderLayout>
        <Header />
      </HeaderLayout>
      <MainContentLayout alignItems={alignItems}>{children}</MainContentLayout>
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
  max-height: 72px;
  border-bottom: solid 1px #23beb9;
  padding: 17px 27px 17px 27px;
  box-sizing: border-box;
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

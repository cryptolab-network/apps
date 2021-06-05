import { useMemo } from 'react';
import styled from 'styled-components';
import Button from './components/Button';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Portal from './pages/portal';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';

// menu
const menuList = [
  { title: 'Staking Guide', url: '' },
  { title: 'Portfolio Benchmark', url: '' },
  { title: 'Portfolio Management', url: '' },
];

const MenuItem = ({ title = '', onClick = () => {} }) => {
  return <MenuListItem onClick={onClick}>{title}</MenuListItem>;
};

const MenuUnorderList = styled.ul`
  padding-left: 0px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MenuListItem = styled.li`
  font-family: Montserrat;
  font-weight: bold;
  font-size: 16px;
  color: white;
  height: 100%;
  margin-left: 32px;
  margin-right: 32px;
  border-bottom: 2px solid transparent;
  :hover {
    color: #23beb9;
    border-bottom: 2px solid #23beb9;
    -webkit-transition: border 300ms ease-out;
    -moz-transition: border 300ms ease-out;
    -o-transition: border 300ms ease-out;
    transition: border 300ms ease-out;
  }
`;
// header
const Header = () => {
  const MenuDOM = useMemo(() => {
    let dom = menuList.map((item) => {
      console.log('item: ', item.title);
      return (
        <MenuItem
          title={item.title}
          onClick={() => {
            console.log(`link to: ${item.url}`);
          }}
        />
      );
    });
    return <MenuUnorderList>{dom}</MenuUnorderList>;
  }, []);
  return (
    <HeaderDiv>
      <HeaderLeftDiv>
        <CryptoLabLogo />
      </HeaderLeftDiv>
      <HeaderMidDiv>{MenuDOM}</HeaderMidDiv>
      <HeaderRightDiv>
        <Button
          title="Use Benchmark"
          onClick={() => {
            console.log('test');
          }}
        />
      </HeaderRightDiv>
    </HeaderDiv>
  );
};

// main applayout, include star animation and light gradient
const AppLayout = () => {
  return (
    <>
      <GradientLight>
        <Header />
        <BrowserRouter>
          <RouteContent>
            <Switch>
              <Route path="/" component={Portal} />
            </Switch>
          </RouteContent>
        </BrowserRouter>
        <StarAnimation id="stars" />
        <StarAnimation id="stars2" />
        <StarAnimation id="stars3" />
      </GradientLight>
    </>
  );
};

export default AppLayout;

AppLayout.prototype = {};

const HeaderDiv = styled.div`
  height: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
  padding-left: 30px;
  background-color: transparent;
`;

const RouteContent = styled.div`
  min-height: calc(100vh - 55px);
  overflow-y: scroll;
`;

const HeaderLeftDiv = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderMidDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  ul li {
    display: inline;
  }
`;

const HeaderRightDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StarAnimation = styled.div`
  position: absolute;
  z-index: -100;
  overflow-y: hidden;
`;

const GradientLight = styled.div`
  width: 100%;
  position: absolute;
  z-index: 100;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
`;

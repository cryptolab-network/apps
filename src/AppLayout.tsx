import styled from 'styled-components';
import Button from './components/Button';
import { BrowserRouter, NavLink, Route, Switch, Link } from 'react-router-dom';
import Portal from './pages/Portal';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';
import './css/AppLayout.css';

import Guide from './pages/Guide';
import Benchmark from './pages/Benchmark';
import Management from './pages/Management';

// header
const Header = () => {
  return (
    <HeaderDiv>
      <HeaderLeftDiv>
        <NavLink exact to="/">
          <CryptoLabLogo />
        </NavLink>
      </HeaderLeftDiv>
      <HeaderMidDiv>
        <NavLink exact to="/guide" className="header-item" activeClassName="header-item-active">
          Staking Guide
        </NavLink>
        <NavLink exact to="/benchmark" className="header-item" activeClassName="header-item-active">
          Portfolio Benchmark
        </NavLink>
        <NavLink exact to="/management" className="header-item" activeClassName="header-item-active">
          Portfolio Management
        </NavLink>
      </HeaderMidDiv>
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
        <BrowserRouter>
          <Header />
          <RouteContent>
            <Switch>
              <Route exact path="/" component={Portal} />
              <Route exact path="/guide" component={Guide} />
              <Route exact path="/benchmark" component={Benchmark} />
              <Route exact path="/management" component={Management} />
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
  display: flex;
  min-height: calc(100vh - 93px);
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

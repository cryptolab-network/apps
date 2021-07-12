import styled from 'styled-components';
// import Button from './components/Button';
import NetworkSelect from './components/NetworkSelect';
import WalletSelect from './components/WalletSelect';
import Button from './components/Button';
import NetworkWallet from './components/NetworkWallet';
import { BrowserRouter, NavLink, Route, Switch, useLocation } from 'react-router-dom';
import Portal from './pages/Portal';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';
import './css/AppLayout.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Guide from './pages/Guide';
import Benchmark from './pages/Benchmark';
import Management from './pages/Management';

import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useAppSelector, useAppDispatch } from './hooks';
// import { createApi } from './redux';
import Api from './components/Api';


// header
const Header: React.FC = () => {
  let { pathname } = useLocation();

  const network = useAppSelector(state => state.network.name);
  // const { handler, api } = useAppSelector(state => state.apiHandler);
  // console.log(handler);
  // console.log(api);
  // const dispatch = useAppDispatch();
  // if (handler === null) {
  //   dispatch(createApi(network));
  // }


  return (
    <HeaderDiv>
      <HeaderLeftDiv>
        <NavLink exact to="/">
          <CryptoLabLogo />
        </NavLink>
      </HeaderLeftDiv>
      <HeaderMidDiv>
        <NavLink to="/guide" className="header-item" activeClassName="header-item-active">
          Staking Guide
        </NavLink>
        <NavLink to="/benchmark" className="header-item" activeClassName="header-item-active">
          Portfolio Benchmark
        </NavLink>
        <NavLink to="/management" className="header-item" activeClassName="header-item-active">
          Portfolio Management
        </NavLink>
      </HeaderMidDiv>
      <HeaderRightDiv>
        {pathname !== '/' ? (
          <NetworkWallet />
        ) : (
          <NavLink to="/benchmark">
            <Button title="Use Benchmark" />
          </NavLink>
        )}
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
          <Api>
            <Header />
            <RouteContent>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <Switch>
                <Route exact path="/" component={Portal} />
                <Route path="/guide" component={Guide} />
                <Route path="/benchmark" component={Benchmark} />
                <Route path="/management" component={Management} />
              </Switch>
            </RouteContent>
          </Api>
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

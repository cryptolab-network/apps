import { useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Button from './components/Button';
import NetworkWallet from './components/NetworkWallet';
import NetworkSelect from './components/NetworkSelect';
import { BrowserRouter, NavLink, Route, Switch, useLocation } from 'react-router-dom';
import Portal from './pages/Portal';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';
import { ReactComponent as CryptoLabToolsLogo } from './assets/images/tools-logo.svg';
import './css/AppLayout.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Guide from './pages/Guide';
import Benchmark from './pages/Benchmark';
import Management from './pages/Management';
import { Portal as ToolsPortal } from './pages/Tools/Portal';
import { useAppSelector, useAppDispatch } from './hooks';
import { getNominators } from './redux';
import Api from './components/Api';
import ValNom from './pages/Tools/ValNom';
import { networkChanged } from './redux'
import keys from './config/keys';
import ValidatorStatus from './pages/Tools/Validators';

// header
const Header: React.FC = () => {
  let { pathname } = useLocation();

  const networkName = useAppSelector((state) => state.network.name);

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

// tools header
const ToolsHeader: React.FC = () => {
  const networkName = useAppSelector((state) => state.network.name);
  const allNominators = useAppSelector((state) => state.nominators);
  console.log(allNominators);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getNominators(networkName));
  }, [networkName]);

  const handleNetworkChange = useCallback(
    (networkName: string) => {
      console.log('current select network: ', networkName);
      dispatch(networkChanged(networkName));
    },
    [dispatch]
  );

  return (
    <HeaderDiv>
      <HeaderLeftDiv>
        <NavLink exact to="/">
          <CryptoLabToolsLogo />
        </NavLink>
      </HeaderLeftDiv>
      <HeaderMidDiv>
        <NavLink to="/valnom" className="header-item" activeClassName="header-item-active">
          Validator / Nominator status
        </NavLink>
        <NavLink to="/onekv" className="header-item" activeClassName="header-item-active">
          1KV Monitor
        </NavLink>
        <NavLink to="/rewards" className="header-item" activeClassName="header-item-active">
          Staking Rewards
        </NavLink>
      </HeaderMidDiv>
      <HeaderRightDiv>
        <NetworkSelect onChange={handleNetworkChange} />
      </HeaderRightDiv>
    </HeaderDiv>
  )
}

// main applayout, include star animation and light gradient
const AppLayout = () => {
  const mainRender = useMemo(() => {
    if (window.location.host.split('.')[0] === keys.toolDomain) {
      return (
        <>
          <ToolsHeader />
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
              <Route exact path="/" component={ToolsPortal} />
              <Route path="/valnom" component={ValNom} />
              <Route path="/validator/:id/:chain" component={ValidatorStatus} />
            </Switch>
          </RouteContent>
        </>
      )
    } else {
      return (
        <>
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
        </>
      );
    }
  }, []);
  return (
    <>
      <GradientLight>
        <BrowserRouter>
          <Api>{mainRender}</Api>
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

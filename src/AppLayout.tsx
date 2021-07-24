import { useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Button from './components/Button';
import NetworkWallet from './components/NetworkWallet';
import NetworkSelect from './components/NetworkSelect';
import { BrowserRouter, NavLink, Route, Switch, useLocation } from 'react-router-dom';
import Portal from './pages/Portal';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';
import { ReactComponent as CryptoLabToolsLogo } from './assets/images/tools-logo.svg';
import { ReactComponent as TwitterIcon } from './assets/images/twitter_icon.svg';
import { ReactComponent as GithubIcon } from './assets/images/github_icon.svg';
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
import { networkChanged } from './redux';
import keys from './config/keys';
import ValidatorStatus from './pages/Tools/Validators';
import OneKV from './pages/Tools/OneKV';

// header
const Header: React.FC = () => {
  let { pathname } = useLocation();

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
  }, [networkName, dispatch]);

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
  );
};

const Footer: React.FC = () => {
  return (
    <>
      <TableDiv>
        <ColumnDiv>
          <ThDiv>General</ThDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">About</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">Contact</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">Our Validators</LinkA>
          </TdDiv>
        </ColumnDiv>
        <ColumnDiv>
          <ThDiv>Technology</ThDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="http://localhost:3001">Staking Service</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="http://tools.localhost:3001">Tools for Validators</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">Telegram Bots</LinkA>
          </TdDiv>
        </ColumnDiv>
        <ColumnDiv>
          <ThDiv>Community</ThDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">Blog</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">Medium</LinkA>
          </TdDiv>
        </ColumnDiv>
        <ColumnDiv>
          <TdDiv justify_content="space-around">
            <a href="https://twitter.com/CryptolabN" target="_blank" rel="noreferrer">
              <TwitterIcon width="36px" height="36px" />
            </a>
            <a href="https://github.com/cryptolab-network" target="_blank" rel="noreferrer">
              <GithubIcon width="36px" height="36px" />
            </a>
          </TdDiv>
          <TdDiv align_items="flex-end">Subscribe to hear about CryptoLab updates!</TdDiv>
          <TdDiv justify_content="center">
            <Input placeholder="Enter your email address"></Input>
            <SubmitButton>Subscribe</SubmitButton>
          </TdDiv>
        </ColumnDiv>
      </TableDiv>
      <CopyRightDiv>
        <CopyRightTitleDiv>
          @ 2021. Made with ❤️ &nbsp; by CryptoLab &nbsp;| &nbsp;
          <TextLinkA href="#">Disclaimer</TextLinkA> &nbsp;| &nbsp;
          <TextLinkA href="#">Privacy</TextLinkA>
        </CopyRightTitleDiv>
      </CopyRightDiv>
    </>
  );
};

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
              <Route path="/onekv" component={OneKV} />
            </Switch>
          </RouteContent>
          <Footer />
        </>
      );
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
          <Footer />
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

const TableDiv = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height: 14em;
  margin: 0;
  padding: 20px 15% 20px 15%;
`;

const ColumnDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: left;
  // border: 1px solid green;
`;

const ThDiv = styled.div`
  display: flex;
  height: 3em;
  text-align: center;
  color: white;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  // border: 1px solid red;
`;

const TdDiv = styled.div.attrs((props) => {})`
  display: inline-flex;
  height: 3em;
  justify-content: ${(props) => (props.justify_content ? props.justify_content : 'left')};
  align-items: ${(props) => (props.align_items ? props.align_items : 'center')};
  color: white;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  // border: 1px solid red;
`;

const DotDiv = styled.div`
  width: 4px;
  height: 4px;
  margin: 7px;
  background-color: #23beb9;
`;

const LinkA = styled.a`
  color: white;
  text-decoration: none;
  :hover {
    color: #23beb9;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 70%;
  margin: 0;
  padding: 0 0 0 12px;
  opacity: 1;
  border-radius: 4px 0px 0px 4px;
  border: solid 1px #1faaa6;
  background-color: #141b26;
  color: white;
`;

const SubmitButton = styled.button`
  height: 75%;
  margin: 0;
  border: 0;
  padding: 7px 15px 7.6px 12.6px;
  opacity: 1;
  background-color: #1faaa6;
  border-radius: 0px 4px 4px 0px;
  color: white;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
`;
const CopyRightDiv = styled.div`
  heigth: 64px;
  width: 100%;
  margin: 0px;
  padding: 25px 0px 25px;
  background-color: #0d1119;
  // position: fixed;
  // bottom: 0px;
  // z-index: 99;
`;

const CopyRightTitleDiv = styled.div`
  height: 16px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  color: white;
  text-align: center;
`;
const TextLinkA = styled.a`
  text-decoration: none;
  color: white;
`;

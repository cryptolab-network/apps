import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Button from './components/Button';
import NetworkWallet from './components/NetworkWallet';
import { BrowserRouter, NavLink, Route, Switch, useLocation } from 'react-router-dom';
import Portal from './pages/Portal';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';
import { ReactComponent as CryptoLabToolsLogo } from './assets/images/tools-logo.svg';
import { ReactComponent as TwitterIcon } from './assets/images/twitter_icon.svg';
import { ReactComponent as GithubIcon } from './assets/images/github_icon.svg';
import { ReactComponent as YoutubeIcon } from './assets/images/youtube_icon.svg';
import { ReactComponent as PeopleIcon } from './assets/images/people.svg';
import './css/AppLayout.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import Guide from './pages/Guide';
import Benchmark from './pages/Benchmark';
import Management from './pages/Management';
import { Portal as ToolsPortal } from './pages/Tools/Portal';
import Api from './components/Api';
import ValNom from './pages/Tools/ValNom';
import keys from './config/keys';
import ValidatorStatus from './pages/Tools/Validators';
import { getUrls } from './utils/url';
import OneKV from './pages/Tools/OneKV';
import StakingRewardsReport from './pages/Tools/StakingRewardsReport';
import Data from './pages/Tools/components/Data';
import Network from './pages/Tools/components/Network';
import Contact from './pages/Contact';
// import OurValidators from './pages/OurValidators';
import About from './pages/About';
import { Helmet } from 'react-helmet';
import { apiSubscribeNewsletter } from './apis/Validator';
import Dialog from './components/Dialog';
import { CryptolabKSMValidators, CryptolabDOTValidators } from './utils/constants/Validator';
import Identicon from '@polkadot/react-identicon';
import { IconTheme } from '@polkadot/react-identicon/types';

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
        <Network />
      </HeaderRightDiv>
    </HeaderDiv>
  );
};

interface IFooter {
  handleDialogOpen: React.MouseEventHandler<HTMLDivElement>;
}

interface IValidator {
  name: string;
  address: string;
  theme: IconTheme;
}

const Footer: React.FC<IFooter> = ({ handleDialogOpen }) => {
  const [staking_url, tools_url] = getUrls(window.location, keys.toolDomain);
  const [email, setEmail] = useState<string>('');

  const onSubscribeNewsletter = () => {
    apiSubscribeNewsletter({
      email: email,
    })
      .then((result) => {
        let message = '';
        console.log(result);
        if (result === 0) {
          message = `Thank you for subscribing our newsletter`;
          toast.info(`${message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        } else if (result === -2000) {
          message = `You have already subsribed our newsletter`;
          toast.error(`${message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        } else if (result === -1002) {
          message = `Invalid email format`;
          toast.error(`${message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        }
      })
      .catch((err) => {
        toast.error(`Failed to subscribe our newsletter`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });
      });
  };

  return (
    <>
      <TableDiv>
        <ColumnDiv>
          <ThDiv>General</ThDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href={`${staking_url}/about`}>About</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href={`${staking_url}/contact`}>Contact</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <DialogA onClick={handleDialogOpen}>Our Validators</DialogA>
          </TdDiv>
        </ColumnDiv>
        <ColumnDiv>
          <ThDiv>Technology</ThDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href={staking_url}>Staking Service</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href={tools_url}>Tools for Validators</LinkA>
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
          <TdDiv justify_content="flex-start">
            <a href="https://twitter.com/CryptolabN" rel="noreferrer" target="_blank">
              <SocialMediaWrapper>
                <TwitterIcon width="36px" height="36px" />
              </SocialMediaWrapper>
            </a>
            <a href="https://github.com/cryptolab-network" rel="noreferrer" target="_blank">
              <SocialMediaWrapper>
                <GithubIcon width="36px" height="36px" />
              </SocialMediaWrapper>
            </a>
            <a href="#">
              <SocialMediaWrapper>
                <YoutubeIcon width="36px" height="36px" />
              </SocialMediaWrapper>
            </a>
          </TdDiv>
          <TdDiv align_items="flex-end">Subscribe to receive CryptoLab updates!</TdDiv>
          <TdDiv justify_content="center">
            <Input
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
            <SubmitButton onClick={onSubscribeNewsletter}>Subscribe</SubmitButton>
          </TdDiv>
        </ColumnDiv>
      </TableDiv>
      <CopyRightDiv>
        <CopyRightTitleDiv>
          @ 2021. Made with ❤️ &nbsp; by CryptoLab &nbsp;| &nbsp;
          <a
            href="https://www.iubenda.com/terms-and-conditions/37411829"
            style={{ textDecoration: 'none', color: 'white' }}
            className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe "
            title="Terms and Conditions "
          >
            Terms and Conditions
          </a>{' '}
          &nbsp;| &nbsp;
          <Helmet>
            <script type="text/javascript">{`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}</script>
          </Helmet>
          <a
            href="https://www.iubenda.com/privacy-policy/37411829"
            style={{ textDecoration: 'none', color: 'white' }}
            className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iub-legal-only iubenda-noiframe "
            title="Privacy Policy "
          >
            Privacy Policy
          </a>
          <Helmet>
            <script type="text/javascript">{`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}</script>
          </Helmet>
        </CopyRightTitleDiv>
      </CopyRightDiv>
    </>
  );
};

// main applayout, include star animation and light gradient
const AppLayout = () => {
  const isToolsSite = window.location.host.split('.')[0] === keys.toolDomain;

  const [visibleOurValidatorsDialog, setVisibleOurValidatorsDialog] = useState(false);

  const handleDialogClose = () => {
    setVisibleOurValidatorsDialog(false);
  };

  const handleDialogOpen = () => {
    console.log('modal open');
    setVisibleOurValidatorsDialog(true);
  };

  const ValidatorNode: React.FC<IValidator> = ({ name, address, theme }) => {
    return (
      <Validator>
        <Identicon value={address} size={35} theme={theme} />
        <span style={{ marginLeft: 8 }}>{name}</span>
      </Validator>
    );
  };

  const ourValidatorsDOM = useMemo(() => {
    let polkadotValidator: any = [];
    let kusamaValidator: any = [];

    Object.keys(CryptolabDOTValidators).forEach((item) => {
      polkadotValidator.push(
        <ValidatorNode name={item} address={CryptolabDOTValidators[item]} theme="polkadot" />
      );
    });

    Object.keys(CryptolabKSMValidators).forEach((item) => {
      kusamaValidator.push(
        <ValidatorNode name={item} address={CryptolabKSMValidators[item]} theme="polkadot" />
      );
    });

    return (
      <>
        <ValidatorMainContainer>
          <ValidatorListContainer style={{ borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ marginBottom: 12 }}>Polkadot</div>
            {polkadotValidator}
          </ValidatorListContainer>
          <ValidatorListContainer>
            <div style={{ marginBottom: 12 }}>Kusama</div>
            {kusamaValidator}
          </ValidatorListContainer>
        </ValidatorMainContainer>
        <div
          style={{
            width: '100%',
            display: 'inline-box',
            boxSizing: 'border-box',
            justifyContent: 'flex-start',
            marginTop: 18,
            color: 'white',
            fontSize: 13,
            fontFamily: 'Montserrat',
            fontWeight: 500,
            paddingLeft: 50,
          }}
        >
          Toggle
          <span style={{ color: '#23beb9', fontSize: 13, fontFamily: 'Montserrat', fontWeight: 500 }}>
            {' '}
            Support Us{' '}
          </span>
          on
          <span style={{ color: '#23beb9', fontSize: 13, fontFamily: 'Montserrat', fontWeight: 500 }}>
            {' '}
            Portfolio Benchmark{' '}
          </span>
          to support us.
        </div>
      </>
    );
  }, []);

  const headerDOM = useMemo(() => {
    if (isToolsSite) {
      return <ToolsHeader />;
    }
    return <Header />;
  }, [isToolsSite]);

  const switchtDOM = useMemo(() => {
    if (isToolsSite) {
      return (
        <Switch>
          <Route exact path="/" component={ToolsPortal} />
          <Route path="/valnom" component={ValNom} />
          <Route path="/validator/:id/:chain" component={ValidatorStatus} />
          <Route path="/onekv" component={OneKV} />
          <Route path="/rewards" component={StakingRewardsReport} />
          <Route path="/contact" component={Contact} />
          {/* <Route path="/ourValidators" component={OurValidators} /> */}
          <Route path="/about" component={About} />
        </Switch>
      );
    }
    return (
      <Switch>
        <Route exact path="/" component={Portal} />
        <Route path="/guide" component={Guide} />
        <Route path="/benchmark" component={Benchmark} />
        <Route path="/management" component={Management} />
      </Switch>
    );
  }, [isToolsSite]);

  const mainRender = useMemo(() => {
    return (
      <>
        {headerDOM}
        <RouteContent>
          <Dialog
            image={<PeopleIcon />}
            title={'Our Validators'}
            isOpen={visibleOurValidatorsDialog}
            handleDialogClose={handleDialogClose}
          >
            {ourValidatorsDOM}
          </Dialog>
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
          {switchtDOM}
        </RouteContent>
        <Footer handleDialogOpen={handleDialogOpen} />
      </>
    );
  }, [headerDOM, ourValidatorsDOM, switchtDOM, visibleOurValidatorsDialog]);

  return (
    <>
      <GradientLight>
        <BrowserRouter>
          {isToolsSite ? <Data>{mainRender}</Data> : <Api>{mainRender}</Api>}
          {/* <Api>{mainRender}</Api> */}
        </BrowserRouter>
        {/* <StarAnimation id="stars" />
        <StarAnimation id="stars2" />
        <StarAnimation id="stars3" /> */}
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
  // height: 100%;
  // min-height: calc(100vh - 93px);
  overflow-y: visible;
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

// const StarAnimation = styled.div`
//   position: absolute;
//   z-index: -100;
//   overflow-y: hidden;
// `;

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
  margin: 80px 0 0 0;
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

interface Td {
  justify_content?: string;
  align_items?: string;
}

const TdDiv = styled.div<Td>`
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

const DialogA = styled.span`
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

const SocialMediaWrapper = styled.div`
  margin-right: 15px;
`;

const ValidatorMainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  color: white;
`;

const ValidatorListContainer = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 6px 50px 6px 50px;
`;

const Validator = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 6px 0px 6px 0px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;

  text-align: left;
  color: #23beb9;
`;

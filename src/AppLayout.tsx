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
import { ReactComponent as ContactIcon } from './assets/images/contact-logo.svg';
import { ReactComponent as AboutIcon } from './assets/images/about-us-logo.svg';
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
import { Helmet } from 'react-helmet';
import { apiSubscribeNewsletter } from './apis/Validator';
import Dialog from './components/Dialog';
import { CryptolabKSMValidators, CryptolabDOTValidators } from './utils/constants/Validator';
import Identicon from '@polkadot/react-identicon';
import { IconTheme } from '@polkadot/react-identicon/types';

import { useTranslation } from 'react-i18next';

// header
const Header: React.FC = () => {
  let { pathname } = useLocation();
  const { t } = useTranslation();
  return (
    <HeaderDiv>
      <HeaderLeftDiv>
        <NavLink exact to="/">
          <CryptoLabLogo />
        </NavLink>
      </HeaderLeftDiv>
      <HeaderMidDiv>
        <NavLink to="/guide" className="header-item" activeClassName="header-item-active">
          {t('app.title.stakingGuide')}
        </NavLink>
        <NavLink to="/benchmark" className="header-item" activeClassName="header-item-active">
          {t('app.title.portfolioBenchmark')}
        </NavLink>
        <NavLink to="/management" className="header-item" activeClassName="header-item-active">
          {t('app.title.portfolioManagement')}
        </NavLink>
      </HeaderMidDiv>
      <HeaderRightDiv>
        {pathname !== '/' ? (
          <NetworkWallet />
        ) : (
          <NavLink to="/benchmark">
            <Button title={t('app.title.useBenchmark')} />
          </NavLink>
        )}
      </HeaderRightDiv>
    </HeaderDiv>
  );
};

// tools header
const ToolsHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <HeaderDiv>
      <HeaderLeftDiv>
        <NavLink exact to="/">
          <CryptoLabToolsLogo />
        </NavLink>
      </HeaderLeftDiv>
      <HeaderMidDiv>
        <NavLink to="/valnom" className="header-item" activeClassName="header-item-active">
          {t('tools.title.valnom')}
        </NavLink>
        <NavLink to="/onekv" className="header-item" activeClassName="header-item-active">
          {t('tools.title.oneKvMonitor')}
        </NavLink>
        <NavLink to="/rewards" className="header-item" activeClassName="header-item-active">
          {t('tools.title.stakingRewards')}
        </NavLink>
      </HeaderMidDiv>
      <HeaderRightDiv>
        <Network />
      </HeaderRightDiv>
    </HeaderDiv>
  );
};

interface IFooter {
  handleDialogOpen: Function;
}

interface IValidator {
  name: string;
  address: string;
  theme: IconTheme;
}

const Footer: React.FC<IFooter> = ({ handleDialogOpen }) => {
  const { t } = useTranslation();
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
          message = t('app.newsletter.subscribe.successful');
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
          message = t('app.newsletter.subscribe.duplicated');
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
          message = t('app.newsletter.subscribe.incorrectFormat');
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
        toast.error(t('app.newsletter.subscribe.failed'), {
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
          <ThDiv>{t('app.footer.title.general')}</ThDiv>
          <TdDiv>
            <DotDiv />
            <DialogA
              onClick={() => {
                handleDialogOpen('aboutus');
              }}
            >
              {t('app.footer.title.about')}
            </DialogA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <DialogA
              onClick={() => {
                handleDialogOpen('contactus');
              }}
            >
              {t('app.footer.title.contact')}
            </DialogA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <DialogA
              onClick={() => {
                handleDialogOpen('validators');
              }}
            >
              {t('app.footer.title.ourValidators')}
            </DialogA>
          </TdDiv>
        </ColumnDiv>
        <ColumnDiv>
          <ThDiv>{t('app.footer.title.technology')}</ThDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href={staking_url}>{t('app.footer.title.stakingService')}</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href={tools_url}>{t('app.footer.title.toolsForValidators')}</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">{t('app.footer.title.telegramBots')}</LinkA>
          </TdDiv>
        </ColumnDiv>
        <ColumnDiv>
          <ThDiv>{t('app.footer.title.community')}</ThDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">{t('app.footer.title.blog')}</LinkA>
          </TdDiv>
          <TdDiv>
            <DotDiv />
            <LinkA href="#">{t('app.footer.title.medium')}</LinkA>
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
          <TdDiv align_items="flex-end">{t('app.footer.title.subscribeDescription')}</TdDiv>
          <TdDiv justify_content="center">
            <Input
              placeholder={t('app.footer.title.enterEmail')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
            <SubmitButton onClick={onSubscribeNewsletter}>{t('app.footer.title.subscribe')}</SubmitButton>
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
            T&C
          </a>{' '}
          &nbsp;| &nbsp;
          <Helmet>
            <script type="text/javascript">{`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}</script>
          </Helmet>
          <a
            href="https://www.iubenda.com/privacy-policy/37411829"
            style={{ textDecoration: 'none', color: 'white' }}
            className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iub-legal-only iubenda-noiframe "
            title={t('app.footer.title.privacyPolicy')}
          >
            {t('app.footer.title.privacyPolicy')}
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
  const { t } = useTranslation();
  const isToolsSite = window.location.host.split('.')[0] === keys.toolDomain;

  const [visibleOurValidatorsDialog, setVisibleOurValidatorsDialog] = useState(false);
  const [visibleContactUsDialog, setVisibleContactUsDialog] = useState(false);
  const [visibleAboutUsDialog, setVisibleAboutUsDialog] = useState(false);

  const handleDialogClose = (name) => {
    console.log('close name: ', name);
    switch (name) {
      case 'validators':
        setVisibleOurValidatorsDialog(false);
        break;
      case 'contactus':
        setVisibleContactUsDialog(false);
        break;
      case 'aboutus':
        setVisibleAboutUsDialog(false);
        break;
    }
  };

  const handleDialogOpen = (name) => {
    console.log('open name: ', name);
    switch (name) {
      case 'validators':
        setVisibleOurValidatorsDialog(true);
        break;
      case 'contactus':
        setVisibleContactUsDialog(true);
        break;
      case 'aboutus':
        setVisibleAboutUsDialog(true);
        break;
    }
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
        <DialogMainContainer>
          <DialogListContainer style={{ borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ marginBottom: 12 }}>Polkadot</div>
            {polkadotValidator}
          </DialogListContainer>
          <DialogListContainer>
            <div style={{ marginBottom: 12 }}>Kusama</div>
            {kusamaValidator}
          </DialogListContainer>
        </DialogMainContainer>
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

  const contactUsDOM = useMemo(() => {
    return (
      <>
        <DialogMainContainer>
          <DialogListContainer style={{ borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ marginBottom: 12 }}>Riot</div>
            <ul style={{ paddingLeft: 20 }}>
              <LiStyle>tanis_37:matrix.org</LiStyle>
              <LiStyle>yaohsin:matrix.org</LiStyle>
            </ul>
          </DialogListContainer>
          <DialogListContainer>
            <div style={{ marginBottom: 12 }}>Github</div>
            <ul style={{ paddingLeft: 20 }}>
              <LiStyle>Https://github.com/crytolab-network</LiStyle>
            </ul>
          </DialogListContainer>
        </DialogMainContainer>
      </>
    );
  }, []);

  const aboutUsDOM = useMemo(() => {
    return (
      <div
        style={{
          display: 'flex',
          boxSizing: 'border-box',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <AboutUsFontStyle>{t('about.subDescription')}</AboutUsFontStyle>
        <div style={{ marginTop: 34, textAlign: 'left' }}>
          <AboutUsFontStyle>{t('about.mission')}</AboutUsFontStyle>
          <ul style={{ paddingLeft: 20 }}>
            <AboutUsGoalFontStyle>
              {t('about.mission1')}
            </AboutUsGoalFontStyle>
            <AboutUsGoalFontStyle>
              {t('about.mission2')}
            </AboutUsGoalFontStyle>
            <AboutUsGoalFontStyle>
              {t('about.mission3')}
            </AboutUsGoalFontStyle>
          </ul>
        </div>
      </div>
    );
  }, [t]);

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
          {/* <Route path="/contact" component={Contact} /> */}
          {/* <Route path="/ourValidators" component={OurValidators} /> */}
          {/* <Route path="/about" component={About} /> */}
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
            title={t('app.footer.title.ourValidators')}
            isOpen={visibleOurValidatorsDialog}
            handleDialogClose={() => {
              handleDialogClose('validators');
            }}
          >
            {ourValidatorsDOM}
          </Dialog>
          <Dialog
            image={<ContactIcon />}
            title={t('app.footer.title.contact')}
            isOpen={visibleContactUsDialog}
            handleDialogClose={() => {
              handleDialogClose('contactus');
            }}
          >
            {contactUsDOM}
          </Dialog>
          <Dialog
            image={<AboutIcon />}
            title={t('app.footer.title.about')}
            isOpen={visibleAboutUsDialog}
            handleDialogClose={() => {
              handleDialogClose('aboutus');
            }}
          >
            {aboutUsDOM}
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
        <Footer
          handleDialogOpen={(name) => {
            handleDialogOpen(name);
          }}
        />
      </>
    );
  }, [
    aboutUsDOM,
    contactUsDOM,
    headerDOM,
    ourValidatorsDOM,
    switchtDOM,
    t,
    visibleAboutUsDialog,
    visibleContactUsDialog,
    visibleOurValidatorsDialog,
  ]);

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
  min-height: calc(100vh - 344px - 64px - 96px);
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
  height: 224px;
  margin: auto;
  margin-top: 80px;
  padding: 20px 15% 20px 15%;
  width: auto;
  @media (min-width: 1000px) {
    width: 70%;
  }
  @media (max-width: 1000px) {
    width: 90%;
    padding: 0px;
  }
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

const DialogMainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  color: white;
`;

const DialogListContainer = styled.span`
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

const LiStyle = styled.li`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: #23beb9;
  margin-top: 3px;
  margin-bottom: 3px;
`;

const AboutUsFontStyle = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
`;

const AboutUsGoalFontStyle = styled.li`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: #1faaa6;
  margin-top: 6px;
  margin-bottom: 6px;
`;

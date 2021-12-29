import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Button from './components/Button';
import NetworkWallet from './components/NetworkWallet';
import { BrowserRouter, NavLink, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import Portal from './pages/Portal';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';
import { ReactComponent as CryptoLabToolsLogo } from './assets/images/tools-logo.svg';
import { ReactComponent as CryptoLabToolsLogoShrink } from './assets/images/tools-logo-shrink.svg';
import { ReactComponent as CryptoLabLogoShrink } from './assets/images/main-color-logo-shrink.svg';
import { ReactComponent as TwitterIcon } from './assets/images/twitter_icon.svg';
import { ReactComponent as GithubIcon } from './assets/images/github_icon.svg';
// import { ReactComponent as YoutubeIcon } from './assets/images/youtube_icon.svg';
import { ReactComponent as PeopleIcon } from './assets/images/people.svg';
import { ReactComponent as ContactIcon } from './assets/images/contact-logo.svg';
import { ReactComponent as AboutIcon } from './assets/images/about-us-logo.svg';
import { ReactComponent as DropDownIcon } from './assets/images/dropdown.svg';
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
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { apiSubscribeNewsletter } from './apis/Validator';
import Dialog from './components/Dialog';
import {
  CryptolabKSMValidators,
  CryptolabDOTValidators,
  CryptolabKSMValidatorsName,
  CryptolabDOTValidatorsName,
} from './utils/constants/Validator';
import Identicon from '@polkadot/react-identicon';
import { IconTheme } from '@polkadot/react-identicon/types';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';
import DropdownCommon from './components/Dropdown/Common';
import { initGA } from './utils/ga';
import useWindowDimensions from './hooks/useWindowDimensions';
import { breakWidth } from './utils/constants/layout';
import SideMenu from './components/SideMenu';
import Wallet from './pages/Tools/components/Wallet';
import MenuIcon from './components/MenuIcon';
import Mobile from './pages/Mobile';

import * as SC from './styles';

// header
const Header: React.FC = () => {
  let { pathname } = useLocation();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <SC.HeaderDiv>
      <SC.HeaderLeftDiv>
        <NavLink exact to="/">
          {width > breakWidth.mobile && width <= breakWidth.pad ? <CryptoLabLogoShrink /> : <CryptoLabLogo />}
        </NavLink>
      </SC.HeaderLeftDiv>
      <SC.HeaderMidDiv>
        {/*
          // TODO: the comment code below would be used in RWD feature
         {width > breakWidth.mobile ? (
          <>
            <NavLink to="/guide" className="header-item" activeClassName="header-item-active">
              {t('app.title.stakingGuide')}
            </NavLink>
            <NavLink to="/benchmark" className="header-item" activeClassName="header-item-active">
              {t('app.title.portfolioBenchmark')}
            </NavLink>
            <NavLink to="/management" className="header-item" activeClassName="header-item-active">
              {t('app.title.portfolioManagement')}
            </NavLink>
          </>
        ) : null} */}
        <NavLink to="/guide" className="header-item" activeClassName="header-item-active">
          {t('app.title.stakingGuide')}
        </NavLink>
        <NavLink to="/benchmark" className="header-item" activeClassName="header-item-active">
          {t('app.title.portfolioBenchmark')}
        </NavLink>
        <NavLink to="/management" className="header-item" activeClassName="header-item-active">
          {t('app.title.portfolioManagement')}
        </NavLink>
      </SC.HeaderMidDiv>
      <SC.HeaderRightDiv>
        {/* {width <= breakWidth.mobile ? (
          <SideMenuIcon />
        ) : pathname !== '/' ? (
          <NetworkWallet />
        ) : (
          <NavLink to="/benchmark">
            <Button title={t('app.title.useBenchmark')} />
          </NavLink>
        )} */}
        {pathname !== '/' ? (
          <NetworkWallet />
        ) : (
          <NavLink to="/benchmark">
            <Button title={t('app.title.useBenchmark')} />
          </NavLink>
        )}
      </SC.HeaderRightDiv>
    </SC.HeaderDiv>
  );
};

// tools header

interface IToolsHeader {
  handleSideMenuToggle: React.MouseEventHandler<SVGSVGElement>;
}
const ToolsHeader: React.FC<IToolsHeader> = ({ handleSideMenuToggle }) => {
  let { pathname } = useLocation();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const history = useHistory();

  const toolsHeaderLeftDOM = useMemo(() => {
    if (width <= breakWidth.mobile && pathname !== '/') {
      return (
        <div
          onClick={() => {
            history.goBack();
          }}
        >
          <DropDownIcon style={{ stroke: 'white', width: 10, height: 20, transform: 'rotate(180deg)' }} />
        </div>
      );
    } else {
      return (
        <NavLink exact to="/">
          {width > breakWidth.mobile && width <= breakWidth.pad ? (
            <CryptoLabLogoShrink />
          ) : width <= breakWidth.mobile ? (
            <CryptoLabToolsLogoShrink />
          ) : (
            <CryptoLabToolsLogo />
          )}
        </NavLink>
      );
    }
  }, [history, pathname, width]);

  const toolsHeaderMidDOM = useMemo(() => {
    if (width > breakWidth.mobile) {
      return (
        <>
          <NavLink to="/valnom" className="header-item" activeClassName="header-item-active">
            {t('tools.title.valnom')}
          </NavLink>
          <NavLink to="/onekv" className="header-item" activeClassName="header-item-active">
            {t('tools.title.oneKvMonitor')}
          </NavLink>
          <NavLink to="/rewards" className="header-item" activeClassName="header-item-active">
            {t('tools.title.stakingRewards')}
          </NavLink>
        </>
      );
    } else {
      if (pathname.includes('/valnom') || pathname.includes('/validator')) {
        return <SC.MobileHeaderTitle>{t('tools.title.valnom')}</SC.MobileHeaderTitle>;
      } else if (pathname.includes('/onekv')) {
        return <SC.MobileHeaderTitle>{t('tools.title.oneKvMonitor')}</SC.MobileHeaderTitle>;
      } else if (pathname.includes('/rewards')) {
        return <SC.MobileHeaderTitle>{t('tools.title.stakingRewards')}</SC.MobileHeaderTitle>;
      }
    }
  }, [pathname, t, width]);

  return (
    <SC.HeaderDiv>
      <SC.HeaderLeftDiv>
        <NavLink exact to="/">
          {toolsHeaderLeftDOM}
        </NavLink>
      </SC.HeaderLeftDiv>
      <SC.HeaderMidDiv>{toolsHeaderMidDOM}</SC.HeaderMidDiv>
      <SC.HeaderRightDiv>
        {width <= breakWidth.mobile ? (
          <MenuIcon onClick={handleSideMenuToggle} />
        ) : (
          <>
            <Network />
            {!isMobile ? <Wallet /> : null}
          </>
        )}
      </SC.HeaderRightDiv>
    </SC.HeaderDiv>
  );
};

interface IFooter {
  handleDialogOpen: Function;
}

interface IValidator {
  name: string;
  address: string;
  theme: IconTheme;
  key: string;
}

interface ILanguage {
  label: string;
  value: string;
  isDisabled?: boolean;
}

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: '简体中文', value: 'zh-CN' },
  // { label: 'Deutsch', value: 'de' },
];

const Footer: React.FC<IFooter> = ({ handleDialogOpen }) => {
  const { t, i18n } = useTranslation();
  const [staking_url, tools_url] = getUrls(window.location, keys.toolDomain);
  const [email, setEmail] = useState<string>('');
  const defaultLng = localStorage.getItem('i18nextLng');
  const lng = languageOptions.find((l) => l.value === defaultLng);
  const [language, setLanguage] = useState<ILanguage>(lng ? lng : { label: 'English', value: 'en' });
  const { width } = useWindowDimensions();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const handleLanguageChange = (e: ILanguage) => {
    changeLanguage(e.value);
    setLanguage(e);
  };

  const onSubscribeNewsletter = () => {
    apiSubscribeNewsletter({
      email: email,
    })
      .then((result) => {
        let message = '';
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
  if (width <= breakWidth.mobile) {
    return (
      <>
        <div style={{ height: 88 }} />
        <SC.PromoteDiv>
          <SC.PromoteContainer>
            <SC.ColumnDiv>
              <SC.TdDiv justify_content="flex-start">
                <a href="https://twitter.com/CryptolabN" rel="noreferrer" target="_blank">
                  <SC.SocialMediaWrapper>
                    <TwitterIcon width="36px" height="36px" />
                  </SC.SocialMediaWrapper>
                </a>
                <a href="https://github.com/cryptolab-network" rel="noreferrer" target="_blank">
                  <SC.SocialMediaWrapper>
                    <GithubIcon width="36px" height="36px" />
                  </SC.SocialMediaWrapper>
                </a>
              </SC.TdDiv>
              <SC.TdDiv align_items="flex-end">{t('app.footer.title.subscribeDescription')}</SC.TdDiv>
              <SC.TdDiv justify_content="center">
                <SC.Input
                  placeholder={t('app.footer.title.enterEmail')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></SC.Input>
                <SC.SubmitButton onClick={onSubscribeNewsletter}>
                  {t('app.footer.title.subscribe')}
                </SC.SubmitButton>
              </SC.TdDiv>
            </SC.ColumnDiv>
          </SC.PromoteContainer>
        </SC.PromoteDiv>
        <div style={{ height: 40 }} />

        <SC.CopyRightMobilleDiv>
          <SC.CopyRightTitleDiv>
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
          </SC.CopyRightTitleDiv>
        </SC.CopyRightMobilleDiv>
      </>
    );
  } else {
    return (
      <>
        <SC.TableDiv>
          <SC.ColumnDiv>
            <SC.ThDiv>{t('app.footer.title.general')}</SC.ThDiv>
            <SC.TdDiv>
              <SC.DotDiv />
              <SC.DialogA
                onClick={() => {
                  handleDialogOpen('aboutus');
                }}
              >
                {t('app.footer.title.about')}
              </SC.DialogA>
            </SC.TdDiv>
            <SC.TdDiv>
              <SC.DotDiv />
              <SC.DialogA
                onClick={() => {
                  handleDialogOpen('contactus');
                }}
              >
                {t('app.footer.title.contact')}
              </SC.DialogA>
            </SC.TdDiv>
            <SC.TdDiv>
              <SC.DotDiv />
              <SC.DialogA
                onClick={() => {
                  handleDialogOpen('validators');
                }}
              >
                {t('app.footer.title.ourValidators')}
              </SC.DialogA>
            </SC.TdDiv>
          </SC.ColumnDiv>
          <SC.ColumnDiv>
            <SC.ThDiv>{t('app.footer.title.technology')}</SC.ThDiv>
            <SC.TdDiv>
              <SC.DotDiv />
              <SC.LinkA href={staking_url}>{t('app.footer.title.stakingService')}</SC.LinkA>
            </SC.TdDiv>
            <SC.TdDiv>
              <SC.DotDiv />
              <SC.LinkA href={tools_url}>{t('app.footer.title.toolsForValidators')}</SC.LinkA>
            </SC.TdDiv>
            {/* <TdDiv>
              <DotDiv />
              <LinkA href="#">{t('app.footer.title.telegramBots')}</LinkA>
            </TdDiv> */}
          </SC.ColumnDiv>
          {/* <ColumnDiv>
            <ThDiv>{t('app.footer.title.community')}</ThDiv>
            <TdDiv>
              <DotDiv />
              <LinkA href="#">{t('app.footer.title.blog')}</LinkA>
            </TdDiv>
            <TdDiv>
              <DotDiv />
              <LinkA href="#">{t('app.footer.title.medium')}</LinkA>
            </TdDiv>
          </ColumnDiv> */}
          <SC.ColumnDiv style={{ minWidth: '85px' }}>
            <SC.ThDiv>{t('app.footer.title.language')}</SC.ThDiv>
            <SC.TdDiv>
              <DropdownCommon
                style={{ flex: 1, width: '100%' }}
                options={languageOptions}
                value={language}
                onChange={handleLanguageChange}
                theme="dark"
              />
            </SC.TdDiv>
          </SC.ColumnDiv>
          <SC.ColumnDiv>
            <SC.TdDiv justify_content="flex-start">
              <a href="https://twitter.com/CryptolabN" rel="noreferrer" target="_blank">
                <SC.SocialMediaWrapper>
                  <TwitterIcon width="36px" height="36px" />
                </SC.SocialMediaWrapper>
              </a>
              <a href="https://github.com/cryptolab-network" rel="noreferrer" target="_blank">
                <SC.SocialMediaWrapper>
                  <GithubIcon width="36px" height="36px" />
                </SC.SocialMediaWrapper>
              </a>
              {/* <a href="#">
                <SocialMediaWrapper>
                  <YoutubeIcon width="36px" height="36px" />
                </SocialMediaWrapper>
              </a> */}
            </SC.TdDiv>
            <SC.TdDiv align_items="flex-end">{t('app.footer.title.subscribeDescription')}</SC.TdDiv>
            <SC.TdDiv justify_content="center">
              <SC.Input
                placeholder={t('app.footer.title.enterEmail')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              ></SC.Input>
              <SC.SubmitButton onClick={onSubscribeNewsletter}>
                {t('app.footer.title.subscribe')}
              </SC.SubmitButton>
            </SC.TdDiv>
          </SC.ColumnDiv>
        </SC.TableDiv>
        <SC.CopyRightDiv>
          <SC.CopyRightTitleDiv>
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
          </SC.CopyRightTitleDiv>
        </SC.CopyRightDiv>
      </>
    );
  }
};

// main applayout, include star animation and light gradient
const AppLayout = () => {
  initGA();
  const { t } = useTranslation();
  const isToolsSite = window.location.host.split('.')[0] === keys.toolDomain;

  const [visibleOurValidatorsDialog, setVisibleOurValidatorsDialog] = useState(false);
  const [visibleContactUsDialog, setVisibleContactUsDialog] = useState(false);
  const [visibleAboutUsDialog, setVisibleAboutUsDialog] = useState(false);
  const [visibleSideMenu, setVisibleSideMenu] = useState(false);

  const handleDialogClose = (name) => {
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
      <SC.Validator>
        <Identicon value={address} size={35} theme={theme} />
        <span style={{ marginLeft: 8 }}>{name}</span>
      </SC.Validator>
    );
  };

  const handleSideMenuToggle = () => {
    setVisibleSideMenu((prev) => !prev);
  };

  const ourValidatorsDOM = useMemo(() => {
    let polkadotValidator: any = [];
    let kusamaValidator: any = [];

    Object.keys(CryptolabDOTValidators).forEach((item) => {
      polkadotValidator.push(
        <ValidatorNode
          name={CryptolabDOTValidatorsName[item]}
          address={CryptolabDOTValidators[item]}
          theme="polkadot"
          key={CryptolabDOTValidators[item]}
        />
      );
    });

    Object.keys(CryptolabKSMValidators).forEach((item) => {
      kusamaValidator.push(
        <ValidatorNode
          name={CryptolabKSMValidatorsName[item]}
          address={CryptolabKSMValidators[item]}
          theme="polkadot"
          key={CryptolabKSMValidators[item]}
        />
      );
    });

    return (
      <>
        <SC.DialogMainContainer>
          <SC.DialogListContainer gap={true}>
            <div style={{ marginBottom: 12 }}>Polkadot</div>
            {polkadotValidator}
          </SC.DialogListContainer>
          <SC.DialogListContainer>
            <div style={{ marginBottom: 12 }}>Kusama</div>
            {kusamaValidator}
          </SC.DialogListContainer>
        </SC.DialogMainContainer>
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
        <SC.DialogMainContainer>
          <SC.DialogListContainer gap={true}>
            <div style={{ marginBottom: 12 }}>Riot</div>
            <ul style={{ paddingLeft: 20 }}>
              <SC.LiStyle>tanis_37:matrix.org</SC.LiStyle>
              <SC.LiStyle>yaohsin:matrix.org</SC.LiStyle>
            </ul>
          </SC.DialogListContainer>
          <SC.DialogListContainer>
            <div style={{ marginBottom: 12 }}>Github</div>
            <ul style={{ paddingLeft: 20 }}>
              <SC.LiStyle>
                <a
                  style={{ color: 'inherit', textDecoration: 'inherit' }}
                  href="https://github.com/cryptolab-network"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://github.com/cryptolab-network
                </a>
              </SC.LiStyle>
            </ul>
          </SC.DialogListContainer>
        </SC.DialogMainContainer>
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
          width: 'calc(100% - 32px)',
        }}
      >
        <SC.AboutUsFontStyle>{t('about.description')}</SC.AboutUsFontStyle>
        <div style={{ marginTop: 34, textAlign: 'left' }}>
          <SC.AboutUsFontStyle>{t('about.mission')}</SC.AboutUsFontStyle>
          <ul style={{ paddingLeft: 20 }}>
            <SC.AboutUsGoalFontStyle>{t('about.mission1')}</SC.AboutUsGoalFontStyle>
            <SC.AboutUsGoalFontStyle>{t('about.mission2')}</SC.AboutUsGoalFontStyle>
          </ul>
        </div>
      </div>
    );
  }, [t]);

  const headerDOM = useMemo(() => {
    if (isToolsSite) {
      return <ToolsHeader handleSideMenuToggle={handleSideMenuToggle} />;
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
        </Switch>
      );
    }
    return (
      <Switch>
        <Route exact path="/" component={Portal} />
        <Route path="/guide" component={Guide} />
        <Route path="/benchmark" component={Benchmark} />
        <Route path="/management" component={Management} />
        <Route
          path="/tools/*"
          component={() => {
            if (window.location.pathname.indexOf('validatorStatus')) {
              // redirect to new site
              const stash = window.location.search.match(/=(.*)&/);
              const network = window.location.search.match(/coin=(.*)/);
              if (stash !== null && network !== null) {
                window.location.href = `https://tools.cryptolab.network/validator/${stash[1]}/${network[1]}`;
                return null;
              }
            }
            window.location.href = 'https://tools.cryptolab.network';
            return null;
          }}
        />
      </Switch>
    );
  }, [isToolsSite]);

  const mainRender = useMemo(() => {
    return (
      <>
        {headerDOM}
        <SC.RouteContent>
          <SideMenu
            isOpen={visibleSideMenu}
            handleClose={handleSideMenuToggle}
            handleDialogOpen={(name) => {
              handleDialogOpen(name);
            }}
            handleSideMenuToggle={handleSideMenuToggle}
          />
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
        </SC.RouteContent>
        <HelmetProvider>
          <Footer
            handleDialogOpen={(name) => {
              handleDialogOpen(name);
            }}
          />
        </HelmetProvider>
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
    visibleSideMenu,
  ]);

  if (isMobile && !isToolsSite) {
    return (
      <>
        <Mobile isTools={false} />
      </>
    );
  } else {
    return (
      <>
        <SC.GradientLight>
          <BrowserRouter>
            {isToolsSite ? (
              <Api>
                <Data>{mainRender}</Data>
              </Api>
            ) : (
              <Api>{mainRender}</Api>
            )}
          </BrowserRouter>
          {process.env.REACT_APP_NODE_ENV === 'production' ? (
            <>
              <SC.StarAnimation id="stars" />
              <SC.StarAnimation id="stars2" />
              <SC.StarAnimation id="stars3" />
            </>
          ) : null}
        </SC.GradientLight>
      </>
    );
  }
};

export default AppLayout;

AppLayout.prototype = {};

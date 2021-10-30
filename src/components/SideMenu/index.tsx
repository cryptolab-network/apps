import { useCallback, useMemo, useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import './index.css';

interface ISideMenu {
  isOpen: boolean;
  handleClose: Function;
}

enum Toggle {
  GENERAL = 'general',
  TECH = 'tech',
  LANGUAGE = 'language',
}

const MenuL1 = ({ title, action }) => {
  return <MenuL1Layout onClick={action}>{title}</MenuL1Layout>;
};

const MenuL1Layout = styled.div`
  padding: 24px 18px;
  height: 19px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  color: white;
  border-bottom: solid 1px #141b22;
  background-color: #1c2532;
  cursor: pointer;
`;

const MenuL2 = ({ title, action }) => {
  return <MenuL2Layout onClick={action}>{title}</MenuL2Layout>;
};

const MenuL2Layout = styled.div`
  padding: 24px 18px;
  height: 19px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  padding-left: 38px;
  text-align: left;
  color: white;
  background-color: #121823;
  cursor: pointer;
`;

const SideMenu: React.FC<ISideMenu> = ({ isOpen, handleClose, children }) => {
  const { t, i18n } = useTranslation();
  const [menuToggle, setMenuToggle] = useState({
    general: false,
    tech: false,
    language: false,
  });
  const customStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.74)',
      zIndex: 1100,
    },
    content: {
      top: '0',
      left: '50%',
      right: '0',
      bottom: '0',
      padding: '0',
      // marginRight: '-50%',
      // transform: 'translate(-50%, -50%)',
      minWidth: '190',
      // minHeight: 'calc(100vh - 493)>0' ? '493px' : '70vh',
      maxWidth: '90vw',
      maxHeight: '100vh',
      OverflowY: 'scroll',
      border: 'solid 0px #23beb9',
      borderLeft: 'solid 1px #23beb9',
      borderRadius: 0,
      backgroundColor: '#17212c',
    },
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const clickToggle = useCallback((name) => {
    console.log('name: ', name);
    // switch (name) {
    //   case Toggle.GENERAL:
    //     setMenuToggle((prev) => ({ ...prev, [Toggle.GENERAL]: !prev[Toggle.GENERAL] }));
    //     break;
    //   case Toggle.TECH:
    //     setMenuToggle((prev) => ({ ...prev, [Toggle.TECH]: !prev[Toggle.TECH] }));
    //     break;
    //   case Toggle.LANGUAGE:
    //     setMenuToggle((prev) => ({ ...prev, [Toggle.LANGUAGE]: !prev[Toggle.LANGUAGE] }));

    //     break;
    // }
    setMenuToggle((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  // mock data
  // https://codepen.io/sedlukha/pen/WPeemb
  const menuList = useMemo(() => {
    return [
      {
        title: 'Validator / Nominator status',
        action: () => {},
        menuList: [],
      },
      {
        title: '1KV Monitor',
        action: () => {},
        menuList: [],
      },
      {
        title: 'Staking Rewards',
        action: () => {},
        menuList: [],
      },
      {
        title: t('app.footer.title.general'),
        action: () => {
          clickToggle(Toggle.GENERAL);
          // setGeneralOpen((prev) => !prev);
        },
        extendLabel: Toggle.GENERAL,
        menuList: [
          {
            title: t('app.footer.title.about'),
            action: () => {},
            menuList: [],
          },
          {
            title: t('app.footer.title.contact'),
            action: () => {},
            menuList: [],
          },
          {
            title: t('app.footer.title.ourValidators'),
            action: () => {},
            menuList: [],
          },
        ],
      },
      {
        title: t('app.footer.title.technology'),
        action: () => {
          clickToggle(Toggle.TECH);
        },
        extendLabel: Toggle.TECH,
        menuList: [
          {
            title: t('app.footer.title.stakingService'),
            action: () => {},
            menuList: [],
          },
          {
            title: t('app.footer.title.toolsForValidators'),
            action: () => {},
            menuList: [],
          },
        ],
      },
      {
        title: t('app.footer.title.language'),
        action: () => {
          clickToggle(Toggle.LANGUAGE);
        },
        extendLabel: Toggle.LANGUAGE,
        menuList: [
          {
            title: 'English',
            action: () => {},
            menuList: [],
          },
          {
            title: '繁體中文',
            action: () => {},
            menuList: [],
          },
          {
            title: '简体中文',
            action: () => {},
            menuList: [],
          },
        ],
      },
    ];
  }, [clickToggle, t]);

  const menuDOM = useMemo(() => {
    return (
      <UnorderListL1>
        {menuList.map((ulL1) => {
          return ulL1.menuList.length === 0 ? (
            <ListL1>
              <MenuL1 title={ulL1.title} action={ulL1.action} />
            </ListL1>
          ) : (
            <ListL1 className={`accordion-item, ${menuToggle[ulL1.extendLabel!] && 'accordion-item-open'}`}>
              <MenuL1 title={ulL1.title} action={ulL1.action} />
              <UnorderListL2 className="accordion-ull2">
                {ulL1.menuList.map((ulL2) => {
                  return (
                    <ListL2>
                      <MenuL2 title={ulL2.title} action={ulL2.action} />
                    </ListL2>
                  );
                })}
              </UnorderListL2>
            </ListL1>
          );
        })}
      </UnorderListL1>
    );
  }, [menuList, menuToggle]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel=""
      ariaHideApp={false}
    >
      <SideMenuLayout>{menuDOM}</SideMenuLayout>
    </Modal>
  );
};

export default SideMenu;

const SideMenuLayout = styled.div``;

const UnorderListL1 = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const ListL1 = styled.li``;

const UnorderListL2 = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const ListL2 = styled.li``;

import { useMemo } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import './index.css';

const SwitchTab = ({ tabs }) => {
  let { path } = useRouteMatch();
  const tabDOM = useMemo(() => {
    return tabs.map((tab, idx) => {
      return (
        <NavLink
          exact
          key={`tab-${idx}`}
          to={tab.value ? `${path}/${tab.value}` : `${path}`}
          className="navlink"
          activeClassName="navlink-active"
        >
          <TabItem totalCount={tabs.length}>{tab.label}</TabItem>
        </NavLink>
      );
    });
  }, [path, tabs]);

  return <TabLayout>{tabDOM}</TabLayout>;
};

export default SwitchTab;

interface ITabItem {
  totalCount: number;
}

const TabLayout = styled.div`
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #42464c;
  border-radius: 100px;
  // padding: 0 74px 0 0;
  height: 41px;
  margin-top: 32px;
`;
const TabItem = styled.div<ITabItem>`
  width: 100%;
  // background-color: #23beb9;
  height: 100%;
  // border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;

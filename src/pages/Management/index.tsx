import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
// import UnderConstruction from '../../components/UnderConstruction';
import { useLocation } from 'react-router';
import { sendPageView } from '../../utils/ga';
import SwitchTab from '../../components/SwitchTab';
import Performance from './components/Performance';

const Management = () => {
  let { path } = useRouteMatch();

  const tabs = [
    {
      label: 'Performance',
      value: '',
    },
    {
      label: 'Events',
      value: 'charts',
    },
  ];

  sendPageView(useLocation());
  return (
    <ManagementLayout>
      <MainLayout>
        <SwitchTab tabs={tabs} />
        <div style={{ width: '100%' }}>
          <Switch>
            <Route exact path={`${path}`} component={Performance} />
          </Switch>
        </div>
      </MainLayout>
    </ManagementLayout>
  );
};

export default Management;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: auto;
`;

const ManagementLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

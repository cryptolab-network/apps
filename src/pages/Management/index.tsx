import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
// import UnderConstruction from '../../components/UnderConstruction';
import { useLocation } from 'react-router';
import { sendPageView } from '../../utils/ga';
import SwitchTab from '../../components/SwitchTab';
import Performance from './components/Performance';
import Notification from './components/Notification';
import { useTranslation } from 'react-i18next';
import MManagementPageCache from '../../components/MemCache/ManagementPage';

const Management = () => {
  const { t } = useTranslation();
  let { path } = useRouteMatch();

  const tabs = [
    {
      label: t('Management.routes.performance.title'),
      value: '',
    },
    {
      label: t('Management.routes.notification.title'),
      value: 'notification',
    },
  ];

  sendPageView(useLocation());
  return (
    <MManagementPageCache>
      <ManagementLayout>
        <MainLayout>
          <SwitchTab tabs={tabs} />
          <div style={{ width: '100%' }}>
            <Switch>
              <Route exact path={`${path}`} component={Performance} />
              <Route exact path={`${path}/notification`} component={Notification} />
            </Switch>
          </div>
        </MainLayout>
      </ManagementLayout>
    </MManagementPageCache>
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

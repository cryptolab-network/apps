import styled from 'styled-components';
import SwitchTab from '../../components/SwitchTab';
import Staking from './components/Staking';
import Charts from './components/Charts';
import { Switch, Route, useRouteMatch, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { sendPageView } from '../../utils/ga';

const Benchmark = () => {
  sendPageView(useLocation());
  const { t } = useTranslation();
  let { path } = useRouteMatch();

  const tabs = useMemo(() => {
    return [
      {
        label: t('benchmark.routes.benchmark'),
        value: '',
      },
      {
        label: t('benchmark.routes.charts'),
        value: 'charts',
      },
    ];
  }, [t]);

  return (
    <BenchmarkLayout>
      <MainLayout>
        <SwitchTab tabs={tabs} />
        <div style={{ width: '100%', maxWidth: '100vw' }}>
          <Switch>
            <Route exact path={`${path}`} component={Staking} />
            <Route exact path={`${path}/charts`} component={Charts} />
          </Switch>
        </div>
      </MainLayout>
    </BenchmarkLayout>
  );
};

export default Benchmark;

const BenchmarkLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

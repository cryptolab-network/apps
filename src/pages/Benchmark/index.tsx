import styled from 'styled-components';
import SwitchTab from '../../components/SwitchTab';
import Staking from './components/Staking';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

const Benchmark = () => {
  let { path } = useRouteMatch();

  const tabs = [
    {
      label: 'Benchmark',
      value: '',
    },
    {
      label: 'Charts',
      value: 'charts',
    },
  ];

  console.log('path: ', path);
  return (
    <BenchmarkLayout>
      <MainLayout>
        <SwitchTab tabs={tabs} />
        <div style={{ width: '100%', height: 250 }}>
          <Switch>
            <Route exact path={`${path}`} component={Staking} />
            <Route exact path={`${path}/charts`} component={() => <div>charts</div>} />
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
  width: 570px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  // background-color: white;
`;

import styled from 'styled-components';
import CardContent from '../../../components/CardContent';
import GrantCardContent from '../components/GrantCardContent';
import { ReactComponent as MedalIcon } from '../../../assets/images/medal.svg';
import { ReactComponent as PeopleIcon } from '../../../assets/images/people.svg';
import { ReactComponent as MonitorIcon } from '../../../assets/images/monitor.svg';
import { useHistory } from 'react-router-dom';

export const Portal = () => {
  const history = useHistory();
  return (
    <PortalLayout>
      <CardsLayout>
        <CardContent
          Icon={PeopleIcon}
          title={'Validator / Nominator Status'}
          detail="Useful criterias for both validators and nominators to monitor and evaluate your staking information."
          className="card-layout"
          onClick={() => {
            history.push("/valnom");
          }}
        />
        <CardContent
          Icon={MonitorIcon}
          title={'One Thousand Validator Monitor'}
          detail="Information that allow 1kv node operators to predict when they will be nominated."
          className="card-layout"
          onClick = {() => {
            history.push("/onekv");
          }}
        />
        <CardContent
          Icon={MedalIcon}
          title={'Staking Rewards'}
          detail="Exportable reports of your staking rewards."
          className="card-layout"
          onClick = {() => {
            history.push("/rewards");
          }}
        />
      </CardsLayout>
      <GrantCardContent className="card-layout" />
    </PortalLayout>
  );
};

const PortalLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CardsLayout = styled.div`
  width: 100%;
  margin: 175px 48px 58px 29px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

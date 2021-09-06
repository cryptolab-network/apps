import styled from 'styled-components';
import CardContent from '../../../components/CardContent';
import GrantCardContent from '../components/GrantCardContent';
import { ReactComponent as MedalIcon } from '../../../assets/images/medal.svg';
import { ReactComponent as PeopleIcon } from '../../../assets/images/people.svg';
import { ReactComponent as MonitorIcon } from '../../../assets/images/monitor.svg';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Portal = () => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <PortalLayout>
      <CardsLayout>
        <CardContent
          Icon={PeopleIcon}
          title={t('tools.valnom.title')}
          detail={t('tools.valnom.detail')}
          className="card-layout"
          onClick={() => {
            history.push("/valnom");
          }}
        />
        <CardContent
          Icon={MonitorIcon}
          title={t('tools.oneKv.title')}
          detail={t('tools.oneKv.detail')}
          className="card-layout"
          onClick = {() => {
            history.push("/onekv");
          }}
        />
        <CardContent
          Icon={MedalIcon}
          title={t('tools.stakingRewards.title')}
          detail={t('tools.stakingRewards.detail')}
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

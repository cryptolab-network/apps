import styled from 'styled-components';
import CardContent from '../../../components/CardContent';
import GrantCardContent from '../components/GrantCardContent';
import { ReactComponent as MedalIcon } from '../../../assets/images/medal.svg';
import { ReactComponent as PeopleIcon } from '../../../assets/images/people.svg';
import { ReactComponent as MonitorIcon } from '../../../assets/images/monitor.svg';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sendPageView } from '../../../utils/ga';
import { breakWidth } from '../../../utils/constants/layout';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

export const Portal = () => {
  sendPageView(useLocation());
  const history = useHistory();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  if (width > breakWidth.mobile) {
    return (
      <PortalLayout>
        <CardsLayout>
          <CardContent
            Icon={PeopleIcon}
            title={t('tools.valnom.title')}
            detail={t('tools.valnom.detail')}
            className="card-layout"
            onClick={() => {
              history.push('/valnom');
            }}
          />
          <CardContent
            Icon={MonitorIcon}
            title={t('tools.oneKv.title')}
            detail={t('tools.oneKv.detail')}
            className="card-layout"
            onClick={() => {
              history.push('/onekv');
            }}
          />
          <CardContent
            Icon={MedalIcon}
            title={t('tools.stakingRewards.title')}
            detail={t('tools.stakingRewards.detail')}
            className="card-layout"
            onClick={() => {
              history.push('/rewards');
            }}
          />
        </CardsLayout>
        <GrantCardContent className="card-layout" />
      </PortalLayout>
    );
  } else {
    return (
      <PortalMobileLayout>
        <CardsMobileLayout>
          <CardContent
            Icon={PeopleIcon}
            title={t('tools.valnom.title')}
            detail={t('tools.valnom.detail')}
            className="card-layout"
            onClick={() => {
              history.push('/valnom');
            }}
          />
          <GapMobile />
          <CardContent
            Icon={MonitorIcon}
            title={t('tools.oneKv.title')}
            detail={t('tools.oneKv.detail')}
            className="card-layout"
            onClick={() => {
              history.push('/onekv');
            }}
          />
          <GapMobile />
          <CardContent
            Icon={MedalIcon}
            title={t('tools.stakingRewards.title')}
            detail={t('tools.stakingRewards.detail')}
            className="card-layout"
            onClick={() => {
              history.push('/rewards');
            }}
          />
          <GapMobile />
          <GrantCardContent className="card-layout" mobile={true} />
        </CardsMobileLayout>
      </PortalMobileLayout>
    );
  }
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

const PortalMobileLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CardsMobileLayout = styled.div`
  width: 90%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const GapMobile = styled.div`
  height: 35px;
`;

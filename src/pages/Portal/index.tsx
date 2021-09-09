import styled from 'styled-components';
import Slogan from './components/Slogan';
import CardContent from '../../components/CardContent';
import { ReactComponent as MicroScopeIcon } from '../../assets/images/microscope.svg';
import { ReactComponent as EyeIcon } from '../../assets/images/eye.svg';
import { ReactComponent as BeakerIcon } from '../../assets/images/beaker.svg';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { sendPageView } from '../../utils/ga';

const Portal = () => {
  sendPageView(useLocation());
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <PortalLayout>
      <SloganLayout>
        <Slogan />
      </SloganLayout>
      <CardsLayout>
        <CardContent
          Icon={MicroScopeIcon}
          title={t('app.portal.stakingGuide.title')}
          detail={t('app.portal.stakingGuide.detail')}
          className="card-layout"
          onClick={() => {
            history.push("/guide");
          }}
        />
        <CardContent
          Icon={BeakerIcon}
          title={t('app.portal.portfolioBenchmark.title')}
          detail={t('app.portal.portfolioBenchmark.detail')}
          className="card-layout"
          onClick={() => {
            history.push("/benchmark");
          }}
        />
        <CardContent
          Icon={EyeIcon}
          title={t('app.portal.portfolioManagement.title')}
          detail={t('app.portal.portfolioManagement.detail')}
          className="card-layout"
          onClick={() => {
            history.push("/management");
          }}
        />
      </CardsLayout>
    </PortalLayout>
  );
};

export default Portal;

const PortalLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const SloganLayout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 64px;
  @media (max-height: 762px) {
    padding-bottom: 32px;
  }
`;

const CardsLayout = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

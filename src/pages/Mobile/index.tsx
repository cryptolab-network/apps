import styled from 'styled-components';
import { ReactComponent as CryptoLabLogo } from '../../assets/images/main-vertical-color-logo.svg';
import { useTranslation } from 'react-i18next';
import './index.css';

interface Props {
  isTools: boolean
}

const Mobile: React.FC<Props> = ({isTools}) => {
  const { t } = useTranslation();
  if (isTools) {
    return (
      <MobileLayout>
        <WarningLayout>
          <CryptoLabLogo style={{height: '128px'}} />
          <WarningTitle>{t('app.mobile.warning')}</WarningTitle>
          <WarningDetail>{t('app.mobile.warningDetail')}</WarningDetail>
        </WarningLayout>
      </MobileLayout>
    )
  }
  return (
    <MobileLayout>
      <WarningLayout>
        <CryptoLabLogo style={{height: '128px'}} />
        <WarningTitle>{t('app.mobile.warning')}</WarningTitle>
        <WarningDetail>{t('app.mobile.warningDetail')}</WarningDetail>
      </WarningLayout>
    </MobileLayout>
  )
}

export default Mobile;

const MobileLayout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: black;
`;

const WarningLayout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 64px;
  padding-bottom: 64px;
  @media (max-height: 762px) {
    padding-bottom: 32px;
  }
`;

const WarningTitle = styled.div`
  color: white;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  margin-top: 22px;
`;

const WarningDetail = styled.div`
  color: white;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 500;
  margin-top: 17px;
  padding: 0px 22px 0px;
  text-align: center;
`;
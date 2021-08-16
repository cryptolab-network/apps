import styled from 'styled-components';
import { ReactComponent as CryptoLabLogo } from '../../../../assets/images/main-vertical-color-logo.svg';
import './index.css';
import { useTranslation } from 'react-i18next';

const Slogan = () => {
  const { t } = useTranslation();
  return (
    <SloganLayout>
      <CryptoLabLogo id="slogan" />
      <SloganTitle>{t('app.portal.slogan')}</SloganTitle>
      <SloganDetail>
        {t('app.portal.sloganDetail')}
      </SloganDetail>
    </SloganLayout>
  );
};

export default Slogan;

const SloganLayout = styled.div`
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 12px;
`;

const SloganTitle = styled.div`
  color: white;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  margin-top: 22px;
`;

const SloganDetail = styled.div`
  color: white;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 500;
  margin-top: 17px;
`;

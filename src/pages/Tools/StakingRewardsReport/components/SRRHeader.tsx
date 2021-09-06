import styled from 'styled-components';
import { ReactComponent as MedalIcon } from '../../../../assets/images/medal.svg';

import { useTranslation } from 'react-i18next';

const SRRHeader = () => {
  const { t } = useTranslation();
  return (
    <HeaderLayout>
      <HeaderLeft>
        <MedalIcon width="38.8px" height="38px" />
        <HeaderTitle>
          <Title>{t('tools.stakingRewards.title')}</Title>
          <Subtitle>{t('tools.stakingRewards.subtitle')}</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

export default SRRHeader;

const HeaderLayout = styled.div`
  box-sizing: border-box;
  width: 80vw;
  max-height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
  max-width: 800px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Subtitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
`;

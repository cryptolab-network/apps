import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Account from '../../../../components/Account';

import { useTranslation } from 'react-i18next';

const StashInformation = ({ stashId, stashData, chain, currency }) => {
  const { t } = useTranslation();
  const [totalRewards, setTotalRewards] = useState(0);
  const [totalInFiat, setTotalInFiat] = useState(0);
  const [firstRewardDate, setFirstRewardDate] = useState('N/A');
  const [lastRewardDate, setLastRewardDate] = useState('N/A');
  useEffect(() => {
    if (stashData.eraRewards !== undefined && stashData.eraRewards !== null) {
      const totalRewards = stashData.eraRewards.reduce((acc, r) => {
        acc += r.amount;
        return acc;
      }, 0.0);
      const totalInFiat = stashData.eraRewards.reduce((acc, r) => {
        acc += r.total;
        return acc;
      }, 0.0);
      const firstRewardDate = stashData.eraRewards[stashData.eraRewards.length - 1].timestamp;
      const lastRewardDate = stashData.eraRewards[0].timestamp;
      setTotalRewards(totalRewards);
      setTotalInFiat(totalInFiat);
      setFirstRewardDate(dayjs(Number(firstRewardDate)).format('YYYY-MM-DD'));
      setLastRewardDate(dayjs(Number(lastRewardDate)).format('YYYY-MM-DD'));
    }
  }, [stashData, stashData.eraRewards]);
  return (
    <div>
      <Title>{t('tools.stakingRewards.stashInformation')}</Title>
      <HorizontalBar />
      <InformationItem>
        <InformationTitle>{t('tools.stakingRewards.stashId')}</InformationTitle>
        <Account address={stashId} display={stashId} />
      </InformationItem>
      <HorizontalBar />
      <InformationItem>
        <InformationTitle>{t('tools.stakingRewards.totalRewards')}</InformationTitle>
        <InformationContent>
          <div style={{ margin: '0 16px 0 0' }}>
            <span style={{ color: '#23beb9' }}>
              {totalRewards.toFixed(4)} {chain}
            </span>
            &nbsp; / &nbsp;
            {totalInFiat.toFixed(2)} {currency}
          </div>
          <div>
            ({t('tools.stakingRewards.from')} &nbsp;
            <span style={{ color: '#23beb9' }}>{firstRewardDate}</span>&nbsp; {t('tools.stakingRewards.to')}{' '}
            &nbsp;<span style={{ color: '#23beb9' }}>{lastRewardDate}</span>)
          </div>
        </InformationContent>
      </InformationItem>
    </div>
  );
};

export default StashInformation;

const Title = styled.div`
  width: 123px;
  height: 16px;
  margin: 0 0 11.7px 0;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
  opacity: 1;
`;

const HorizontalBar = styled.div`
  width: 100%;
  height: 0;
  border: solid 1px #404952;
`;

const InformationItem = styled.div`
  height: 16px;
  margin: 28.9px 0 28.9px 0px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
  opacity: 1;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  display: flex;
`;

const InformationTitle = styled.div`
  height: 16px;
  margin: 0 116px 0 0;
`;

const InformationContent = styled.div`
  flex-direction: row;
  justify-content: left;
  display: flex;
  flex-wrap: wrap;
`;

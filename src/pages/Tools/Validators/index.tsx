import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatBalance } from '@polkadot/util';
import {
  apiGetSingleValidator,
  apiGetValidatorSlashes,
  apiGetValidatorUnclaimedEras,
  IEraInfo,
  INominator,
  IValidatorHistory,
  IValidatorSlash,
} from '../../../apis/Validator';
import { ReactComponent as PrevArrow } from '../../../assets/images/prev-arrow.svg';
import Account from '../../../components/Account';
import CardHeader from '../../../components/Card/CardHeader';
import Chart from '../../../components/Chart';
import { useHistory } from 'react-router-dom';
import { NominatorGrid } from './NominatorGrid';
import { balanceUnit } from '../../../utils/string';
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

// object key order is matter, first is the x axis key (ex. name),
// than data1 (ex. uv), data2 (ex. pv), data3 (ex. amt),
// you can change the order when using the 'config' props to control
const mockData = [
  {
    name: 'Page A', // x axis key
    uv: 4000, // y1 axis key (first data source, left default)
    pv: 2400, // y2 axis key (second data source, right default)
    amt: 2400, // y3 axis key (third data source, right default)
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const mockData1 = [
  {
    year: '2011 A', // x axis key
    validate: 4000, // y1 axis key (first data source, left default)
    nominate: 2400, // y2 axis key (second data source, right default)
  },
  {
    year: '2011 B',
    validate: 3000,
    nominate: 1398,
  },
  {
    year: '2011 C',
    validate: 3101,
    nominate: 9800,
  },
  {
    year: '2011 D',
    validate: 2780,
    nominate: 3908,
  },
  {
    year: '2011 E',
    validate: 1890,
    nominate: 4800,
  },
  {
    year: '2011 F',
    validate: 2390,
    nominate: 3800,
  },
  {
    year: '2011 G',
    validate: 3490,
    nominate: 4300,
  },
];

const findLastEra = (info: IEraInfo[]): IEraInfo => {
  let lastEraInfo = info[0];
  info.forEach((eraInfo, i) => {
    if (eraInfo.era > lastEraInfo.era) {
      lastEraInfo = eraInfo;
    }
  });
  return lastEraInfo;
};

const ValidatorStatusHeader = ({ chain, validator }) => {
  const history = useHistory();
  const { t } = useTranslation();
  let active = 0;
  let total = 0;
  let nominatorCount = 0;
  let commission = 0;
  if (validator.info.length > 0) {
    const lastEraInfo = findLastEra(validator.info);
    total = lastEraInfo.nominators.reduce((acc, n) => {
      return (acc += n.balance.lockedBalance);
    }, 0);
    nominatorCount = lastEraInfo.nominatorCount;
    commission = lastEraInfo.commission;
  }
  const _formatBalance = useCallback(
    (value: any) => {
      return balanceUnit(chain, value);
    },
    [chain]
  );
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PrevArrowLayout>
          <PrevArrow
            onClick={() => {
              history.goBack();
            }}
          />
        </PrevArrowLayout>
        <HeaderTitle>
          <Title>
            <Account address={validator.id} display={validator.identity.display} />
          </Title>
          <Subtitle>{validator.id}</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
      <HeaderRight>
        <Exposure>
          <ExposureActive>{_formatBalance(active)}</ExposureActive>
          <span style={{ color: 'white', margin: '0 4px 0 4px' }}>/</span>
          <ExposureTotal>{_formatBalance(total)}</ExposureTotal>
        </Exposure>
        <Value>
          <ValueTitle>{t('tools.validators.apy')}:</ValueTitle>
          {(validator.averageApy * 100).toFixed(2)} %
        </Value>
        <Value>
          <ValueTitle>{t('tools.validators.nominatorCount')}:</ValueTitle>
          {nominatorCount}
        </Value>
        <Value>
          <ValueTitle>{t('tools.validators.commission')}:</ValueTitle>
          {commission} %
        </Value>
      </HeaderRight>
    </HeaderLayout>
  );
};

const ValidatorStatus = (props) => {
  const { t } = useTranslation();
  const [activeNominators, setActiveNominators] = useState<INominator[]>([]);
  const [nominators, setNominators] = useState<INominator[]>([]);
  const [selfStake, setSelfStake] = useState<string>('0');
  const [unclaimedEras, setUnclaimedEras] = useState<string>('None');
  const [slashes, setSlashes] = useState<IValidatorSlash[]>([]);
  const [validator, setValidator] = useState<IValidatorHistory>({
    id: '',
    statusChange: {
      commissionChange: 0,
    },
    identity: {
      display: '',
    },
    info: [],
    averageApy: 0,
  });
  const chain = props.match.params.chain;
  const _formatBalance = useCallback(
    (value: any) => {
      if (chain === 'KSM') {
        return formatBalance(BigInt(value), {
          decimals: 12,
          withUnit: 'KSM',
        });
      } else if (chain === 'DOT') {
        return formatBalance(BigInt(value), {
          decimals: 10,
          withUnit: 'DOT',
        });
      } else {
        return formatBalance(BigInt(value), {
          decimals: 10,
          withUnit: 'Unit',
        });
      }
    },
    [chain]
  );
  const notifyError = useCallback((msg: string) => {
    toast.error(`${msg}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
  }, []);

  useEffect(() => {
    async function getValidator() {
      // load stash data from backend
      try {
        let validator: IValidatorHistory = await apiGetSingleValidator({
          params: `${props.match.params.id}/${props.match.params.chain}`,
        });
        let unclaimedEras: number[] = await apiGetValidatorUnclaimedEras({
          params: `${props.match.params.id}/unclaimedEras/${props.match.params.chain}`,
        });
        let slashes: IValidatorSlash[] = await apiGetValidatorSlashes({
          params: `${props.match.params.id}/slashes/${props.match.params.chain}`,
        });
        // TODO: error handling not yet
        setValidator(validator);
        if (validator.info.length > 0) {
          const lastEraInfo = findLastEra(validator.info);
          const _nominators = lastEraInfo.nominators;
          setSelfStake(_formatBalance(lastEraInfo.selfStake));
          let active = _nominators.filter(({ address: id1 }) =>
            lastEraInfo.exposure.others.some(({ who: id2 }) => id2 === id1)
          );
          active = active.sort((a, b) => {
            if (a.balance.lockedBalance > b.balance.lockedBalance) {
              return -1;
            } else if (a.balance.lockedBalance < b.balance.lockedBalance) {
              return 1;
            }
            return 0;
          });
          setActiveNominators(active);
          let inactive = _nominators.filter(
            ({ address: id1 }) => !active.some(({ address: id2 }) => id2 === id1)
          );
          inactive = inactive.sort((a, b) => {
            if (a.balance.lockedBalance > b.balance.lockedBalance) {
              return -1;
            } else if (a.balance.lockedBalance < b.balance.lockedBalance) {
              return 1;
            }
            return 0;
          });
          setNominators(inactive);
          _setUnclaimedEras(unclaimedEras);
          _setSlashes(slashes);
        }
      } catch (err) {
        notifyError(err);
      }
      function _setUnclaimedEras(unclaimedEras: number[]) {
        if (unclaimedEras === undefined || unclaimedEras === null) {
          setUnclaimedEras('None');
        } else {
          if (unclaimedEras.length > 0) {
            setUnclaimedEras(unclaimedEras.length.toString() + ' eras');
          } else {
            setUnclaimedEras('None');
          }
        }
      }

      function _setSlashes(slashes: IValidatorSlash[]) {
        if (slashes === undefined || slashes === null) {
          setSlashes([]);
        } else {
          if (slashes.length > 0) {
            setSlashes(slashes);
          } else {
            setSlashes([]);
          }
        }
      }
    }
    getValidator();
  }, [props.match.params.id, props.match.params.chain, _formatBalance, notifyError]);
  return (
    <ValidatorStatusLayout>
      <MainLayout>
        <CardHeader
          Header={() => <ValidatorStatusHeader validator={validator} chain={props.match.params.chain} />}
        >
          <ValidatorInfoLayout>
            <InfoTitle>{t('tools.validators.selfStake')}: </InfoTitle>
            <InfoItem>{selfStake}</InfoItem>
            <InfoDivider />
            <InfoTitle>{t('tools.validators.unclaimedEras')}: </InfoTitle>
            <InfoItem>{unclaimedEras}</InfoItem>
            <InfoDivider />
            <InfoTitle>{t('tools.validators.slashes')}:</InfoTitle>
            <InfoItem>{slashes.length === 0 ? 'None' : slashes.length}</InfoItem>
          </ValidatorInfoLayout>
          <ChartsLayout>
            <ChartContainer>
              <Chart showTools data={mockData} leftLabel="Nominator Count" rightLabel="Commission ( % )" />
            </ChartContainer>
            <ChartContainer>
              <Chart
                data={mockData1}
                leftLabel="APY"
                config={{
                  xKey: 'year',
                  firstDataKey: 'validate',
                  secondDataKey: 'nominate',
                  firstDataYAxis: 'left',
                  secondDataYAxis: 'left',
                }}
              />
            </ChartContainer>
          </ChartsLayout>
          <ContentColumnLayout width="100%" justifyContent="flex-start">
            <ContentBlockTitle color="white">{t('tools.validators.activeNominators')}</ContentBlockTitle>
            <NominatorGrid chain={props.match.params.chain} nominators={activeNominators} />
          </ContentColumnLayout>
          <Space />
          <ContentColumnLayout width="100%" justifyContent="flex-start">
            <ContentBlockTitle color="white">{t('tools.validators.inactiveNominators')}</ContentBlockTitle>
            <NominatorGrid chain={props.match.params.chain} nominators={nominators} />
          </ContentColumnLayout>
        </CardHeader>
      </MainLayout>
    </ValidatorStatusLayout>
  );
};

export default ValidatorStatus;

const ValidatorStatusLayout = styled.div`
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

const HeaderLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const PrevArrowLayout = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 18px;
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
  width: 600px;
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
  margin: 8px 0 0 0;
`;

const Exposure = styled.div`
  display: flex;
  flex-direction: row;
  width: 240px;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: var(--nav-fg);
  margin: 0 21.4px 0 0;
`;

const ExposureActive = styled.div`
  color: #23beb9;
  margin: 0 4px 0 0;
`;

const ExposureTotal = styled.div`
  color: white;
`;

const Value = styled.div`
  display: flex;
  flex-direction: row;
  width: 160px;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: #23beb9;
  margin: 0 21.4px 0 0;
`;

const ValueTitle = styled.div`
  color: white;
  margin: 0 8px 0 0;
`;
type ContentColumnLayoutProps = {
  justifyContent?: string;
  width?: string;
};

const ChartsLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // padding: 13px 18.7px 15.7px 16px;
`;

const ChartContainer = styled.div`
  box-sizing: border-box;
  flex: 1;
  height: 500px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #2f3842;
  padding: 13px 16px 13px 16px;
  margin: 5px 4px 5px 4px;
  border-radius: 6px;
  color: white;
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
`;

const ContentColumnLayout = styled.div<ContentColumnLayoutProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : 'space-between')};
  align-items: flex-start;
  width: ${(props) => (props.width ? props.width : '90%')};
  background-color: #2f3842;
  padding: 13px 18.7px 15.7px 16px;
  border-radius: 6px;
`;
const ContentBlockTitle = styled.div`
  flex: 1;
  color: ${(props) => (props.color ? props.color : '#17222d')};
  min-height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
`;

const Space = styled.div`
  margin: 40px 0 0 0;
`;

const ValidatorInfoLayout = styled.div`
  width: 100%;
  height: 50px;
  margin: 9.6px 0 10.1px 0;
  padding: 13px 0 18.4px 0;
  display: flex;
  flex-direction: row;
  border-radius: 6px;
  background-color: #2f3842;
  padding: 0 0 0 18px;
  align-items: center;
`;

const InfoTitle = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
  margin: 0 0 0 25.4px;
`;

const InfoItem = styled.div`
  margin: 0 25.4px 0 19px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: #21aca8;
`;

const InfoDivider = styled.div`
  width: 0px;
  height: 16px;
  border: 1px solid;
  color: white;
`;

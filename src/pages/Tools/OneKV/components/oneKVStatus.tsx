import { useEffect, useMemo, useState, useContext } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { ReactComponent as MonitorIcon } from '../../../../assets/images/monitor.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import { DataContext } from '../../components/Data';
import {
  apiGetAllOneKVValidator,
  IOneKVInvalidValidator,
  IOneKVValidator,
  IOneKVValidators,
} from '../../../../apis/OneKV/validator';
import { apiGetOneKVNominators, IOneKVNominators } from '../../../../apis/OneKV/nominator';
import ValidatorTable from './oneKVValidTable';
import Button from '../../../../components/Button';
import { useCallback } from 'react';
import InvalidValidatorTable from './oneKVInvalidTable';
import { useTranslation } from 'react-i18next';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { breakWidth } from '../../../../utils/constants/layout';
import OneKvValidCard from './oneKVValidCard';
import OneKvInvalidCard from './oneKVInvalidCard';
import ScaleLoader from '../../../../components/Spinner/ScaleLoader';
import Failed from '../../../../components/Failed';
import Empty from '../../../../components/Empty';

const OneKVHeader = ({ onSeeValidClicked, seeValid }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const onClickSeeInvalid = useCallback(() => {
    onSeeValidClicked(seeValid);
  }, [onSeeValidClicked, seeValid]);
  const ValidityButton = useCallback(() => {
    if (seeValid) {
      return <Button title={t('tools.oneKv.seeInvalid')} onClick={onClickSeeInvalid} />;
    } else {
      return <Button title={t('tools.oneKv.seeValid')} onClick={onClickSeeInvalid} />;
    }
  }, [onClickSeeInvalid, seeValid, t]);
  return (
    <HeaderLayout>
      <HeaderLeft>
        <MonitorIcon width="38.8px" height="38px" />
        <HeaderTitle>
          <Title>{t('tools.oneKv.title')}</Title>
          {width <= breakWidth.mobile ? null : <Subtitle>{t('tools.oneKv.subtitle')}</Subtitle>}
        </HeaderTitle>
      </HeaderLeft>
      <HeaderRight>
        <ValidityButton />
      </HeaderRight>
    </HeaderLayout>
  );
};

const ValNomContent = ({
  valid,
  chain,
  validators,
  activeEra,
  validValidators,
  activeValidators,
  electedValidators,
  lastUpdatedTime,
}) => {
  const ValidatorTableComponent = useMemo(() => {
    if (valid) {
      return (
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 12,
            backgroundColor: '#2f3842',
            borderRadius: 6,
          }}
        >
          <ValidatorTable chain={chain} validators={validators} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 12,
            backgroundColor: '#2f3842',
            borderRadius: 6,
          }}
        >
          <InvalidValidatorTable chain={chain} validators={validators} />
        </div>
      );
    }
  }, [chain, valid, validators]);

  return <div style={{ width: '100%', boxSizing: 'border-box', padding: 4 }}>{ValidatorTableComponent}</div>;
};

export const OneKVStatus = () => {
  const enum DataLoadingStatus {
    LOADING = 'loading',
    ERROR = 'error',
    EMPTY = 'empty',
    DONE = 'done',
  }
  const { network: networkName } = useContext(DataContext);
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const chain = networkName === 'Polkadot' ? 'DOT' : 'KSM';
  const [validators, setValidators] = useState<IOneKVValidator[]>([]);
  const [invalidValidators, setInvalidValidators] = useState<IOneKVInvalidValidator[]>([]);
  const [activeEra, setActiveEra] = useState<number>(0);
  const [validValidators, setValidValidators] = useState<number>(0);
  const [activeValidators, setActiveValidators] = useState<number>(0);
  const [electedValidators, setElectedValidators] = useState<number>(0);
  const [lastUpdatedTime, setlastUpdatedTime] = useState<string>('N/A');
  const [isDataLoadingStatus, setIsDataLoadingStatus] = useState(DataLoadingStatus.LOADING);
  useEffect(() => {
    const mergeOneKVData = (oneKV: IOneKVValidators, oneKVNominators: IOneKVNominators) => {
      oneKV.valid = oneKV.valid.map((v) => {
        v.elected = false;
        // eslint-disable-next-line array-callback-return
        oneKVNominators.nominators.map((n) => {
          // eslint-disable-next-line array-callback-return
          n.current.map((p) => {
            if (p.stash === v.stash) {
              v.elected = true;
            }
          });
        });
        return v;
      });
      return oneKV;
    };
    async function getValidators() {
      try {
        let oneKV = await apiGetAllOneKVValidator({ params: chain });
        setActiveEra(oneKV.activeEra);
        setValidValidators(oneKV.validatorCount);
        setActiveValidators(oneKV.electedCount);
        const oneKVNominators = await apiGetOneKVNominators({ params: chain });
        setElectedValidators(
          oneKVNominators.nominators.reduce((acc, n) => {
            acc += n.current.length;
            return acc;
          }, 0)
        );
        oneKV = mergeOneKVData(oneKV, oneKVNominators);
        setValidators(oneKV.valid);
        setInvalidValidators(oneKV.invalid);
        setlastUpdatedTime(dayjs(oneKV.modifiedTime * 1000).toLocaleString());
        setIsDataLoadingStatus(DataLoadingStatus.DONE);
      } catch (err) {
        console.error(err);
        setIsDataLoadingStatus(DataLoadingStatus.ERROR);
      }
    }
    getValidators();
  }, [DataLoadingStatus.DONE, DataLoadingStatus.ERROR, chain]);
  const [seeValid, setSeeValid] = useState(true);
  const [filters, setFilters] = useState({
    stashId: '',
  });

  const validFilteredValidators = useMemo(() => {
    if (filters.stashId.length > 0) {
      const displayValidators: IOneKVValidator[] = [];
      validators.forEach((v) => {
        if (v.stash.toLowerCase().includes(filters.stashId.toLowerCase())) {
          displayValidators.push(v);
        } else if (v.name.toLowerCase().includes(filters.stashId.toLowerCase())) {
          displayValidators.push(v);
        }
      });
      return displayValidators;
    } else {
      return validators;
    }
  }, [validators, filters]);

  const invalidFilteredValidators = useMemo(() => {
    if (filters.stashId.length > 0) {
      const displayValidators: IOneKVInvalidValidator[] = [];
      invalidValidators.forEach((v) => {
        if (v.stash.toLowerCase().includes(filters.stashId.toLowerCase())) {
          displayValidators.push(v);
        } else if (v.name.toLowerCase().includes(filters.stashId.toLowerCase())) {
          displayValidators.push(v);
        }
      });
      return displayValidators;
    } else {
      return invalidValidators;
    }
  }, [invalidValidators, filters]);

  const onSeeValidClicked = useCallback((value) => {
    if (value === true) {
      value = false;
    } else {
      value = true;
    }
    setSeeValid(value);
  }, []);

  const OneKVTable = useCallback(
    (seeValid) => {
      if (seeValid === true) {
        if (validFilteredValidators.length === 0) {
          return <Empty />;
        } else {
          return (
            <ValNomContent
              valid={true}
              chain={chain}
              validators={validFilteredValidators}
              activeEra={activeEra}
              validValidators={validValidators}
              activeValidators={activeValidators}
              electedValidators={electedValidators}
              lastUpdatedTime={lastUpdatedTime}
            />
          );
        }
      } else {
        if (invalidFilteredValidators.length === 0) {
          return <Empty />;
        } else {
          return (
            <ValNomContent
              valid={false}
              chain={chain}
              validators={invalidFilteredValidators}
              activeEra={activeEra}
              validValidators={validValidators}
              activeValidators={activeValidators}
              electedValidators={electedValidators}
              lastUpdatedTime={lastUpdatedTime}
            />
          );
        }
      }
    },
    [
      activeEra,
      activeValidators,
      chain,
      electedValidators,
      invalidFilteredValidators,
      lastUpdatedTime,
      validFilteredValidators,
      validValidators,
    ]
  );

  const OneKvInValidCardsDOM = useMemo(() => {
    let dom: any = [];
    invalidFilteredValidators.forEach((iv) => {
      let components = iv.reasons.map((reason, i) => {
        return (
          <li key={i} style={{ wordWrap: 'break-word' }}>
            {reason}
          </li>
        );
      });
      dom.push(
        <OneKvInvalidCard
          validatorId={iv.stash}
          name={iv.name}
          reason={<div>{components}</div>}
          chain={chain}
        />
      );
    });
    if (dom.length > 0) {
      return dom;
    }
    return null;
  }, [invalidFilteredValidators, chain]);

  const OneKvValidCardsDOM = useMemo(() => {
    let dom: any = [];
    validFilteredValidators.forEach((v) => {
      dom.push(
        <OneKvValidCard
          validatorId={v.stash}
          name={v.name}
          commission={v.stakingInfo.validatorPrefs.commission}
          active={v.activeNominators}
          nominated={v.elected}
          nominatedAt={v.nominatedAt}
          order={v.nominationOrder}
          selfStake={v.selfStake}
          rank={v.rank}
          inclusion={v.inclusion}
          chain={chain}
        />
      );
    });

    return dom;
  }, [chain, validFilteredValidators]);

  const handleFilterChange = (name) => (e) => {
    // TODO: input validator, limit
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      default:
        break;
    }
  };

  const OptionBarDOM = useMemo(() => {
    if (width > breakWidth.pad) {
      return (
        <div style={{ width: '100%', boxSizing: 'border-box', padding: 4 }}>
          <OptionBar>
            <HeaderLayout>
              <HeaderLeft>
                <IconInput
                  Icon={Search}
                  iconSize="16px"
                  placeholder={t('tools.oneKv.optionBar.stashId')}
                  inputLength={256}
                  value={filters.stashId}
                  onChange={handleFilterChange('stashId')}
                />
              </HeaderLeft>
              <HeaderRight>
                <HeaderItem>
                  {t('tools.oneKv.era')}:{' '}
                  <span style={{ color: '#23b3b9', margin: '0 4px 0 4px' }}>{activeEra}</span>
                </HeaderItem>
                <HeaderItem>
                  {t('tools.oneKv.validValidators')}:{' '}
                  <span style={{ color: '#23b3b9', margin: '0 4px 0 4px' }}>{validValidators}</span>
                </HeaderItem>
                <HeaderItem>
                  {t('tools.oneKv.activeValidators')}:{' '}
                  <span style={{ color: '#23b3b9', margin: '0 4px 0 4px' }}>{activeValidators}</span>
                </HeaderItem>
                <HeaderItem>
                  {t('tools.oneKv.electedValidators')}:{' '}
                  <span style={{ color: '#23b3b9', margin: '0 4px 0 4px' }}>{electedValidators}</span>
                </HeaderItem>
                <HeaderItem>
                  {t('tools.oneKv.lastUpdateTime')}:{' '}
                  <span style={{ color: '#23b3b9', margin: '0 4px 0 4px' }}>{lastUpdatedTime}</span>
                </HeaderItem>
              </HeaderRight>
            </HeaderLayout>
          </OptionBar>
        </div>
      );
    } else {
      return (
        <div style={{ width: '100%', boxSizing: 'border-box', padding: 4 }}>
          <OptionBar>
            <HeaderLayout mobile={true}>
              <div
                style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
              >
                <IconInput
                  Icon={Search}
                  iconSize="16px"
                  placeholder={t('tools.oneKv.optionBar.stashId')}
                  value={filters.stashId}
                  onChange={handleFilterChange('stashId')}
                />
              </div>
              <HeaderRight mobile={true}>
                <HeaderItem mobile={true}>
                  <div>{t('tools.oneKv.era')}</div>
                  <div style={{ color: '#23b3b9' }}>{activeEra}</div>
                </HeaderItem>
                <HeaderItem mobile={true}>
                  <div>{t('tools.oneKv.validValidators')}</div>
                  <div style={{ color: '#23b3b9' }}>{validValidators}</div>
                </HeaderItem>
                <HeaderItem mobile={true}>
                  <div>{t('tools.oneKv.activeValidators')}</div>
                  <div style={{ color: '#23b3b9' }}>{activeValidators}</div>
                </HeaderItem>
                <HeaderItem mobile={true}>
                  <div>{t('tools.oneKv.electedValidators')}</div>
                  <div style={{ color: '#23b3b9' }}>{electedValidators}</div>
                </HeaderItem>
                <HeaderItem mobile={true}>
                  <div>{t('tools.oneKv.lastUpdateTime')}</div>
                  <div style={{ color: '#23b3b9' }}>{lastUpdatedTime}</div>
                </HeaderItem>
              </HeaderRight>
            </HeaderLayout>
          </OptionBar>
        </div>
      );
    }
  }, [
    activeEra,
    activeValidators,
    electedValidators,
    filters.stashId,
    lastUpdatedTime,
    t,
    validValidators,
    width,
  ]);

  const OneKVCards = useCallback(
    (seeValid) => {
      if (seeValid === true) {
        if (OneKvValidCardsDOM.length === 0) {
          return <Empty />;
        } else {
          return <CardsLayout>{OneKvValidCardsDOM}</CardsLayout>;
        }
      } else {
        if (OneKvInValidCardsDOM.length === 0) {
          return <Empty />;
        } else {
          return <CardsLayout>{OneKvInValidCardsDOM}</CardsLayout>;
        }
      }
    },
    [OneKvInValidCardsDOM, OneKvValidCardsDOM]
  );

  const OneKVContentDOM = useMemo(() => {
    if (isDataLoadingStatus === DataLoadingStatus.LOADING) {
      return (
        <div style={{ margin: '16px 0px 16px 0px' }}>
          <ScaleLoader />
        </div>
      );
    } else if (isDataLoadingStatus === DataLoadingStatus.ERROR) {
      return (
        <div>
          <Failed />
        </div>
      );
    } else {
      if (width > breakWidth.pad) {
        return OneKVTable(seeValid);
      } else {
        return OneKVCards(seeValid);
      }
    }
  }, [
    isDataLoadingStatus,
    DataLoadingStatus.LOADING,
    DataLoadingStatus.ERROR,
    width,
    OneKVTable,
    seeValid,
    OneKVCards,
  ]);

  return (
    <CardHeader
      Header={() => <OneKVHeader onSeeValidClicked={onSeeValidClicked} seeValid={seeValid} />}
      mainPadding="0 0 0 0"
    >
      {/* <OneKVTable seeValid={seeValid} /> */}
      <MainContainer>
        {OptionBarDOM}
        {OneKVContentDOM}
      </MainContainer>
    </CardHeader>
  );
};

const MainContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
`;

interface IHeaderLayout {
  mobile?: boolean;
}

const HeaderLayout = styled.div<IHeaderLayout>`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.mobile ? 'column' : 'row')};
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

interface IHeaderRight {
  mobile?: boolean;
}
const HeaderRight = styled.div<IHeaderRight>`
  width: ${(props) => (props.mobile ? '100%' : 'auto')};
  display: flex;
  flex-direction: ${(props) => (props.mobile ? 'column' : 'row')};
  justify-content: ${(props) => (props.mobile ? 'flex-start' : 'flex-end')};
  align-items: center;
  flex-wrap: ${(props) => (props.mobile ? 'wrap' : 'nowrap')};
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

const OptionBar = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  background-color: #2f3842;
`;

interface IHeaderItem {
  mobile?: boolean;
}
const HeaderItem = styled.div<IHeaderItem>`
  width: ${(props) => (props.mobile ? '100%' : 'auto')};
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.mobile ? 'space-between' : 'flex-start')};
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: white;
  margin: ${(props) => (props.mobile ? '0 0 0 0' : '0 20px 0 20px')};
  align-items: center;
`;

const CardsLayout = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

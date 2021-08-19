import styled from 'styled-components';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import { ReactComponent as EmptyStashIcon } from '../../../../assets/images/empty-staking-rewards.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/images/download.svg';
import { ReactComponent as FiltersIcon } from '../../../../assets/images/filter.svg';
import SRRHeader from './SRRHeader';
import { useCallback, useMemo, useState, useContext } from 'react';
import StashInformation from './StashInformation';
import { useEffect } from 'react';
import { apiGetStashRewards, IStashRewards } from '../../../../apis/StashRewards';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import SRRTable from './SRRTable';
import IconButton from '../../../../components/Button/IconButton';
import { apiGetNominatedValidators, IStatusChange, IValidator } from '../../../../apis/Validator';
import { useHistory } from 'react-router-dom';
import ValidNominator from '../../../../components/ValidNominator';
import CustomScaleLoader from '../../../../components/Spinner/ScaleLoader';
import Tooltip from '../../../../components/Tooltip';
import FilterOptions from './FilterOptions';
import DownloadOptions from './DownloadOptions';
import { balanceUnit, validateAddress } from '../../../../utils/string';
import { DataContext } from '../../components/Data';
import Dialog from '../../../../components/Dialog';
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';
import SRRChart from './SRRChart';
import Button from '../../../../components/Button';

interface ISRRFilters {
  stashId: string;
  startDate: string;
  endDate: string;
  currency: string;
  startBalance: number;
}

const ValidatorComponents = ({ chain, validators }) => {
  const history = useHistory();
  const _formatBalance = useCallback(
    (value: any) => {
      return balanceUnit(chain, value);
    },
    [chain]
  );
  const validatorComponents = useMemo(() => {
    const openValidatorStatus = (id: any) => {
      history.push(`/validator/${id}/${chain}`);
    };
    return validators.map((v: { id: string; identity: { display: string; }; info: { exposure: { total: any; }; total: any; commission: number; nominatorCount: number; unclaimedEras: string | any[]; }; averageApy: number; statusChange: IStatusChange; favorite: boolean; }, idx: any) => {
      return (
        <Grid item xs={6} sm={4} md={3} lg={3} xl={2}>
          <ValidNominator
            address={v.id}
            name={v.identity.display}
            activeAmount={_formatBalance(v.info.exposure.total)}
            totalAmount={_formatBalance(v.info.total)}
            apy={(v.averageApy * 100).toFixed(2)}
            commission={v.info.commission}
            count={v.info.nominatorCount}
            statusChange={v.statusChange}
            unclaimedPayouts={v.info.unclaimedEras.length}
            favorite={v.favorite}
            onClick={() => openValidatorStatus(v.id)}
          ></ValidNominator>
        </Grid>
      );
    });
  }, [_formatBalance, chain, history, validators]);
  if (validatorComponents.length > 0) {
    return (
      <Grid container spacing={3} style={{ justifyContent: 'space-between' }}>
        {validatorComponents}
      </Grid>
    );
  } else {
    return <div></div>;
  }
};

enum State {
  EMPTY,
  LOADING,
  LOADING_VALIDATORS,
  LOADED,
  ERROR,
}

const SRRContent = ({
  filters,
}) => {
  const { t } = useTranslation();
  const { network: networkName } = useContext(DataContext);
  const chain = networkName === 'Polkadot' ? 'DOT' : 'KSM';
  const [validators, setValidators] = useState<IValidator[]>([]);
  const [state, setState] = useState<State>(State.EMPTY);
  const [stashData, setStashData] = useState<IStashRewards>({
    stash: '',
    eraRewards: [],
  });
  const [_filters, setFilters] = useState<ISRRFilters>(filters);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const notifyWarn = useCallback((msg: string) => {
    toast.warn(`${msg}`, {
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
    setState(State.EMPTY);
    setStashData({
      stash: '',
      eraRewards: [],
    });
    async function getStashRewards() {
      if (!validateAddress(filters.stashId)) {
        return;
      }
      setState(State.LOADING);
      const s = await apiGetStashRewards({
        params: filters.stashId,
        query: {
          startDate: _filters.startDate || '2020-01-01',
          endDate: _filters.endDate || moment().format('YYYY-MM-DD'),
          currency: _filters.currency || 'USD',
          startBalance: _filters.startBalance || 0.1,
        },
      }).catch((err) => {
        setState(State.ERROR);
        notifyWarn(t('tools.stakingRewards.noRewards'));
      });
      if (s === undefined || s === null) {
        return;
      }
      setStashData(s!);
      try {
        setState(State.LOADING_VALIDATORS);
        const validators = await apiGetNominatedValidators({
          params: `/stash/${s!.stash}/${chain}`,
        });
        setValidators(validators);
      } finally {
        setState(State.LOADED);
      }
    }
    if (filters.stashId.length > 0) {
      getStashRewards();
    }
  }, [chain, _filters.currency, _filters.endDate, _filters.startBalance, _filters.startDate, _filters.stashId, notifyWarn, t, _filters.stashId.length, filters.stashId.length, filters]);

  const [showFilters, toggleFilters] = useState(false);
  const onShowFilters = useCallback(() => {
    toggleFilters(true);
  }, []);
  const handleOptionToggle = useCallback((visible) => {
    console.log('visible: ', visible);
    toggleFilters(visible);
  }, []);

  const [showDownload, toggleDownload] = useState(false);
  const onShowDownload = useCallback(() => {
    toggleDownload(true);
  }, []);
  const handleDownloadToggle = useCallback((visible) => {
    toggleDownload(visible);
  }, []);

  const handleDialogOpen = useCallback((name) => {
    switch (name) {
      case 'filters':
        setFilterDialogVisible(true);
        break;
    }
  }, []);

  const handleDialogClose = useCallback((name) => {
    switch (name) {
      case 'filters':
        setFilterDialogVisible(false);
        break;
    }
  }, []);

  const handleFilterCancel = () => {
    setFilterDialogVisible(false);
  };

  const handleFilterConfirm = useCallback((sDate: string, eDate: string, currency: string, startBalance: number) => {
    setFilters({
      stashId: filters.stashId,
      startDate: sDate,
      endDate: eDate,
      currency: currency,
      startBalance: startBalance,
    });
    setFilterDialogVisible(false);
  }, [filters.stashId]);

  const FilterOptionsLayout = useMemo(() => {
    return (
      <FilterOptions
        startDate={_filters.startDate}
        endDate={_filters.endDate}
        currency={_filters.currency}
        startBalance={_filters.startBalance}
        onCancel={handleFilterCancel}
        onConfirm={handleFilterConfirm}
      />
    );
  }, [_filters.currency, _filters.endDate, _filters.startBalance, _filters.startDate, handleFilterConfirm]);

  const DownloadOptionsLayout = useMemo(() => {
    return <DownloadOptions stashId={_filters.stashId} />;
  }, [_filters.stashId]);

  if (state === State.EMPTY) {
    return (
      <EmptyStashIconLayout>
        <EmptyStashIcon />
        <EmptyStashDescription>{t('tools.stakingRewards.description')}</EmptyStashDescription>
      </EmptyStashIconLayout>
    );
  } else if (state === State.LOADED || state === State.LOADING_VALIDATORS) {
    return (
      <StashRewardsLayout>
        <Dialog
          isOpen={filterDialogVisible}
          handleDialogClose={() => {
            handleDialogClose('filters');
          }}
          padding="16px"
        >
          {FilterOptionsLayout}
        </Dialog>
        <StashInformationLayout>
          <StashInformation stashId={filters.stashId} stashData={stashData} currency={_filters.currency} />
        </StashInformationLayout>

        <ContentLayout>
          <div style={{ flex: 1 }}>
            <Toolbar>
              <Tooltip
                content={DownloadOptionsLayout}
                visible={showDownload}
                tooltipToggle={handleDownloadToggle}
              >
                <IconButton onClick={onShowDownload} Icon={() => <DownloadIcon />} />
              </Tooltip>
              <div style={{ margin: '0 0 0 16px' }}></div>
              <Tooltip content={FilterOptionsLayout} visible={showFilters} tooltipToggle={handleOptionToggle}>
                <IconButton onClick={onShowFilters} Icon={() => <FiltersIcon />} />
              </Tooltip>

              <div
                onClick={() => {
                  handleDialogOpen('filters');
                }}
              >
                <FiltersIcon />
              </div>

              <div style={{ margin: '0 16px 0 0' }}></div>
            </Toolbar>
            <SRRTable currency={filters.currency} stashData={stashData.eraRewards} />
          </div>
          <div style={{ flex: 1, width: '100%', height: 500, "marginLeft": '16px' }}>
          <SRRChartLayout>
            <SRRChart stashData={stashData} chain={chain} />
          </SRRChartLayout>
          </div>
        </ContentLayout>
        <ValidatorComponents chain={chain} validators={validators} />
      </StashRewardsLayout>
    );
  } else if (state === State.LOADING) {
    return <CustomScaleLoader />;
  } else {
    return (
      <EmptyStashIconLayout>
        <EmptyStashIcon />
        <EmptyStashDescription>{t('tools.stakingRewards.enter')}</EmptyStashDescription>
      </EmptyStashIconLayout>
    );
  }
};

const SRRLayout = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ISRRFilters>({
    stashId: '',
    startDate: '2020-01-01',
    endDate: moment().format('YYYY-MM-DD'),
    currency: 'USD',
    startBalance: 0.1,
  });
  const handleFilterChange = (name: string) => (e: { target: { value: any; }; }) => {
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      default:
        break;
    }
  };

  return (
    <SRRContentLayout>
      <OptionBar>
        <HeaderLayout>
          <HeaderLeft>
            <IconInput
              Icon={Search}
              iconSize="16px"
              placeholder={t('tools.stakingRewards.optionBar.title')}
              inputLength={512}
              value={filters.stashId}
              onChange={handleFilterChange('stashId')}
            />
          </HeaderLeft>
        </HeaderLayout>
      </OptionBar>
      <SRRContent
        filters={filters}
      />
    </SRRContentLayout>
  );
};

const SRRStatus = () => {
  return (
    <CardHeader Header={() => <SRRHeader />}>
      <SRRLayout />
    </CardHeader>
  );
};

export default SRRStatus;

const HeaderLayout = styled.div`
  width: 80vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 0 0 0 13.8px;
`;

const OptionBar = styled.div`
  width: 100%;
  height: 62px;
  padding: 12px 0px 0px 0;
  border-radius: 6px;
  background-color: #2f3842;
  margin: 0 0 9px 0;
`;

const SRRContentLayout = styled.div`
  width: 80vw;
`;

const EmptyStashIconLayout = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const EmptyStashDescription = styled.div`
  width: 406px;
  height: 22px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: white;
  margin: 24.5px 0 0 0;
`;

const StashRewardsLayout = styled.div`
  width: 100%;
  margin: 9.6px 0 10.1px 0;
  padding: 13px 0 18.4px 0;
  display: flex;
  flex-direction: column;
`;

const StashInformationLayout = styled.div`
  border-radius: 6px;
  background-color: rgba(35, 190, 185, 0.1);
  padding: 16px 0 0 0;
  margin: 0 0 26px 0;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const ContentLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // padding: 13px 18.7px 15.7px 16px;
`;

const SRRChartLayout = styled.div`
width: 100%;
height: 500px;
  font-family: Montserrat;
  font-size: 9px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: right;
  color: #9099a8;
`;
import { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as PeopleIcon } from '../../../../assets/images/people.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import { ReactComponent as OptionIcon } from '../../../../assets/images/option-icon.svg';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import ValidNominator from '../../../../components/ValidNominator';
import { lsGetFavorites } from '../../../../utils/localStorage';
import { apiGetAllValidator, IValidator } from '../../../../apis/Validator';
import { useHistory } from 'react-router-dom';
import Tooltip from '../../../../components/Tooltip';
import DropdownCommon from '../../../../components/Dropdown/Common';
import {
  filterOptionDropdownList,
  filterOptions,
  IValidatorFilter,
  toValidatorFilter,
} from './filterOptions';
import { Grid } from '@material-ui/core';
// import { ApiContext } from '../../../../components/Api';
import { DataContext } from '../../components/Data';
import { balanceUnit } from '../../../../utils/string';
import { NetworkConfig } from '../../../../utils/constants/Network';
import { toast } from 'react-toastify';
import CustomScaleLoader from '../../../../components/Spinner/ScaleLoader';
import Pagination from '../../../../components/Pagination';

import { useTranslation } from 'react-i18next';

const ValNomHeader = () => {
  const { t } = useTranslation();
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PeopleIcon />
        <HeaderTitle>
          <Title>{t('tools.valnom.title')}</Title>
          <Subtitle>
            {t('tools.valnom.subtitle')}
          </Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

interface iOption {
  label: string;
  value: number;
}

const ValidatorGrid = ({ filters, validators }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { network: networkName } = useContext(DataContext);
  const chain = NetworkConfig[networkName].token;
  const _formatBalance = useCallback(
    (value: any) => {
      return balanceUnit(chain, value);
    },
    [chain]
  );

  const sortValidators = (validators: IValidator[], filters: IValidatorFilter): IValidator[] => {
    // if filters.stashId is not empty
    if (filters.stashId.length > 0) {
      return validators.reduce((acc: Array<IValidator>, v: IValidator, idx: number) => {
        if (
          v.id.toLowerCase().includes(filters.stashId.toLowerCase()) ||
          v.identity.display.toLowerCase().includes(filters.stashId.toLowerCase())
        ) {
          acc.push(v);
        }
        return acc;
      }, []);
    } else {
      // sort by apy or commission
      if (filters.apy === true) {
        validators = validators.sort((a: IValidator, b: IValidator) => {
          if (a.averageApy > b.averageApy) {
            return -1;
          } else if (a.averageApy < b.averageApy) {
            return 1;
          }
          return 0;
        });
      } else if (filters.commission === true) {
        validators = validators.sort((a: IValidator, b: IValidator) => {
          if (a.info.commission > b.info.commission) {
            return -1;
          } else if (a.info.commission < b.info.commission) {
            return 1;
          }
          return 0;
        });
      } else if (filters.alphabetical === true) {
        validators = validators.sort((a: IValidator, b: IValidator) => {
          if (a.identity.display > b.identity.display) {
            return 1;
          } else if (a.identity.display < b.identity.display) {
            return -1;
          }
          return 0;
        });
      }
      // put cryptoLab related to the top
      // put status changed nodes to the top
      if (filters.status === true) {
        const statusChangedValidators = validators.reduce(
          (acc: Array<IValidator>, v: IValidator, idx: number) => {
            if (v.statusChange.commissionChange !== 0) {
              acc.push(v);
              validators.splice(idx, 1);
            }
            return acc;
          },
          []
        );
        validators.unshift(...statusChangedValidators);
      }
      // read favorite from localstorage
      const favoriteValidatorsStr = lsGetFavorites();
      // eslint-disable-next-line array-callback-return
      favoriteValidatorsStr.map((id) => {
        const favoriteValidators = validators.reduce((acc: Array<IValidator>, v: IValidator, idx: number) => {
          if (v.id === id) {
            acc.push(v);
            v.favorite = true;
            validators.splice(idx, 1);
          }
          return acc;
        }, []);
        validators.unshift(...favoriteValidators);
      });
    }
    // find favorites and put them to the top
    return validators;
  };
  const [displayValidators, setDisplayValidators] = useState<IValidator[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  useEffect(() => {
    try {
      setDisplayValidators(sortValidators(validators, filters).slice(page * 24, page * 24 + 24));
      setPageCount(Math.ceil(validators.length / 24));
    } catch (err) {
      console.error(err);
    }
  }, [filters, page, validators]);
  const validatorComponents = useMemo(() => {
    const openValidatorStatus = (id) => {
      history.push(`/validator/${id}/${chain}`);
    };
    return displayValidators.map((v, idx) => {
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
  }, [_formatBalance, chain, history, displayValidators]);
  if (validatorComponents.length > 0) {
    return (
      <GridLayout>
        <Grid container spacing={3} style={{ justifyContent: 'flex-start' }}>
          {validatorComponents}
        </Grid>
        <div style={{margin: '20px 0 0 0'}}></div>
        <Pagination
          canNextPage={page < pageCount ? true: false}
          canPreviousPage={page > 0 ? true: false}
          pageOptions={{}}
          pageCount={pageCount}
          gotoPage={(p) => {
            setPage(p);
          }}
          nextPage={() => {
            if (page < pageCount - 1) {
              setPage(page + 1);
            }
          }}
          previousPage={() => {
            if (page > 0) {
              setPage(page - 1);
            }
          }}
        ></Pagination>
      </GridLayout>
    );
  } else {
    return <div></div>;
  }
};

const ValNomContent = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    stashId: '',
    strategy: { label: filterOptions[0], value: 1 },
  });
  const { network: networkName } = useContext(DataContext);
  const chain = NetworkConfig[networkName].token;
  const [validators, setValidators] = useState<IValidator[]>([]);
  const handleFilterChange = (name) => (e) => {
    console.log('e: ', e);
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      case 'sorting':
        setFilters((prev) => ({ ...prev, strategy: e }));
        break;
      default:
        break;
    }
  };
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
  const [options, setFilterOptions] = useState<iOption[]>([]);
  const [isLoading, toggleLoading] = useState<boolean>(false);
  useEffect(() => {
    setFilterOptions(filterOptionDropdownList);
    async function getValidators() {
      try {
        toggleLoading(true);
        let validators = await apiGetAllValidator({ params: chain });
        setValidators(validators);
        if (validators.length === 0) {
          notifyError('Empty response. We are collecting data, please retry later.');
        }
      } catch (err) {
        console.error(err);
        notifyError(err);
      } finally {
        toggleLoading(false);
      }
    }
    getValidators();
  }, [chain, notifyError]);

  const filtersDOM = useMemo(() => {
    return (
      <FilterOptionLayout>
        <AdvancedOption>
          <span style={{ color: '#fff' }}>{t('tools.valnom.filters.sorting')}</span>
          <div style={{ marginLeft: 16, width: '120px' }}>
            <DropdownCommon
              style={{ flex: 1, width: '90%' }}
              options={options}
              value={filters.strategy}
              onChange={handleFilterChange('sorting')}
              theme="dark"
            />
          </div>
        </AdvancedOption>
      </FilterOptionLayout>
    );
  }, [filters.strategy, options, t]);
  const [showFilters, toggleFilters] = useState(false);
  const onShowFilters = useCallback(() => {
    toggleFilters(true);
  }, []);
  const handleOptionToggle = useCallback((visible) => {
    toggleFilters(visible);
  }, []);
  if (isLoading) {
    return (
      <CustomScaleLoader
      />
    );
  }
  return (
    <ValNomContentLayout>
      <OptionBar>
        <HeaderLayout>
          <HeaderLeft>
            <IconInput
              Icon={Search}
              iconSize="16px"
              placeholder="Polkadot/Kusama Stash ID"
              inputLength={256}
              value={filters.stashId}
              onChange={handleFilterChange('stashId')}
            />
          </HeaderLeft>
          <HeaderRight>
            <Tooltip content={filtersDOM} visible={showFilters} tooltipToggle={handleOptionToggle}>
              <div onClick={onShowFilters}>
                <OptionIcon />
              </div>
            </Tooltip>
          </HeaderRight>
        </HeaderLayout>
      </OptionBar>
      <ValidatorGrid filters={toValidatorFilter(filters)} validators={validators} />
    </ValNomContentLayout>
  );
};

const ValNomStatus = () => {
  return (
    <CardHeader Header={() => <ValNomHeader />}>
      <ValNomContent />
    </CardHeader>
  );
};

export default ValNomStatus;

const HeaderLayout = styled.div`
  width: 80vw;
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
  margin: 0 15.4px 0 0;
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
  width: 1400px;
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
  width: 100%;
  height: 62px;
  padding: 12px 0px 0px 13.8px;
  border-radius: 6px;
  background-color: #2f3842;
  margin: 0 0 9px 0;
`;

const ValNomContentLayout = styled.div`
  width: 80vw;
`;

const FilterOptionLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const AdvancedOption = styled.div`
  margin-top: 4px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #23beb9;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
`;

const GridLayout = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
`;

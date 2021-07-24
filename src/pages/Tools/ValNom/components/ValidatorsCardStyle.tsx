import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as PeopleIcon } from '../../../../assets/images/people.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import { ReactComponent as OptionIcon } from '../../../../assets/images/option-icon.svg';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import { useAppSelector } from '../../../../hooks';
import { formatBalance } from '@polkadot/util';
import { Responsive, WidthProvider } from 'react-grid-layout';
import ValidNominator from '../../../../components/ValidNominator';
import { lsGetFavorites } from '../../../../utils/localStorage';
import { apiGetAllValidator, IValidator } from '../../../../apis/Validator';
import { useHistory } from 'react-router-dom';
import Tooltip from '../../../../components/Tooltip';
import DropdownCommon from '../../../../components/Dropdown/Common';
import { filterOptionDropdownList, filterOptions, FilterState, IValidatorFilter, toValidatorFilter } from './filterOptions';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ValNomHeader = () => {
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PeopleIcon />
        <HeaderTitle>
          <Title>Validator / Nominator Status</Title>
          <Subtitle>
            See filtered validator status or enter a nominator stash ID to see its nominated validators
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

const ValidatorGrid = ({filters}) => {
  const history = useHistory();
  const networkName = useAppSelector(state => state.network.name);
  const chain = (networkName === 'Polkadot') ? "DOT" : "KSM";
  const [validators, setValidators] = useState<IValidator[]>([]);
  const _formatBalance = useCallback((value: any) => {
    if (chain === 'KSM') {
      return (formatBalance(BigInt(value), {
        decimals: 12,
        withUnit: 'KSM'
      }));
    } else if (chain === 'DOT') {
      console.log(value);
      return (formatBalance(BigInt(value), {
        decimals: 10,
        withUnit: 'DOT'
      }));
    } else {
      return (formatBalance(BigInt(value), {
        decimals: 10,
        withUnit: 'Unit'
      }));
    }
  }, [chain]);
  const sortValidators = (validators: IValidator[], filters: IValidatorFilter): IValidator[] => {
    // if filters.stashId is not empty
    if (filters.stashId.length > 0) {
      return validators.reduce((acc: Array<IValidator>, v: IValidator, idx: number) => {
        if (v.id === filters.stashId) {
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
  useEffect(() => {
    console.log(`chain = ${chain}`);
    async function getValidators() {
      try {
        let validators = await apiGetAllValidator({ params: chain });
        validators = sortValidators(validators, filters);
        setValidators(validators.slice(0, 24));
      } catch (err) {
        console.error(err);
      }
    }
    getValidators();
  }, [chain, filters]);
  const [cols, setCols] = useState(6);
  const onBreakpointChange = (newBreakpoint: string, newCols: number) => {
    setCols(newCols);
  };
  const validatorComponents = useMemo(() => {
    const openValidatorStatus = (id) => {
      history.push(`/validator/${id}/${chain}`);
    };
    return validators.map((v, idx) => {
      const x = idx % cols;
      const y = Math.floor(idx / cols);
      return (
        <div key={idx} data-grid={{ x: x, y: y, w: 1, h: 1, static: true }}>
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
        </div>);
      });
  }, [_formatBalance, chain, cols, history, validators])
  if (validatorComponents.length > 0) {
    return (
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
        rowHeight={300}
        onBreakpointChange={onBreakpointChange}
      >
        {validatorComponents}
      </ResponsiveGridLayout>
    );
  } else {
    return <div></div>;
  }
};

const ValNomContent = () => {
  const [filters, setFilters] = useState({
    stashId: '',
    strategy: filterOptions[0],
  });
  const handleFilterChange = (name) => (e) => {
    // TODO: input validator, limit
    console.log(e);
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      case 'sorting':
        setFilters((prev) => ({ ...prev, strategy: filterOptions[e.value - 1] }))
        break;
      default:
        break;
    }
  };
  const [options, setFilterOptions] = useState<iOption[]>([]);
  useEffect(() => {
    setFilterOptions(filterOptionDropdownList);
  }, []);
  const filtersDOM = useMemo(() => {
    return (
      <FilterOptionLayout>
        <AdvancedOption>
          <span style={{ color: '#fff' }}>Sorting</span>
          <div style={{ marginLeft: 16, width: '120px' }}>
            <DropdownCommon
              style={{ flex: 1, width: '90%' }}
              options={options}
              value={filters.strategy}
              onChange={handleFilterChange('sorting')}
            />
          </div>
        </AdvancedOption>
      </FilterOptionLayout>
    );
  }, [filters.strategy, options]);
  const [showFilters, toggleFilters] = useState(false);
  const onShowFilters = useCallback(() => {
    toggleFilters(true);
  }, []);
  const handleOptionToggle = useCallback((visible) => {
    toggleFilters(visible);
  }, []);
  return (
    <ValNomContentLayout>
      <OptionBar>
      <HeaderLayout>
        <HeaderLeft>
          <IconInput
            Icon={Search}
            iconSize="16px"
            placeholder="Polkadot/Kusama StashId"
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
      <ValidatorGrid filters={toValidatorFilter(filters)} />
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
`;

const ValNomContentLayout = styled.div`
  width: 100%;
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
